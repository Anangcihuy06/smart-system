import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Pengaduan } from '@/types';
import { pengaduanData } from '@/data/dukcapil';

interface PengaduanState {
  data: Pengaduan[];
  selectedPengaduan: Pengaduan | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
  filterStatus: string;
  filterKategori: string;
}

const initialState: PengaduanState = {
  data: [],
  selectedPengaduan: null,
  loading: false,
  submitting: false,
  error: null,
  filterStatus: '',
  filterKategori: '',
};

export const fetchPengaduan = createAsyncThunk(
  'pengaduan/fetchAll',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return pengaduanData;
  }
);

export const submitPengaduan = createAsyncThunk(
  'pengaduan/submit',
  async (pengaduan: Omit<Pengaduan, 'id' | 'tanggal' | 'status'>) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const newPengaduan: Pengaduan = {
      ...pengaduan,
      id: (Date.now()).toString(),
      tanggal: new Date().toISOString().split('T')[0],
      status: 'Baru',
    };
    return newPengaduan;
  }
);

const pengaduanSlice = createSlice({
  name: 'pengaduan',
  initialState,
  reducers: {
    setFilterStatus: (state, action: PayloadAction<string>) => {
      state.filterStatus = action.payload;
    },
    setFilterKategori: (state, action: PayloadAction<string>) => {
      state.filterKategori = action.payload;
    },
    selectPengaduan: (state, action: PayloadAction<Pengaduan | null>) => {
      state.selectedPengaduan = action.payload;
    },
    updateStatus: (state, action: PayloadAction<{ id: string; status: Pengaduan['status'] }>) => {
      const pengaduan = state.data.find((p) => p.id === action.payload.id);
      if (pengaduan) {
        pengaduan.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPengaduan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPengaduan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPengaduan.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      })
      .addCase(submitPengaduan.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitPengaduan.fulfilled, (state, action) => {
        state.submitting = false;
        state.data.unshift(action.payload);
      })
      .addCase(submitPengaduan.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.error.message || 'Failed to submit';
      });
  },
});

export const { setFilterStatus, setFilterKategori, selectPengaduan, updateStatus } =
  pengaduanSlice.actions;
export default pengaduanSlice.reducer;
