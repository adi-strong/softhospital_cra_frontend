import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isFetching: false,
  isSuccess: false,
  isError: false,
  appointments: [],
}

export const agentAppointmentsSlice = createSlice({
  name: 'agentAppointments',
  initialState,
  reducers: {
    onResetAgentAppointments: () => initialState,
    onSetIsLoading: (state, action) => {state.isLoading = action.payload},
    onSetIsFetching: (state, action) => {state.isFetching = action.payload},
    onSetIsSuccess: (state, action) => {state.isSuccess = action.payload},
    onSetIsError: (state, action) => {state.isError = action.payload},
    onSetData: (state, action) => {state.appointments = action.payload}
  }
})

export const {
  onResetAgentAppointments,
  onSetIsLoading,
  onSetIsFetching,
  onSetIsSuccess,
  onSetIsError,
  onSetData,
} = agentAppointmentsSlice.actions

export default agentAppointmentsSlice.reducer
