import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import './Layout.css';

const Layout = ({ children }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(state => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    navigate('/');
  };

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="logo">
            MyStore
          </Link>
          
          <div className="nav-links">
            <Link to="/">Главная</Link>
            <Link to="/products">Товары</Link>
            <Link to="/cart">
              Корзина
              {cartItemsCount > 0 && (
                <span className="cart-badge">{cartItemsCount}</span>
              )}
            </Link>
            
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/profile">
                  {user?.name || 'Профиль'}
                </Link>
                {user?.role === 'admin' && (
                  <Link to="/admin">Админка</Link>
                )}
                <button onClick={handleLogout}>Выйти</button>
              </div>
            ) : (
              <div className="auth-links">
                <Link to="/login">Войти</Link>
                <Link to="/register">Регистрация</Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; 2024 MyStore. Все права защищены.</p>
      </footer>
    </div>
  );
};

export default Layout;
