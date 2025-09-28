import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import Rating from '@mui/material/Rating';
import CurrencyFormat from '../CurrencyFormat/CurrencyFormat';
import classes from './Product.module.css';
import { DataContext } from '../DataProvider/DataProvider';
import { Type } from '../../Utility/action.type';

function ProductCard({ product }) {
  const { image, title, id, rating, price, description } = product;
  const [state, dispatch] = useContext(DataContext);

  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item: { image, title, id, rating, price, description }
    });
  };

  return (
    <div className={classes.productCard}>
      <Link to={`/product/${id}`}>
        <img src={image} alt={title} className={classes.productImage} />
      </Link>
      <div className={classes.productInfo}>
        <h3 className={classes.productTitle}>{title}</h3>
        <div className={classes.ratingContainer}>
          <Rating 
            value={rating?.rate} 
            precision={0.1} 
            readOnly 
            size="small"
          />
          <span>({rating?.count})</span>
        </div>
        <div className={classes.productPrice}>
          <CurrencyFormat amount={price} />
        </div>
        <button className={classes.addToCartButton} onClick={addToCart}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;