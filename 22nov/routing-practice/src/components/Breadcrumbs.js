import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { usersData, productsData, categories } from '../data';
import './Breadcrumbs.css';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  let breadcrumbs = [];
  let currentPath = '';

  // Always add Home
  breadcrumbs.push({ name: 'Главная', path: '/' });

  // Special handling for known patterns
  if (pathnames[0] === 'user' && pathnames[1]) {
      const userId = pathnames[1];
      breadcrumbs.push({ name: 'Пользователь', path: '/user/' + userId }); // or just 'Пользователь' non-clickable?
      const user = usersData[userId];
      if (user) {
          breadcrumbs.push({ name: user.name, path: location.pathname });
      } else {
          breadcrumbs.push({ name: 'Не найден', path: location.pathname });
      }
  } else if (pathnames[0] === 'product' && pathnames[1]) {
      const productId = pathnames[1];
      // Usually "Products" -> Product Name
      // But here just "Product" maybe?
      // The example says: "Главная > Электроника > Ноутбук Gaming Pro" (for category view)
      // For direct product view: maybe "Главная > Продукт > Ноутбук Gaming Pro"?
      breadcrumbs.push({ name: 'Продукт', path: '#' });
      const product = productsData[productId];
      if (product) {
          breadcrumbs.push({ name: product.name, path: location.pathname });
      } else {
          breadcrumbs.push({ name: productId, path: location.pathname });
      }
  } else if (pathnames[0] === 'category' && pathnames[2] === 'product') {
      // /category/:cat/product/:id
      const catSlug = pathnames[1];
      const productId = pathnames[3];
      
      const catName = categories[catSlug] || catSlug;
      breadcrumbs.push({ name: catName, path: '#' }); // Could be link to category page if it existed

      const product = productsData[productId];
      if (product) {
          breadcrumbs.push({ name: product.name, path: location.pathname });
      } else {
          breadcrumbs.push({ name: productId, path: location.pathname });
      }
  }

  // Render
  // If logic didn't match, we might just show segments (fallback)
  if (breadcrumbs.length === 1 && pathnames.length > 0) {
      // fallback
      pathnames.forEach((value, index) => {
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          breadcrumbs.push({ name: value, path: to });
      });
  }

  return (
    <div className="breadcrumbs">
      {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          return (
              <span key={index} className="breadcrumb-item">
                  {index > 0 && <span className="separator"> &gt; </span>}
                  {isLast ? (
                      <span className="current">{crumb.name}</span>
                  ) : (
                      <Link to={crumb.path}>{crumb.name}</Link>
                  )}
              </span>
          );
      })}
    </div>
  );
};

export default Breadcrumbs;
