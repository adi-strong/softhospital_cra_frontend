import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  rate: null,
  fCurrency: null,
  sCurrency: null,
  hospital: null,
}

export const parametersSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {
    onSetCurrency: (state, action) => { state.fCurrency = action.payload },
    onSetSecondCurrency: (state, action) => { state.sCurrency = action.payload },
    onSetHospital: (state, action) => { state.hospital = action.payload },
    onSetRate: (state, action) => { state.rate = action.payload },
    resetParameters: () => initialState,
  },
})

export const {
  onSetCurrency,
  onSetSecondCurrency,
  onSetHospital,
  onSetRate,
  resetParameters,
} = parametersSlice.actions

export default parametersSlice.reducer
