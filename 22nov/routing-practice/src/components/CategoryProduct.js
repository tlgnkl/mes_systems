import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { categories } from '../data';
import './CategoryProduct.css';

const CategoryProduct = () => {
  // Получите categoryName и productId из URL
  const { categoryName, productId } = useParams();
  
  // Если категория не найдена в словаре, используем как есть
  const categoryRussian = categories[categoryName] || categoryName;


  return (
    <div className="category-product">
      <h2>Продукт в категории</h2>
      {/* 
        - Название категории (преобразуйте electronics -> Электроника)
        - ID продукта
        - Полный путь
      */}

      <div className="category-info">
        <div className="info-card">
          <h3>Информация о продукте</h3>
          <p><strong>Название категории: </strong>{categoryRussian}</p>
          <p><strong>ID продукта: </strong>{productId}</p>
          <p><strong>Полный путь: </strong>/category/{categoryName}/product/{productId}</p>
          
          {/* Extra links as per Task 4.2 - "In product page - link to category" but this IS a category product page. */}
          <div className="category-actions">
             <Link to="/" className="action-link">На главную</Link>
             <Link to={`/product/${productId}`} className="action-link">Перейти к товару</Link>
          </div>

        </div>
      </div>

    </div>
  );
};

export default CategoryProduct;
