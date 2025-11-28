import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './HomePage.css';

const HomePage = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);

  const featuredProducts = [
    {
      id: 1,
      name: 'Смартфон iPhone 15',
      price: 99999,
      image: 'https://via.placeholder.com/300x200?text=iPhone+15'
    },
    {
      id: 2,
      name: 'Ноутбук MacBook Pro',
      price: 149999,
      image: 'https://via.placeholder.com/300x200?text=MacBook+Pro'
    },
    {
      id: 6,
      name: 'Наушники AirPods',
      price: 12999,
      image: 'https://via.placeholder.com/300x200?text=AirPods'
    }
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Добро пожаловать в MyStore</h1>
          <p>Лучшие товары по отличным ценам</p>
          <Link to="/products" className="cta-button">
            Перейти к каталогу
          </Link>
        </div>
      </section>

      <section className="features">
        <div className="feature">
          <h3>🚚 Быстрая доставка</h3>
          <p>Доставка по всей стране за 1-3 дня</p>
        </div>
        <div className="feature">
          <h3>💰 Гарантия лучшей цены</h3>
          <p>Мы гарантируем лучшие цены на рынке</p>
        </div>
        <div className="feature">
          <h3>🛡️ Безопасная покупка</h3>
          <p>100% безопасность ваших платежей</p>
        </div>
      </section>

      <section className="featured-products">
        <h2>Популярные товары</h2>
        <div className="featured-grid">
          {featuredProducts.map(product => (
            <div key={product.id} className="featured-card">
              <img src={product.image} alt={product.name} />
              <h3>{product.name}</h3>
              <p className="price">{product.price.toLocaleString()} ₽</p>
              <Link to={`/products/${product.id}`} className="view-btn">
                Посмотреть
              </Link>
            </div>
          ))}
        </div>
      </section>

      {isAuthenticated && (
        <section className="user-welcome">
          <h2>Добро пожаловать, {user?.name}!</h2>
          <p>Рады видеть вас снова. У вас {items.reduce((total, item) => total + item.quantity, 0)} товаров в корзине.</p>
        </section>
      )}
    </div>
  );
};

export default HomePage;
