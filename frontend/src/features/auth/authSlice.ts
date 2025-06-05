import { createSlice } from "@reduxjs/toolkit";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { InitialState, User } from "./authSliceTypes";
import { RootState } from "../../app/store";

const accessTokenFromStorage = localStorage.getItem("accessToken");
const userFromStorage = localStorage.getItem("user");

const initialState: InitialState = {
  user: userFromStorage ? JSON.parse(userFromStorage) : null,
  isAuth: !!accessTokenFromStorage,
  accessToken: accessTokenFromStorage ?? null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
    setUserIsActivated(state, action: PayloadAction<boolean>) {
      if (!state.user) return;

      state.user.isActivated = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    setAuth(state, action) {
      state.isAuth = action.payload;
    },
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    clearAccessToken(state) {
      state.accessToken = null;
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setUser, setUserIsActivated, clearUser, setAccessToken, clearAccessToken, setAuth } = authSlice.actions;

export const selectIsAuth = (state: RootState) => state.auth.isAuth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectUserId = (state: RootState) => state.auth.user?.id!;
export const selectUserEmail = (state: RootState) => state.auth.user?.email!;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;

export default authSlice.reducer;