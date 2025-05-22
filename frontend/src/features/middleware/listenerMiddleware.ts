import { createListenerMiddleware } from '@reduxjs/toolkit';
import { setUser, clearUser, setAccessToken, clearAccessToken, setAuth, setUserIsActivated } from '../auth/authSlice';
import { clientApi } from '../api/clientApi';

import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../auth/authSliceTypes';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: clientApi.endpoints.register.matchFulfilled,
  effect: async (action, listenerApi) => {
    const { user, accessToken } = action.payload;

    listenerApi.dispatch(setUser(user));
    listenerApi.dispatch(setAccessToken(accessToken));
    listenerApi.dispatch(setAuth(true));
  },
});
listenerMiddleware.startListening({
  matcher: clientApi.endpoints.login.matchFulfilled,
  effect: async (action, listenerApi) => {
    const { user, accessToken } = action.payload;

    listenerApi.dispatch(setUser(user));
    listenerApi.dispatch(setAccessToken(accessToken));
    listenerApi.dispatch(setAuth(true));
  },
});
listenerMiddleware.startListening({
  matcher: clientApi.endpoints.logout.matchFulfilled,
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(clearUser());
    listenerApi.dispatch(clearAccessToken());
    listenerApi.dispatch(setAuth(false));
  },
});

listenerMiddleware.startListening({
  actionCreator: setUser,
  effect: (action: PayloadAction<User>) => {
    localStorage.setItem("user", JSON.stringify(action.payload));
  },
});
listenerMiddleware.startListening({
  actionCreator: setUserIsActivated,
  effect: (action: PayloadAction<boolean>) => {
    const userJson = localStorage.getItem("user");
    if (!userJson) return;

    const user = JSON.parse(userJson);
    user.isActivated = action.payload;
    localStorage.setItem("user", JSON.stringify(user));
  },
});
listenerMiddleware.startListening({
  actionCreator: clearUser,
  effect: () => {
    localStorage.removeItem("user");
  },
});

listenerMiddleware.startListening({
  actionCreator: setAccessToken,
  effect: (action: PayloadAction<string>) => {
    localStorage.setItem("accessToken", action.payload);
  },
});
listenerMiddleware.startListening({
  actionCreator: clearAccessToken,
  effect: () => {
    localStorage.removeItem("accessToken");
  },
});

export default listenerMiddleware;
