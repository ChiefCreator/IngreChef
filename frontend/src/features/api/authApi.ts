import { clientApi } from "./clientApi";

import type { AuthResponse, LoginRequest, RegisterRequest } from "./types";

export const authApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
    activate: builder.mutation<AuthResponse, { activationCode: String }>({
      query: ({ activationCode }) => ({
        url: `/auth/activate/${activationCode}`,
        method: "GET"
      }),
    }),
    refresh: builder.query({
      query: () => "/auth/refresh",
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useActivateMutation
} = authApi;
