import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsData } from '../data';
import './ProductPage.css';

const ProductPage = () => {
  // Получите productId из URL параметров
  const { productId } = useParams();
  const product = productsData[productId];
  
  return (
    <div className="product-page">
      <h2>Страница продукта</h2>
      {product ? (
        <div className="product-details">
          <div className="product-header">
            <h3>{product.name}</h3>
          </div>
          
          <div className="product-info">
            <p className="product-price">{product.price.toLocaleString()} руб.</p>
            <p className="product-description">{product.description}</p>

          </div>
          
          {/* Динамические ссылки */}
          <div className="product-actions">
            <Link to={`/category/${product.category}/product/${productId}`} 
                  className="action-link">
              Посмотреть в категории {product.category}
            </Link>
            <Link to="/" className="action-link">
              На главную
            </Link>
            <button className="buy-button">Добавить в корзину</button>
          </div>
        </div>
      ) : (
        <div className="product-not-found">
          <p>Продукт с ID "{productId}" не найден</p>
          <p>Доступные продукты: laptop, phone, 123</p>
          <Link to="/" className="back-link">Вернуться на главную</Link>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
