import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { fetchProfile } from "./fetchProfile";

const API_BASE_URL = "http://localhost:5000/api/v1";
console.log("API_BASE_URL:", API_BASE_URL);

// Register user
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await axios.post(`${API_BASE_URL}/users/register`, formData);
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: error.message || "Something went wrong" }
            );
        }
    }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/users/login`,
        formData,
        { withCredentials: true } // ✅ allow cookies
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: error.message || "Something went wrong" }
      );
    }
  }
);

const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
    },
    reducers: {
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch profile on refresh
            .addCase(fetchProfile.fulfilled, (state, action) => {
                if (action.payload && action.payload.success) {
                    state.user = action.payload.user;
                    state.isAuthenticated = true;
                } else {
                    state.user = null;
                    state.isAuthenticated = false;
                }
            })
            .addCase(fetchProfile.rejected, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token || null;
                state.isAuthenticated = true;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token || null;
                state.isAuthenticated = true;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
