import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom";

import HomeLayout from "../layouts/HomeLayout/HomeLayout";
import Recipies from "../pages/Recipies/Recipies";
import RecipesList from "../pages/RecipesList/RecipesList";
import Discover from "../pages/Discover/Discover";

function ProtectedRoute() {
  return <Outlet />;
}


export default function Router() {
  const navigate = useNavigate();

  return (
    <Routes>

      <Route path="/" element={<HomeLayout />}>
        <Route element={<ProtectedRoute />}>
          <Route index element={<Recipies />} />

          <Route path="recipies" element={<Recipies />} />
          <Route path="shopping-list" element={<Recipies />} />
          <Route path="cookbooks" element={<Recipies />} />
          <Route path="favorites" element={<Recipies />} />
        </Route>

        <Route path="discover" element={<Discover />} />
        <Route path="recipes-list" element={<RecipesList />} />
      </Route>

    </Routes>
  );
}