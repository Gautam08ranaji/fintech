import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  token: null,
  loading: true, // 👈 important
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
      state.loading = false;
    },
    logout: (state) => {
      state.token = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setToken, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;