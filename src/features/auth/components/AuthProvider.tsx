"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "@/store";
import { logout, setCredentials } from "../authSlice";
import { authService } from "../services/auth.service";

const TOKEN_KEY = "kb_auth_token";
const USER_KEY = "kb_auth_user";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch<AppDispatch>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);

        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await authService.getMe();

        dispatch(
          setCredentials({
            token,
            user: response.data,
          }),
        );

        localStorage.setItem(USER_KEY, JSON.stringify(response.data));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);

        dispatch(logout());
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [dispatch]);

  if (isLoading) {
    return null;
  }

  return <>{children}</>;
}
