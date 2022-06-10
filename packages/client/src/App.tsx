import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getUser } from './auth/googleAuth';
import Header from './components/Header';
import CheckoutPage from './routes/CheckoutPage';
import HomePage from './routes/HomePage';
import MapPage from './routes/MapPage';

import './styles/style.scss';

function App() {
  useEffect(() => {
    if (window.location.pathname !== '/') {
      if (!getUser()) window.location.href = '/';
    }
  }, []);

  return (
    <BrowserRouter>
      <div className={`App theme--default`}>
        <Header></Header>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/checkout/:spot" element={<CheckoutPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
