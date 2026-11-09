import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { api as services } from "@/lib/api";

async function runService(serviceCall) {
  try {
    return { data: await serviceCall() };
  } catch (error) {
    return {
      error: {
        status: error?.status || 500,
        message: error?.message || "The request failed. Please try again.",
        code: error?.code,
        fieldErrors: error?.fieldErrors,
      },
    };
  }
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    login: builder.mutation({
      queryFn: (payload) => runService(() => services.auth.login(payload)),
    }),
    register: builder.mutation({
      queryFn: (payload) => runService(() => services.auth.register(payload)),
    }),
    logout: builder.mutation({
      queryFn: () => runService(() => services.auth.logout()),
    }),
    refreshToken: builder.mutation({
      queryFn: () => runService(() => services.auth.refreshToken()),
    }),
    verifyOtp: builder.mutation({
      queryFn: (payload) => runService(() => services.auth.verifyOtp(payload)),
    }),
    resendOtp: builder.mutation({
      queryFn: (payload) => runService(() => services.auth.resendOtp(payload)),
    }),
    forgotPassword: builder.mutation({
      queryFn: (payload) => runService(() => services.auth.forgotPassword(payload)),
    }),
    verifyResetOtp: builder.mutation({
      queryFn: (payload) => runService(() => services.auth.verifyResetOtp(payload)),
    }),
    resetPassword: builder.mutation({
      queryFn: (payload) => runService(() => services.auth.resetPassword(payload)),
    }),
    getSession: builder.query({
      queryFn: () => runService(() => services.auth.getSession()),
      providesTags: ["User"],
    }),
    getProfile: builder.query({
      queryFn: () => runService(() => services.user.getProfile()),
      providesTags: ["User"],
    }),
    getContents: builder.query({
      queryFn: () => runService(() => services.contents.getLegalContent()),
    }),
    updateProfile: builder.mutation({
      queryFn: (payload) => runService(() => services.user.updateProfile(payload)),
      invalidatesTags: ["User"],
    }),
    changePassword: builder.mutation({
      queryFn: (payload) => runService(() => services.user.changePassword(payload)),
    }),
    deleteProfile: builder.mutation({
      queryFn: () => runService(() => services.user.deleteProfile()),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useVerifyResetOtpMutation,
  useResetPasswordMutation,
  useGetSessionQuery,
  useGetProfileQuery,
  useGetContentsQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteProfileMutation,
} = apiSlice;
