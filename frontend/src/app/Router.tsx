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
import GenerateRecipe from "../pages/GenerateRecipe/GenerateRecipe";
import EmailConfirmationRequest from "../pages/EmailConfirmationRequest/EmailConfirmationRequest";
import EmailConfirmation from "../pages/EmailConfirmation/EmailConfirmation";
import SettingsLayout from "../layouts/SettingsLayout/SettingsLayout";
import Profile from "../pages/Profile/Profile";
import Preferences from "../pages/Preferences/Preferences";
import ChangeEmailConfirmation from "../pages/ChangeEmailConfirmation/ChangeEmailConfirmation";

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
          <Route path="cookbooks" element={<Cookbooks />} />
          <Route path="generate-recipe" element={<GenerateRecipe />} />

          <Route path="recipes/:recipeId" element={<Recipe />} />
          <Route path="cookbooks/:cookbookId" element={<Cookbook />} />
          <Route path="discover" element={<Discover />} />
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="profile" />} />

            <Route path="profile" element={<Profile />} />
            <Route path="preferences" element={<Preferences />} />
          </Route>
        </Route>
      </Route>

      <Route path="/auth" element={<AuthLayout />}>
        <Route index element={<Navigate to="login" />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="email-confirmation-request" element={<EmailConfirmationRequest />} />
        <Route path="email-confirmation/:activationCode" element={<EmailConfirmation />} />
        <Route path="change-email-confirmation/:activationCode" element={<ChangeEmailConfirmation />} />
      </Route>

    </Routes>
  );
}