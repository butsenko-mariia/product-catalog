import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage.tsx';
import DeletingProductPage from './pages/DeletingProductPage.tsx';
import EditingProductPage from './pages/EditingProductPage.tsx';
import ProductsPage from './pages/ProductsPage.tsx';
import HomePage from './pages/HomePage.tsx';
import ProductDetailsPage from './pages/ProductDetailPage.tsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/products/:id/edit" element={<EditingProductPage />} />
          <Route
            path="/products/:id/delete"
            element={<DeletingProductPage />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
