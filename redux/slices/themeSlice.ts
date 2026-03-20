import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type ThemeType = "light" | "dark" | "system";

interface ThemeState {
  mode: ThemeType | null; // ✅ allow null
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
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;