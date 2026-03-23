import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ThemeType = "light" | "dark" | "system" | null; // ✅ include null

interface ThemeState {
  mode: ThemeType;
}

const initialState: ThemeState = {
  mode: null, // ✅ FIRST TIME → show theme screen
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeType>) => {
      state.mode = action.payload;
    },

    // ✅ OPTIONAL (VERY USEFUL)
    resetTheme: (state) => {
      state.mode = null;
    },
  },
});

export const { setTheme, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;