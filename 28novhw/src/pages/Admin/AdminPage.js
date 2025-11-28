import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../store/actions/productsActions';
import './AdminPage.css';

const AdminPage = () => {
  const dispatch = useDispatch();
  const { items: products, loading } = useSelector(state => state.products);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'electronics',
    description: '',
    image: ''
  });

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const newProduct = {
        ...formData,
        price: parseFloat(formData.price),
        image: formData.image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(formData.name)}`
      };
      await dispatch(addProduct(newProduct)).unwrap();
      setShowAddForm(false);
      setFormData({
        name: '',
        price: '',
        category: 'electronics',
        description: '',
        image: ''
      });
      dispatch(fetchProducts());
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: product.description,
      image: product.image
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const updatedProduct = {
        ...formData,
        id: editingProduct.id,
        price: parseFloat(formData.price)
      };
      await dispatch(updateProduct(updatedProduct)).unwrap();
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        category: 'electronics',
        description: '',
        image: ''
      });
      dispatch(fetchProducts());
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
      try {
        await dispatch(deleteProduct(productId)).unwrap();
        dispatch(fetchProducts());
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      price: '',
      category: 'electronics',
      description: '',
      image: ''
    });
  };

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Панель администратора</h1>
        <p>Управление товарами и заказами</p>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => handleTabChange('products')}
        >
          Товары
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          Заказы
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => handleTabChange('users')}
        >
          Пользователи
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && (
          <div className="products-management">
            <div className="section-header">
              <h2>Управление товарами</h2>
              <button 
                className="add-btn"
                onClick={() => setShowAddForm(true)}
              >
                Добавить товар
              </button>
            </div>

            {(showAddForm || editingProduct) && (
              <div className="product-form">
                <h3>{editingProduct ? 'Редактировать товар' : 'Добавить новый товар'}</h3>
                <form onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Название:</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Цена:</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Категория:</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                      >
                        <option value="electronics">Электроника</option>
                        <option value="clothing">Одежда</option>
                        <option value="books">Книги</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>URL изображения:</label>
                      <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Описание:</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="3"
                      required
                    />
                  </div>
                  <div className="form-actions">
                    <button type="submit" disabled={loading}>
                      {editingProduct ? 'Сохранить' : 'Добавить'}
                    </button>
                    <button type="button" onClick={editingProduct ? handleCancelEdit : () => setShowAddForm(false)}>
                      Отмена
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="products-list">
              {products.map(product => (
                <div key={product.id} className="admin-product-card">
                  <img src={product.image} alt={product.name} />
                  <div className="product-info">
                    <h4>{product.name}</h4>
                    <p className="price">{product.price.toLocaleString()} ₽</p>
                    <p className="category">{product.category}</p>
                  </div>
                  <div className="product-actions">
                    <button 
                      className="edit-btn"
                      onClick={() => handleEditProduct(product)}
                    >
                      Редактировать
                    </button>
                    <button 
                      className="delete-btn"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-management">
            <h2>Управление заказами</h2>
            <div className="empty-section">
              <p>Заказов пока нет</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-management">
            <h2>Управление пользователями</h2>
            <div className="empty-section">
              <p>Функция управления пользователями в разработке</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
