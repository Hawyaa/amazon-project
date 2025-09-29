import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import Layout from "../../components/Layout/Layout.jsx";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import axiosInstance from "../../Api/axios";
import { db } from "../../Utility/firebase";
import { collection, doc, setDoc, serverTimestamp } from "firebase/firestore";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  console.log(user);

  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    console.log(e);
    e?.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setCardError(null);

    try {
      console.log("Step 1: Creating payment intent for amount:", total * 100);

      // 1. backend || functions --> contact to the client secret
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });

      console.log("Step 2: Full response:", response);
      console.log("Step 3: Response data:", response.data);

      // FIX: Check both possible field names for client secret
      const clientSecret =
        response.data.client_secret || response.data.clientSecret;
      const paymentIntentId = response.data.paymentIntentId || response.data.id;

      console.log("Step 4: Client secret found:", clientSecret);
      console.log("Step 5: Payment intent ID:", paymentIntentId);

      if (!clientSecret) {
        console.error(
          "No client secret in response. Full response:",
          response.data
        );
        throw new Error(
          "No client secret received. Check backend response format."
        );
      }

      console.log("Step 6: Confirming card payment with client secret");

      // 2. client side (react side confirmation)
      const { paymentIntent, error } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.displayName || "Customer",
              email: user?.email,
            },
          },
        }
      );

      console.log("Step 7: Stripe confirmation result:", {
        paymentIntent,
        error,
      });

      if (error) {
        console.error("Payment error:", error);
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      console.log("Step 8: Payment confirmation:", paymentIntent);

      // 3. after the confirmation --> order firestore database save, clear basket
      if (paymentIntent.status === "succeeded") {
        console.log("Step 9: Payment succeeded!");
        setSuccess(true);
        setCardError(null);

        // Save order to Firestore
        await saveOrderToFirestore(paymentIntent);

        // Clear basket
        dispatch({
          type: "EMPTY_BASKET",
        });

        // Redirect to orders page after 2 seconds
        setTimeout(() => {
          window.location.href = "/orders";
        }, 2000);
      }
    } catch (error) {
      console.error("Payment error:", error);
      setCardError(error.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  const saveOrderToFirestore = async (paymentIntent) => {
    try {
      if (!user) {
        throw new Error("No user logged in");
      }

      const orderData = {
        basket: basket,
        amount: total,
        created: serverTimestamp(),
        status: "completed",
        payment_id: paymentIntent.id,
        customer_email: user.email,
        shipping_address: {
          email: user.email,
          address: "123 React Lane, Chicago, IL", // You can make this dynamic
        },
      };

      // Create a new order document in the user's orders subcollection
      const orderRef = doc(collection(db, "users", user.uid, "orders"));
      await setDoc(orderRef, orderData);

      console.log("Order saved to Firestore with ID:", orderRef.id);
    } catch (error) {
      console.error("Error saving order to Firestore:", error);
      throw error; // Re-throw to handle in the main function
    }
  };

  return (
    <Layout>
      {/* header */}
      <div className={classes.payment__header}>
        Checkout ({totalItem}) items
      </div>

      {/* payment method */}
      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Chicago, IL</div>
          </div>
        </div>
        <hr />

        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* payment method */}
        <div className={classes.flex}>
          <h3>Payment Method</h3>
          <div className={classes.payment__card__container}>
            <div className={classes.payment__details}>
              <form onSubmit={handlePayment}>
                {/* error */}
                {cardError && (
                  <div className={classes.cardError}>{cardError}</div>
                )}

                {/* card element */}
                <CardElement
                  onChange={handleChange}
                  options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                    },
                  }}
                />

                {/* price and button */}
                <div className={classes.payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order |</p>
                      <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button
                    type="submit"
                    disabled={!stripe || processing || cardError || success}
                    className={classes.payment__button}
                  >
                    {processing
                      ? "Processing..."
                      : success
                      ? "Payment Successful!"
                      : "Pay Now"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {success && (
          <div className={classes.success}>
            Payment successful! Redirecting to orders...
          </div>
        )}
      </section>
    </Layout>
  );
}

export default Payment;
