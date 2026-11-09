"use client";

import { useState } from "react";
import { Provider } from "react-redux";
import { AuthProvider } from "@/context/auth-context";
import { makeStore } from "@/store/store";

export function AppProviders({ children }) {
  const [store] = useState(makeStore);

  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
