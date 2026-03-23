import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import pendudukReducer from './slices/pendudukSlice';
import chatbotReducer from './slices/chatbotSlice';
import pengaduanReducer from './slices/pengaduanSlice';
import dashboardReducer from './slices/dashboardSlice';
import authReducer from './slices/authSlice';
import toastReducer from './slices/toastSlice';

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'chatbot', 'pengaduan'],
};

const rootReducer = combineReducers({
  penduduk: pendudukReducer,
  chatbot: chatbotReducer,
  pengaduan: pengaduanReducer,
  dashboard: dashboardReducer,
  auth: authReducer,
  toast: toastReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
