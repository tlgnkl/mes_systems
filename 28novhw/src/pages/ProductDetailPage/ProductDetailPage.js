import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCartAsync } from '../../store/actions/cartActions';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Mock product data - in real app this would come from API
  const mockProducts = [
    {
      id: 1,
      name: 'Смартфон iPhone 15',
      price: 99999,
      category: 'electronics',
      description: 'Последний модель iPhone с продвинутой камерой, мощным процессором A17 Pro и элегантным дизайном. Поддержка 5G, улучшенная система камер и время работы до 20 часов.',
      image: 'https://via.placeholder.com/400x400?text=iPhone+15'
    },
    {
      id: 2,
      name: 'Ноутбук MacBook Pro',
      price: 149999,
      category: 'electronics',
      description: 'Мощный ноутбук для профессионалов с процессором M3, 16GB RAM и 512GB SSD. Идеальный выбор для разработчиков и дизайнеров.',
      image: 'https://via.placeholder.com/400x400?text=MacBook+Pro'
    },
    {
      id: 3,
      name: 'Футболка',
      price: 1999,
      category: 'clothing',
      description: 'Хлопковая футболка классического кроя. 100% органический хлопок, удобная посадка и долговечные цвета.',
      image: 'https://via.placeholder.com/400x400?text=T-Shirt'
    },
    {
      id: 4,
      name: 'Джинсы',
      price: 3999,
      category: 'clothing',
      description: 'Классические джинсы синего цвета из прочного денима. Универсальный стиль для любого случая.',
      image: 'https://via.placeholder.com/400x400?text=Jeans'
    },
    {
      id: 5,
      name: 'Кроссовки Nike',
      price: 7999,
      category: 'clothing',
      description: 'Спортивные кроссовки для бега с амортизирующей подошвой и дышащим верхом. Идеальны для тренировок и повседневной носки.',
      image: 'https://via.placeholder.com/400x400?text=Nike+Shoes'
    },
    {
      id: 6,
      name: 'Наушники AirPods',
      price: 12999,
      category: 'electronics',
      description: 'Беспроводные наушники с шумоподавлением, пространственным аудио и до 6 часов работы. Совместимы со всеми устройствами Apple.',
      image: 'https://via.placeholder.com/400x400?text=AirPods'
    },
    {
      id: 7,
      name: 'Книга React.js',
      price: 999,
      category: 'books',
      description: 'Полное руководство по React.js для начинающих и опытных разработчиков. Практические примеры и лучшие практики.',
      image: 'https://via.placeholder.com/400x400?text=React+Book'
    },
    {
      id: 8,
      name: 'Книга JavaScript',
      price: 1299,
      category: 'books',
      description: 'Современный JavaScript для начинающих. ES6+, асинхронное программирование и работа с DOM.',
      image: 'https://via.placeholder.com/400x400?text=JavaScript+Book'
    },
    {
      id: 9,
      name: 'Часы Smart Watch',
      price: 8999,
      category: 'electronics',
      description: 'Умные часы с фитнес-трекером, мониторингом сердечного ритма и уведомлениями. Водонепроницаемые до 50м.',
      image: 'https://via.placeholder.com/400x400?text=Smart+Watch'
    }
  ];

  const product = mockProducts.find(p => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="product-detail-page">
        <div className="product-not-found">
          <h2>Товар не найден</h2>
          <p>Запрошенный товар не существует или был удален.</p>
          <button onClick={() => navigate('/products')} className="back-btn">
            Вернуться к каталогу
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setLoading(true);
    try {
      await dispatch(addToCartAsync({ product, quantity })).unwrap();
      alert('Товар добавлен в корзину!');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      alert('Ошибка при добавлении в корзину');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= 99) {
      setQuantity(value);
    }
  };

  return (
    <div className="product-detail-page">
      <button onClick={() => navigate('/products')} className="back-btn">
        ← Вернуться к каталогу
      </button>
      
      <div className="product-detail">
        <div className="product-image">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info">
          <h1>{product.name}</h1>
          <p className="product-category">{product.category}</p>
          <p className="product-price">{product.price.toLocaleString()} ₽</p>
          
          <div className="product-description">
            <h3>Описание</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="purchase-section">
            <div className="quantity-selector">
              <label htmlFor="quantity">Количество:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max="99"
              />
            </div>
            
            <button 
              onClick={handleAddToCart}
              disabled={loading}
              className="add-to-cart-btn"
            >
              {loading ? 'Добавление...' : `Добавить в корзину (${(product.price * quantity).toLocaleString()} ₽)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
