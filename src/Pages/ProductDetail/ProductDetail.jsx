import React, { useEffect, useState } from "react";
import classes from "./ProductDetail.module.css";
import Layout from "../../components/Layout/Layout.jsx";
import { useParams } from "react-router-dom";
import axios from "axios";
import { productUrl } from "../../Api/endPoints";
import Loader from "../../components/Loader/Loader";

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`${productUrl}/products/${productId}`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log("API Error:", err);
        setError("Failed to load product details");
        setLoading(false);
      });
  }, [productId]);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <div className={classes.errorContainer}>
          <h2>{error || "Product not found"}</h2>
          <p>
            The product you're looking for doesn't exist or couldn't be loaded.
          </p>
          <a href="/" className={classes.homeLink}>
            Return to Home
          </a>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={classes.productDetailContainer}>
        <div className={classes.productImageSection}>
          <img
            src={product.image}
            alt={product.title}
            className={classes.productDetailImage}
          />
        </div>

        <div className={classes.productInfoSection}>
          <h1 className={classes.productTitle}>{product.title}</h1>

          <div className={classes.ratingSection}>
            <span className={classes.rating}>{product.rating.rate} ★</span>
            <span className={classes.ratingCount}>
              ({product.rating.count} reviews)
            </span>
          </div>

          <div className={classes.priceSection}>
            <span className={classes.price}>${product.price}</span>
          </div>

          <div className={classes.descriptionSection}>
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className={classes.actionButtons}>
            <button className={classes.addToCartBtn}>Add to Cart</button>
            <button className={classes.buyNowBtn}>Buy Now</button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ProductDetail;
