import React, { useState } from "react";
import { useGetRecipesQuery } from "../../features/api/apiSlice";

export default function RecipesList() {
  const [search, setSearch] = useState("");
  const [diet, setDiet] = useState("");
  const [type, setType] = useState("");
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching, refetch } = useGetRecipesQuery({
    page: 1,
    limit: 10,
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setOffset(0); // reset offset when changing search
  };

  const loadMore = () => {
    setOffset((prev) => prev + 20);
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex flex-col sm:flex-row gap-2">
        <input
          className="border rounded p-2 w-full sm:w-1/3"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search recipes..."
        />
        <select
          className="border rounded p-2"
          value={diet}
          onChange={(e) => setDiet(e.target.value)}
        >
          <option value="">All Diets</option>
          <option value="vegan">Vegan</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="gluten free">Gluten Free</option>
        </select>
        <select
          className="border rounded p-2"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="main course">Main Course</option>
          <option value="dessert">Dessert</option>
          <option value="snack">Snack</option>
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading && <p>Loading recipes...</p>}
        {data?.map((recipe) => (
          <div key={recipe.id} className="border rounded p-2 shadow">
            {recipe.imageUrl && (
              <img
                src={recipe.imageUrl}
                alt={recipe.title}
                className="w-full h-40 object-cover rounded"
              />
            )}
            <h3 className="mt-2 font-semibold text-sm">{recipe.title}</h3>
          </div>
        ))}
      </div>

      {/* Load More */}
      {data && data.length > 0 && (
        <div className="flex justify-center mt-4">
          <button
            onClick={loadMore}
            className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {isFetching ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};
