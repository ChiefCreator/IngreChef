import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "./hooks";
import { selectIsAuth } from "../features/auth/authSlice";

import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import MyRecipes from "../pages/MyRecipes/MyRecipes";
import Discover from "../pages/Discover/Discover";
import Cookbooks from "../pages/Cookbooks/Cookbooks";
import Recipe from "../pages/Recipe/Recipe";
import Cookbook from "../pages/Cookbook/Cookbook";
import ConfirmEmail from "../pages/ConfirmEmail/ConfirmEmail";
import SuccessEmailConfirm from "../pages/SuccessEmailConfirm/SuccessEmailConfirm";

function ProtectedRoute() {
  const isAuth = useAppSelector(selectIsAuth);

  if (!isAuth) {
    return <Navigate to="/auth/register" replace />;
  }

  return <Outlet />;
}


export default function Router() {
  return (
    <Routes>

      <Route path="/" element={<HomeLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<MyRecipes />} />

          <Route path="recipies" element={<MyRecipes />} />
          <Route path="shopping-list" element={<MyRecipes />} />
          <Route path="cookbooks" element={<Cookbooks />} />
          <Route path="favorites" element={<MyRecipes />} />

          <Route path="recipes/:recipeId" element={<Recipe />} />
          <Route path="cookbooks/:cookbookId" element={<Cookbook />} />
          <Route path="discover" element={<Discover />} />
        </Route>
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="confirm-email" element={<ConfirmEmail />} />
        <Route path="activate/:activationCode" element={<SuccessEmailConfirm />} />
      </Route>

    </Routes>
  );
}