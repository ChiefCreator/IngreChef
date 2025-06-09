import { clientApi } from "../clientApi";

import type { User, Profile, GetUserParams, UpdateProfileParams } from "./userApiTypes";

export const userApi = clientApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, GetUserParams>({
      query: ({ userId, include }) => {
        const params = new URLSearchParams();
        params.append("include", JSON.stringify(include))

        return {
          url: `/users/${userId}`,
          method: 'GET',
          params,
        };
      },
      providesTags: (_, __, { userId }) => [{ type: "Profile", id: userId }]
    }),

    updateProfile: builder.mutation<Profile, UpdateProfileParams>({
      query: ({ userId, data }) => {
        return {
          url: `/users/${userId}/profile`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: (_, __, { userId }) => [{ type: "Profile", id: userId }]
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetUserQuery,
  useUpdateProfileMutation
} = userApi;
