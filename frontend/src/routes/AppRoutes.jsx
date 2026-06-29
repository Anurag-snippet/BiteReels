import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import UserRegisterPage from '../pages/UserRegisterPage';
import UserLoginPage from '../pages/UserLoginPage';
import FoodPartnerRegisterPage from '../pages/FoodPartnerRegisterPage';
import FoodPartnerLoginPage from '../pages/FoodPartnerLoginPage';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/register" element={<UserRegisterPage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegisterPage />} />
        <Route path="/food-partner/login" element={<FoodPartnerLoginPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;