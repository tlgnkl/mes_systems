import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { usersData } from '../data';
import './UserProfile.css';

const UserProfile = () => {
  // Получаем userId из URL параметров с помощью хука useParams
  const { userId } = useParams();
  
  // Находим данные пользователя по ID
  const user = usersData[userId];
  
  return (
    <div className="user-profile">
      <h2>Профиль пользователя</h2>
      
      {/* Проверяем существует ли пользователь */}
      {user ? (
        <div className="user-info">
          <div className="user-card">
            <h3>{user.name}</h3>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Город:</strong> {user.city}</p>
          </div>
          
          {/* Динамические ссылки */}
          <div className="user-actions">
            {/* Note: /products route does not exist in the tutorial instructions, but adding link as requested */}
            <Link to="/" className="action-link">
              На главную
            </Link>
          </div>
        </div>
      ) : (
        <div className="user-not-found">
          <p>Пользователь с ID "{userId}" не найден</p>
          <p>Доступные пользователи: 1, 2, 3</p>
          <Link to="/" className="back-link">Вернуться на главную</Link>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
