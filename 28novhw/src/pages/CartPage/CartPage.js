import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { removeFromCartAsync, updateQuantityAsync, clearCartAsync } from '../../store/actions/cartActions';
import './CartPage.css';

const CartPage = () => {
  const { items, total, loading } = useSelector(state => state.cart);
  const dispatch = useDispatch();

  const handleRemoveFromCart = async (productId) => {
    try {
      await dispatch(removeFromCartAsync(productId)).unwrap();
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      await dispatch(updateQuantityAsync({ id: productId, quantity: newQuantity })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Вы уверены, что хотите очистить корзину?')) {
      try {
        await dispatch(clearCartAsync()).unwrap();
      } catch (error) {
        console.error('Failed to clear cart:', error);
      }
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h2>Корзина пуста</h2>
          <p>У вас нет товаров в корзине</p>
          <Link to="/products" className="continue-shopping-btn">
            Перейти к покупкам
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1>Корзина</h1>
      
      <div className="cart-content">
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-info">
                <h3>{item.name}</h3>
                <p className="item-price">{item.price.toLocaleString()} ₽</p>
              </div>
              
              <div className="item-quantity">
                <label>Количество:</label>
                <div className="quantity-controls">
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1 || loading}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={loading}
                  >
                    +
                  </button>
                </div>
              </div>
              
              <div className="item-total">
                {(item.price * item.quantity).toLocaleString()} ₽
              </div>
              
              <button 
                className="remove-btn"
                onClick={() => handleRemoveFromCart(item.id)}
                disabled={loading}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        
        <div className="cart-summary">
          <div className="summary-content">
            <h3>Итого</h3>
            <div className="summary-item">
              <span>Товары ({items.reduce((sum, item) => sum + item.quantity, 0)} шт.):</span>
              <span>{total.toLocaleString()} ₽</span>
            </div>
            <div className="summary-total">
              <span>Всего:</span>
              <span>{total.toLocaleString()} ₽</span>
            </div>
            
            <div className="summary-actions">
              <button 
                className="checkout-btn"
                disabled={loading}
              >
                Оформить заказ
              </button>
              <button 
                className="clear-cart-btn"
                onClick={handleClearCart}
                disabled={loading}
              >
                Очистить корзину
              </button>
              <Link to="/products" className="continue-shopping-btn">
                Продолжить покупки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
