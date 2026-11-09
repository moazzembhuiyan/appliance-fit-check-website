import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, status: "loading" },
  reducers: {
    setUser(state, { payload }) {
      state.user = payload;
      state.status = payload ? "authenticated" : "unauthenticated";
    },
    clearUser(state) {
      state.user = null;
      state.status = "unauthenticated";
    },
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
