import { configureStore } from "@reduxjs/toolkit";

import { clientApi } from "../features/api/clientApi";
import authReducer from "../features/auth/authSlice";
import ingredientsReducer from "../features/ingredients/ingredientsSlice";
import listenerMiddleware from "../features/middleware/listenerMiddleware";

export const store = configureStore({
  reducer: {
    [clientApi.reducerPath]: clientApi.reducer,
    auth: authReducer,
    ingredients: ingredientsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware).concat(clientApi.middleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
