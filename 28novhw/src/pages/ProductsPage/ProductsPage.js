import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '../../store/actions/productsActions';
import { setFilters } from '../../store/slices/productsSlice';
import ProductCard from '../../components/ProductCard/ProductCard';
import Filters from '../../components/Filters/Filters';
import './ProductsPage.css';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const { items, loading, error, filters } = useSelector(
    state => state.products
  );

  useEffect(() => {
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      urlFilters[key] = value;
    }
    
    dispatch(fetchProducts(urlFilters));
  }, [dispatch, searchParams]);

  const handleFilterChange = (newFilters) => {
    const mergedFilters = { ...filters, ...newFilters };
    dispatch(setFilters(mergedFilters));
    
    const params = new URLSearchParams();
    Object.entries(mergedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      }
    });
    setSearchParams(params);
  };

  if (loading) {
    return <div className="loading">Загрузка товаров...</div>;
  }

  if (error) {
    return <div className="error">Ошибка: {error}</div>;
  }

  return (
    <div className="products-page">
      <h1>Каталог товаров</h1>
      
      <Filters 
        filters={filters}
        onFilterChange={handleFilterChange}
      />
      
      <div className="products-grid">
        {items.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="no-products">
          Товары не найдены
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
