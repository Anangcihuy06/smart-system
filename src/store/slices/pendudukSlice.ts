import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Penduduk } from '@/types';
import { pendudukData } from '@/data/dukcapil';

interface PendudukState {
  data: Penduduk[];
  filteredData: Penduduk[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  selectedKecamatan: string;
  selectedStatus: string;
}

const initialState: PendudukState = {
  data: [],
  filteredData: [],
  loading: false,
  error: null,
  searchTerm: '',
  selectedKecamatan: '',
  selectedStatus: '',
};

export const fetchPenduduk = createAsyncThunk(
  'penduduk/fetchAll',
  async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return pendudukData;
  }
);

const filterPenduduk = (state: PendudukState): Penduduk[] => {
  return state.data.filter((item) => {
    const matchesSearch =
      state.searchTerm === '' ||
      item.nama.toLowerCase().includes(state.searchTerm.toLowerCase()) ||
      item.nik.includes(state.searchTerm) ||
      item.alamat.toLowerCase().includes(state.searchTerm.toLowerCase());

    const matchesKecamatan =
      state.selectedKecamatan === '' || item.kecamatan === state.selectedKecamatan;

    const matchesStatus = state.selectedStatus === '' || item.status === state.selectedStatus;

    return matchesSearch && matchesKecamatan && matchesStatus;
  });
};

const pendudukSlice = createSlice({
  name: 'penduduk',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      state.filteredData = filterPenduduk(state);
    },
    setSelectedKecamatan: (state, action: PayloadAction<string>) => {
      state.selectedKecamatan = action.payload;
      state.filteredData = filterPenduduk(state);
    },
    setSelectedStatus: (state, action: PayloadAction<string>) => {
      state.selectedStatus = action.payload;
      state.filteredData = filterPenduduk(state);
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.selectedKecamatan = '';
      state.selectedStatus = '';
      state.filteredData = state.data;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPenduduk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPenduduk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.filteredData = action.payload;
      })
      .addCase(fetchPenduduk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export const { setSearchTerm, setSelectedKecamatan, setSelectedStatus, clearFilters } =
  pendudukSlice.actions;
export default pendudukSlice.reducer;
