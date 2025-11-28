import React from 'react';
import './Filters.css';

const Filters = ({ filters, onFilterChange }) => {
  const handleCategoryChange = (e) => {
    onFilterChange({ category: e.target.value });
  };

  const handleSearchChange = (e) => {
    onFilterChange({ search: e.target.value });
  };

  const handleSortChange = (e) => {
    onFilterChange({ sortBy: e.target.value });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="category">Категория:</label>
        <select
          id="category"
          value={filters.category}
          onChange={handleCategoryChange}
        >
          <option value="all">Все категории</option>
          <option value="electronics">Электроника</option>
          <option value="clothing">Одежда</option>
          <option value="books">Книги</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="search">Поиск:</label>
        <input
          type="text"
          id="search"
          value={filters.search}
          onChange={handleSearchChange}
          placeholder="Найти товары..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="sortBy">Сортировка:</label>
        <select
          id="sortBy"
          value={filters.sortBy}
          onChange={handleSortChange}
        >
          <option value="name">По названию</option>
          <option value="price_asc">Цена: по возрастанию</option>
          <option value="price_desc">Цена: по убыванию</option>
        </select>
      </div>
    </div>
  );
};

export default Filters;
