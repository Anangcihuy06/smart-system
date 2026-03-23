import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Statistik, Kecamatan } from '@/types';
import { statistikData, kecamatanData } from '@/data/dukcapil';

interface DashboardState {
  statistik: Statistik | null;
  kecamatan: Kecamatan[];
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  statistik: null,
  kecamatan: [],
  loading: false,
  error: null,
};

export const fetchDashboardData = createAsyncThunk(
  'dashboard/fetchAll',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return {
      statistik: statistikData,
      kecamatan: kecamatanData,
    };
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.loading = false;
        state.statistik = action.payload.statistik;
        state.kecamatan = action.payload.kecamatan;
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

export default dashboardSlice.reducer;
