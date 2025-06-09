import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit';
import type { Ingredient } from '../api/ingredientsApi/ingredientsTypes';
import { RootState } from '../../app/store';

interface IngredientsState {
  items: Ingredient[];
}

const initialState: IngredientsState = {
  items: [],
};

const ingredientsSlice = createSlice({
  name: "ingredients",
  initialState,
  reducers: {
    setIngredients(state, action: PayloadAction<Ingredient[]>) {
      state.items = action.payload;
    },
    updateIngredient(state, action: PayloadAction<Ingredient>) {
      const index = state.items.findIndex(i => i.id === action.payload.id);
      if (index !== -1) state.items[index] = action.payload;
    },
    addIngredient(state, action: PayloadAction<Ingredient>) {
      state.items.push(action.payload);
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.items = state.items.filter(i => i.id !== action.payload);
    },
  },
});

export const {
  setIngredients,
  updateIngredient,
  addIngredient,
  removeIngredient,
} = ingredientsSlice.actions;

export default ingredientsSlice.reducer;

export const selectIngredients = (state: RootState) => state.ingredients.items;

export const selectOptionsIngredients = createSelector(
  [selectIngredients],
  (ingredients) => ingredients.map(ingredient => ({
    value: ingredient.id,
    label: ingredient.title
  }))
);
