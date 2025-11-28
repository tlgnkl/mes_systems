import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCartAsync } from '../../store/actions/cartActions';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      await dispatch(addToCartAsync({ product, quantity: 1 })).unwrap();
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`} className="product-link">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-category">{product.category}</p>
          <p className="product-price">{product.price.toLocaleString()} ₽</p>
        </div>
      </Link>
      <button 
        onClick={handleAddToCart}
        className="add-to-cart-btn"
      >
        Добавить в корзину
      </button>
    </div>
  );
};

export default ProductCard;
