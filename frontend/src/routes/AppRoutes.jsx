import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserRegisterPage from '../pages/auth/UserRegisterPage';
import UserLoginPage from '../pages/auth/UserLoginPage';
import FoodPartnerRegisterPage from '../pages/auth/FoodPartnerRegisterPage';
import FoodPartnerLoginPage from '../pages/auth/FoodPartnerLoginPage';
import Home from '../pages/general/Home';
import CreateFood from '../pages/FoodPartnerRegister.jsx/CreateFood.jsx';
import Profile from '../pages/FoodPartnerRegister.jsx/Profile.jsx';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/user/register" element={<UserRegisterPage />} />
        <Route path="/user/login" element={<UserLoginPage />} />
        <Route path="/food-partner/register" element={<FoodPartnerRegisterPage />} />
        <Route path="/food-partner/login" element={<FoodPartnerLoginPage />} />
        <Route path="/create-food" element={<CreateFood />} />
        <Route path="/food-partner/profile/:id" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
