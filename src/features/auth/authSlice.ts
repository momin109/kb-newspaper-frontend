import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { AuthUser } from './types/auth.types'

interface AuthState {
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
}

/**
 * authSlice owns global auth state — needed synchronously across the
 * app tree (axios interceptor, route guards, header UI). The backend
 * issues a single long-lived JWT (7d, no refresh-token flow), returned
 * directly in the login/register response body — so unlike the earlier
 * design, there's no separate refresh token to manage here.
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
    logout(state) {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer
