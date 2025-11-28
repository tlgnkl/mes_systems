import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { updateUser } from '../../store/slices/authSlice';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      // Reset form data when canceling
      setFormData({
        name: user?.name || '',
        email: user?.email || ''
      });
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    dispatch(updateUser(formData));
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="profile-error">
          <h2>Профиль не найден</h2>
          <p>Пожалуйста, войдите в систему</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Профиль пользователя</h1>
        
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <div className="avatar-placeholder">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-info">
              <h2>{user.name}</h2>
              <p className="user-role">Роль: {user.role === 'admin' ? 'Администратор' : 'Пользователь'}</p>
            </div>
          </div>

          <div className="profile-details">
            <h3>Личная информация</h3>
            
            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="name">Имя:</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="form-actions">
                  <button onClick={handleSave} className="save-btn">
                    Сохранить
                  </button>
                  <button onClick={handleEditToggle} className="cancel-btn">
                    Отмена
                  </button>
                </div>
              </div>
            ) : (
              <div className="info-display">
                <div className="info-item">
                  <span className="info-label">Имя:</span>
                  <span className="info-value">{user.name}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{user.email}</span>
                </div>
                
                <div className="info-item">
                  <span className="info-label">ID пользователя:</span>
                  <span className="info-value">{user.id}</span>
                </div>
                
                <button onClick={handleEditToggle} className="edit-btn">
                  Редактировать профиль
                </button>
              </div>
            )}
          </div>

          <div className="profile-stats">
            <h3>Статистика</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Заказов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">0</span>
                <span className="stat-label">Отзывов</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2024</span>
                <span className="stat-label">Год регистрации</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
