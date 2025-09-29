import React, { useContext, useState, useEffect } from "react";
import Layout from "../../components/Layout/Layout.jsx";
import classes from "./Orders.module.css";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../components/DataProvider/DataProvider";
import ProductCard from "../../components/Product/ProductCard";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

function Orders() {
  const [{ user }, dispatch] = useContext(DataContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      const ordersQuery = query(
        collection(db, "users", user.uid, "orders"),
        orderBy("created", "desc")
      );

      const unsubscribe = onSnapshot(ordersQuery, (snapshot) => {
        const ordersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setOrders(ordersData);
        console.log("Orders loaded:", ordersData);
      });

      return () => unsubscribe();
    } else {
      setOrders([]);
    }
  }, [user]);

  return (
    <Layout>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <h2>Your Orders</h2>
          <div>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map((order, index) => (
                <div key={order.id} className={classes.order}>
                  <h3>Order #{index + 1}</h3>
                  <p>Order ID: {order.id}</p>
                  <p>Amount: ${order.data.amount}</p>
                  <p>Status: {order.data.status}</p>
                  <div>
                    {order.data.basket?.map((item) => (
                      <ProductCard key={item.id} product={item} flex={true} />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}

export default Orders;
