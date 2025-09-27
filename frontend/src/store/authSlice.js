import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      if (userData.profilePic && userData.profilePic[0]) {
        formData.append('profilePic', userData.profilePic[0]);
      }

      const response = await axios.post('http://localhost:3000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue, getState }) => { // Added getState
    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', userData);
      // Set Authorization header for subsequent requests
      if (response.data.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
      
      
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

// New async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (userData, { rejectWithValue }) => {
    try {
      // Assuming the API endpoint for updating user profile is /api/auth/updateProfile
      // and it accepts the updated user data in the request body.
      // The token should already be set in axios defaults if the user is logged in.
      const response = await axios.put('http://localhost:3000/api/auth/updateProfile', userData);
      return response.data; // Assuming the API returns the updated user data
    } catch (error) {
      if (error.response && error.response.data.message) {
        return rejectWithValue(error.response.data.message);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);


const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    loading: false,
    error: null,
  },
  reducers: {
    loadUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      // Ensure axios headers are set if token is loaded
      if (action.payload.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      }
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      // Remove Authorization header on logout
      delete axios.defaults.headers.common['Authorization'];
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Corrected typo
        // Only store token if it looks like a JWT (three base64url parts separated by dots)
        try {
          const token = action.payload.token;
          const jwtShape = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
          if (typeof token === 'string' && jwtShape.test(token)) {
            localStorage.setItem('token', token);
          } else {
            // Remove any previously stored token if new value is invalid
            localStorage.removeItem('token');
          }
        } catch (e) {
          localStorage.removeItem('token');
        }
        // Removed manual setting of Authorization header, relying on httpOnly cookie
        // if (action.payload.token) {
        //   axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
        // }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user)); // Corrected typo
        try {
          const token = action.payload.token;
          const jwtShape = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
          if (typeof token === 'string' && jwtShape.test(token)) {
            localStorage.setItem('token', token);
          } else {
            localStorage.removeItem('token');
          }
        } catch (e) {
          localStorage.removeItem('token');
        }
        // Removed manual setting of Authorization header, relying on httpOnly cookie
        // if (action.payload.token) {
        //   axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
        // }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for updateUserProfile
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        // Assuming the API returns the updated user object in action.payload.user
        state.user = action.payload.user;
        // If the API also returns a new token (e.g., due to re-authentication or token refresh)
        // state.token = action.payload.token;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        try {
          const token = action.payload.token;
          const jwtShape = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
          if (typeof token === 'string' && jwtShape.test(token)) {
            localStorage.setItem('token', token);
          }
        } catch (e) {
          // ignore
        }
        // If token is updated, update it in localStorage and axios headers as well
        // if (action.payload.token) {
        //   localStorage.setItem('token', action.payload.token);
        //   axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
        // }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions generated by createSlice
export const { loadUser, logoutUser } = authSlice.actions;

export default authSlice.reducer;
