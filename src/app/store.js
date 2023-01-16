import { configureStore } from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery, setupListeners} from "@reduxjs/toolkit/dist/query/react";
import navigationSlice from "../features/navigation/navigationSlice";
import authReducer from '../features/auth/authSlice';

export const entrypoint = 'https://localhost:8000'
export const pathToApi = '/api'

const baseQuery = fetchBaseQuery({
  baseUrl: entrypoint,
  mode: 'cors',
  prepareHeaders: (headers, {getState}) => {
    const token = getState().auth.token
      ? getState().auth.token
      : localStorage.getItem('authToken')
        ? localStorage.getItem('authToken')
        : null
    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  },
})

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  refetchOnReconnect: true,
  tagTypes: [
    'Images',
    'PersonalImages',
  ],
  endpoints: build => ({}),
})

export const store = configureStore({
  reducer: {
    [navigationSlice.name]: navigationSlice.reducer,
    auth: authReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: gDM => gDM().concat(api.middleware),
  devTools: true,
});

setupListeners(store.dispatch)
