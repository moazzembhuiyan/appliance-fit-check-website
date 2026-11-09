"use client";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { apiSlice, useGetSessionQuery, useLogoutMutation } from "@/store/api";
import { clearUser, setUser } from "@/store/auth-slice";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.auth.status);
  const { data, error, isFetching } = useGetSessionQuery();

  useEffect(() => {
    if (data?.user) dispatch(setUser(data.user));
    else if (status === "loading" && error && !isFetching) dispatch(clearUser());
  }, [data, dispatch, error, isFetching, status]);

  return children;
}

export function useAuth() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.auth.status);
  const [logout] = useLogoutMutation();

  const signIn = useCallback((nextUser) => {
    dispatch(setUser(nextUser));
    dispatch(apiSlice.util.invalidateTags(["User"]));
  }, [dispatch]);
  const setCurrentUser = useCallback((nextUser) => dispatch(setUser(nextUser)), [dispatch]);
  const signOut = useCallback(async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearUser());
      dispatch(apiSlice.util.resetApiState());
    }
  }, [dispatch, logout]);

  return { user, status, signIn, signOut, setUser: setCurrentUser };
}
