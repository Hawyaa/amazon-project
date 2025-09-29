import React, { useContext } from "react";
import Layout from "../../components/Layout/Layout";
import { DataContext } from "../../components/DataProvider/DataProvider";
import CurrencyFormat from "../../components/CurrencyFormat/CurrencyFormat";
import { Link } from "react-router-dom";
import { Type } from "../../Utility/action.type";
import classes from "./Cart.module.css";

function Cart() {
  const [{ basket, user }, dispatch] = useContext(DataContext);

  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  const increaseQuantity = (item) => {
    dispatch({
      type: Type.INCREASE_QUANTITY,
      id: item.id,
    });
  };

  const decreaseQuantity = (item) => {
    if (item.amount > 1) {
      dispatch({
        type: Type.DECREASE_QUANTITY,
        id: item.id,
      });
    } else {
      dispatch({
        type: Type.REMOVE_FROM_BASKET,
        id: item.id,
      });
    }
  };

  const removeFromCart = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id,
    });
  };

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.cart_container}>
          <h2>Hello {user?.email}</h2>
          <h3>Your shopping basket ({basket?.length} items)</h3>
          <hr />
          {basket?.length === 0 ? (
            <p>Oops! No items in your cart</p>
          ) : (
            <div className={classes.cart_items}>
              {basket?.map((item, i) => (
                <div key={i} className={classes.cart_item}>
                  <img
                    src={item.image}
                    alt={item.title}
                    className={classes.cart_item_image}
                  />
                  <div className={classes.cart_item_details}>
                    <h4 className={classes.cart_item_title}>{item.title}</h4>
                    <p className={classes.cart_item_description}>
                      {item.description?.substring(0, 100)}...
                    </p>
                    <div className={classes.cart_item_rating}>
                      <span>Rating: {item.rating?.rate}</span>
                      <span>({item.rating?.count} reviews)</span>
                    </div>
                    <div className={classes.cart_item_price}>
                      <CurrencyFormat amount={item.price} />
                    </div>

                    <div className={classes.quantity_controls}>
                      <button
                        onClick={() => decreaseQuantity(item)}
                        className={classes.quantity_button}
                      >
                        -
                      </button>
                      <span className={classes.quantity_display}>
                        {item.amount}
                      </span>
                      <button
                        onClick={() => increaseQuantity(item)}
                        className={classes.quantity_button}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={classes.remove_button}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {basket?.length !== 0 && (
          <div className={classes.subtotal}>
            <div className={classes.subtotal_summary}>
              <p>Subtotal ({basket?.length} items)</p>
              <CurrencyFormat amount={total} />
            </div>
            <div className={classes.gift_option}>
              <input type="checkbox" id="gift" />
              <label htmlFor="gift">This order contains a gift</label>
            </div>
            <Link to="/payments" className={classes.checkout_button}>
              Continue to checkout
            </Link>
          </div>
        )}
      </section>
    </Layout>
  );
}

export default Cart;
