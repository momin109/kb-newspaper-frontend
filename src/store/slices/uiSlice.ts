import { createSlice } from '@reduxjs/toolkit'

interface UiState {
  isMobileNavOpen: boolean
  isSearchOverlayOpen: boolean
}

const initialState: UiState = {
  isMobileNavOpen: false,
  isSearchOverlayOpen: false,
}

/** Pure client-side UI state — mobile drawer / search overlay visibility. */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openMobileNav(state) {
      state.isMobileNavOpen = true
    },
    closeMobileNav(state) {
      state.isMobileNavOpen = false
    },
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen
    },
    openSearchOverlay(state) {
      state.isSearchOverlayOpen = true
    },
    closeSearchOverlay(state) {
      state.isSearchOverlayOpen = false
    },
  },
})

export const {
  openMobileNav,
  closeMobileNav,
  toggleMobileNav,
  openSearchOverlay,
  closeSearchOverlay,
} = uiSlice.actions
export default uiSlice.reducer
