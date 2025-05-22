import { clientApi } from "../clientApi";

import type { AuthResponse, LoginParams, RegisterParams, ActivateParams } from "./authApiTypes";

export const authApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterParams>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, LoginParams>({
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
    activate: builder.mutation<AuthResponse, ActivateParams>({
      query: ({ activationCode }) => ({
        url: `/auth/activate/${activationCode}`,
        method: "GET"
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useActivateMutation
} = authApi;
