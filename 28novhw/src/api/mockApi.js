// Mock API service for testing without backend
const mockUsers = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user'
  }
];

const mockProducts = [
  {
    id: 1,
    name: 'Смартфон iPhone 15',
    price: 99999,
    category: 'electronics',
    description: 'Последний модель iPhone с продвинутой камерой',
    image: 'https://via.placeholder.com/300x300?text=iPhone+15'
  },
  {
    id: 2,
    name: 'Ноутбук MacBook Pro',
    price: 149999,
    category: 'electronics',
    description: 'Мощный ноутбук для профессионалов',
    image: 'https://via.placeholder.com/300x300?text=MacBook+Pro'
  },
  {
    id: 3,
    name: 'Футболка',
    price: 1999,
    category: 'clothing',
    description: 'Хлопковая футболка классического кроя',
    image: 'https://via.placeholder.com/300x300?text=T-Shirt'
  },
  {
    id: 4,
    name: 'Джинсы',
    price: 3999,
    category: 'clothing',
    description: 'Классические джинсы синего цвета',
    image: 'https://via.placeholder.com/300x300?text=Jeans'
  },
  {
    id: 5,
    name: 'Кроссовки Nike',
    price: 7999,
    category: 'clothing',
    description: 'Спортивные кроссовки для бега',
    image: 'https://via.placeholder.com/300x300?text=Nike+Shoes'
  },
  {
    id: 6,
    name: 'Наушники AirPods',
    price: 12999,
    category: 'electronics',
    description: 'Беспроводные наушники с шумоподавлением',
    image: 'https://via.placeholder.com/300x300?text=AirPods'
  },
  {
    id: 7,
    name: 'Книга React.js',
    price: 999,
    category: 'books',
    description: 'Полное руководство по React.js',
    image: 'https://via.placeholder.com/300x300?text=React+Book'
  },
  {
    id: 8,
    name: 'Книга JavaScript',
    price: 1299,
    category: 'books',
    description: 'Современный JavaScript для начинающих',
    image: 'https://via.placeholder.com/300x300?text=JavaScript+Book'
  },
  {
    id: 9,
    name: 'Часы Smart Watch',
    price: 8999,
    category: 'electronics',
    description: 'Умные часы с фитнес-трекером',
    image: 'https://via.placeholder.com/300x300?text=Smart+Watch'
  }
];

export const mockLogin = async (credentials) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { email, password } = credentials;
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Неверный email или пароль');
  }
  
  // Return user data without password
  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const mockFetchProducts = async (filters = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filteredProducts = [...mockProducts];
  
  // Apply filters
  if (filters.category && filters.category !== 'all') {
    filteredProducts = filteredProducts.filter(p => p.category === filters.category);
  }
  
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(searchLower) ||
      p.description.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply sorting
  if (filters.sortBy) {
    filteredProducts.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        default:
          return 0;
      }
    });
  }
  
  return {
    items: filteredProducts,
    totalCount: filteredProducts.length
  };
};

export const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { email, password, name } = userData;
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    throw new Error('Пользователь с таким email уже существует');
  }
  
  // Create new user
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    password,
    role: 'user'
  };
  
  mockUsers.push(newUser);
  
  // Return user data without password
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};
