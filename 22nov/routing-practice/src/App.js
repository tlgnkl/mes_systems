import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Breadcrumbs from './components/Breadcrumbs';
import Home from './components/Home';
import UserProfile from './components/UserProfile';
import ProductPage from './components/ProductPage';
import CategoryProduct from './components/CategoryProduct';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navigation />
        <Breadcrumbs />
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Home />}/>
          {/* Профиль пользователя с динамическим параметром :userId */}
          <Route path="/user/:userId" element={<UserProfile />} />
            
          {/* Страница продукта с динамическим параметром :productId */}
          <Route path="/product/:productId" element={<ProductPage />} />
            
          {/* Вложенные параметры: категория и продукт */}
          <Route path="/category/:categoryName/product/:productId" 
              element={<CategoryProduct />} />
          <Route path="*" element={
            <div className="not-found">
              <h2>Страница не найдена</h2>
              <p>Перейдите, пожалуйста, на <a href="/">Главную страницу</a></p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
