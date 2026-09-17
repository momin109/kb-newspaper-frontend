"use client";

import { useDispatch, useSelector } from "react-redux";

import type { RootState, AppDispatch } from "@/store";
import { logout as logoutAction, setCredentials } from "../authSlice";
import { authService } from "../services/auth.service";
import type { RegisterPayload } from "../types/auth.types";

const TOKEN_KEY = "kb_auth_token";
const USER_KEY = "kb_auth_user";

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    const user = response.data;
    const token = response.token;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch(setCredentials({ user, token }));

    return user;
  };

  const register = async (payload: RegisterPayload) => {
    const response = await authService.register(payload);
    const user = response.data;
    const token = response.token;

    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch(setCredentials({ user, token }));

    return user;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch(logoutAction());
  };

  return { ...auth, login, register, logout };
}
