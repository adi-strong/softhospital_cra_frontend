import { configureStore } from '@reduxjs/toolkit';
import {createApi, fetchBaseQuery, setupListeners} from "@reduxjs/toolkit/dist/query/react";
import navigationSlice from "../features/navigation/navigationSlice";
import authReducer from '../features/auth/authSlice';
import parametersReducer from '../features/parameters/parametersSlice';
import agentAppointmentsReducer from '../features/appointments/agentAppointmentsSlice';

export const entrypoint = 'https://localhost:8000'
export const pathToApi = '/api'
export const patchHeaders = {
  'Accept': 'application/ld+json',
  'Content-Type': 'application/merge-patch+json',
}

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
    'Users',
    'Parameters',
    'Departments',
    'Services',
    'Offices',
    'Agents',
    'Box',
    'Expense',
    'ExpenseCategories',
    'Input',
    'SupplyInvoices',
    'SingleSupplyInvoice',
    'Output',
    'ConsultationType',
    'Act',
    'ActCategories',
    'Exam',
    'ExamCategories',
    'Treatment',
    'TreatmentCategories',
    'Bedroom',
    'BedroomCategories',
    'Bed',
    'Covenant',
    'CovenantPatients',
    'SingleCovenant',
    'Patient',
    'SinglePatient',
    'Drugstore',
    'DrugstoreList',
    'ConsumptionUnits',
    'MedicineCategories',
    'MedicineSubCategories',
    'Providers',
    'DrugstoreInvoices',
    'MedicineInvoices',
    'SingleMedicineInvoice',
    'Consultations',
    'SingleConsultation',
    'Invoices',
    'SingleInvoice',
    'Lab',
    'SingleLab',
    'Nursing',
    'SingleNursing',
    'Prescription',
    'SinglePrescription',
    'Appointments',
    'AppointmentsPaginated',
    'Orders',
    'SingleOrder',
    'AgentAppointments',
    'SingleCovenantInvoicesList',
  ],
  endpoints: build => ({}),
})

export const store = configureStore({
  reducer: {
    [navigationSlice.name]: navigationSlice.reducer,
    auth: authReducer,
    parameters: parametersReducer,
    agentAppointments: agentAppointmentsReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: gDM => gDM().concat(api.middleware),
  devTools: true,
});

setupListeners(store.dispatch)
