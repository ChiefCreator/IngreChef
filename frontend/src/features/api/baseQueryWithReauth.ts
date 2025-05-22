import { fetchBaseQuery, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';
import { setUser, clearUser, setAccessToken, clearAccessToken, setAuth } from '../auth/authSlice';

import type { FetchArgs } from '@reduxjs/toolkit/query/react';
import type { ApiError } from '../../types/queryTypes';

const baseUrl = import.meta.env.VITE_BASE_URL;

let isRefreshing = false;
let subscribers: ((token: string) => void)[] = [];

const addSubscriber = (callback: (token: string) => void) => {
  subscribers.push(callback);
};
const notifySubscribers = (token: string) => {
  subscribers.forEach(callback => callback(token));
  subscribers = [];
};

const baseQuery = fetchBaseQuery({
  baseUrl,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async ( args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status !== 401) return result as typeof result & { error: ApiError };

  if (!isRefreshing) {
    isRefreshing = true;

    try {
      const refreshResult = await baseQuery({ url: "/auth/refresh", method: "GET" }, api, extraOptions);
      if (refreshResult.data) {
        const newToken = (refreshResult.data as any).accessToken;
        const user = (refreshResult.data as any).user;
  
        api.dispatch(setUser(user));
        api.dispatch(setAccessToken(newToken));
        api.dispatch(setAuth(true));

        notifySubscribers(newToken);

        const newArgs = typeof args === "string" ? args : {
          ...args,
          headers: {
            ...(args as any).headers,
            Authorization: `Bearer ${newToken}`,
          }
        };

        result = await baseQuery(newArgs, api, extraOptions);
      } else {
         api.dispatch(clearUser());
         api.dispatch(clearAccessToken());
         api.dispatch(setAuth(false));
      }
    } finally {
      isRefreshing = false;
    }
  } else {
    result = await new Promise(resolve => {
      addSubscriber((token: string) => {
        const newArgs = typeof args === 'string' ? args : {
          ...args,
          headers: {
            ...(args as any).headers,
            Authorization: `Bearer ${token}`,
          }
        };

        Promise.resolve(baseQuery(newArgs, api, extraOptions)).then(resolve);
      });
    });
  }

  return result as typeof result & { error: ApiError };
};
