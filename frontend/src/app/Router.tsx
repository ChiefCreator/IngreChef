import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";

import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import MyRecipes from "../pages/MyRecipes/MyRecipes";
import RecipesList from "../pages/RecipesList/RecipesList";
import Discover from "../pages/Discover/Discover";
import Cookbooks from "../pages/Cookbooks/Cookbooks";
import Cookbook from "../pages/Cookbook/Cookbook";

function ProtectedRoute() {
  return <Outlet />;
}


export default function Router() {
  const navigate = useNavigate();

  return (
    <Routes>

      <Route path="/" element={<HomeLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<MyRecipes />} />

          <Route path="recipies" element={<MyRecipes />} />
          <Route path="shopping-list" element={<MyRecipes />} />
          <Route path="cookbooks" element={<Cookbooks />} />
          <Route path="favorites" element={<MyRecipes />} />

          <Route path="cookbooks/:cookbookId" element={<Cookbook />} />
        </Route>

        <Route path="discover" element={<Discover />} />
        <Route path="recipes-list" element={<RecipesList />} />
      </Route>

    </Routes>
  );
}