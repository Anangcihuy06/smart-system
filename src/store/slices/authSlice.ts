import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'warga' | 'opd';
  avatar?: string;
  opd?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const generateToken = (user: User): string => {
  const payload = {
    id: user.id,
    email: user.email,
    role: user.role,
    exp: Date.now() + 24 * 60 * 60 * 1000,
  };
  return btoa(JSON.stringify(payload));
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (credentials.email === 'admin@kebumen.go.id' && credentials.password === 'admin123') {
      const user: User = {
        id: '1',
        name: 'Nanang Wahyudi',
        email: credentials.email,
        role: 'admin',
        avatar: 'NW',
      };
      return { user, token: generateToken(user) };
    }

    if (credentials.email === 'warga@email.com' && credentials.password === 'warga123') {
      const user: User = {
        id: '2',
        name: 'Ahmad Wijaya',
        email: credentials.email,
        role: 'warga',
        avatar: 'AW',
      };
      return { user, token: generateToken(user) };
    }

    if (credentials.email === 'opd@dinkes.kebumen.go.id' && credentials.password === 'opd123') {
      const user: User = {
        id: '3',
        name: 'Dr. Budi Santoso',
        email: credentials.email,
        role: 'opd',
        avatar: 'BS',
        opd: 'Dinas Kesehatan',
      };
      return { user, token: generateToken(user) };
    }

    throw new Error('Email atau password salah');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Login failed';
      });
  },
});

export const { logout, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
