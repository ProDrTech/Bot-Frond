import React, { createContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Order from './pages/Order';
import Promotion from './pages/Promotion';
import ProductDetails from './pages/ProductDetails';
import ErrorPage from './pages/ErrorPage';
import MainLayout from './layout/MainLayout';

export const HeaderSearch = createContext(null);
export const ThemeContext = createContext(null);
export const UserID = createContext(null)

function App() {
  const [headerSearch, setHeaderSearch] = useState('');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [userId, setUserId] = useState('')

  useEffect(() => {
    const body = document.body;
    if (theme === 'light') {
      body.classList.remove('dark');
      body.classList.add('light');
    } else {
      body.classList.remove('light');
      body.classList.add('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <HeaderSearch.Provider value={{ headerSearch, setHeaderSearch }}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <UserID.Provider value={{ userId, setUserId }}>
          <Routes>
            <Route index element={<MainLayout><Home /></MainLayout>} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/promotion/:id" element={<Promotion />} />
            <Route path="/product/:id" element={<MainLayout><Product /></MainLayout>} />
            <Route path="/product/details/:id" element={<ProductDetails />} />
            <Route path="/order" element={<Order />} />
            <Route path="*" element={<MainLayout><ErrorPage /></MainLayout>} />
          </Routes>
        </UserID.Provider>
      </ThemeContext.Provider>
    </HeaderSearch.Provider>
  );
}

export default App;