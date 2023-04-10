import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  rate: null,
  fCurrency: null,
  sCurrency: null,
  hospital: null,
  fOperation: null,
  lOperation: null,
}

export const parametersSlice = createSlice({
  name: 'parameters',
  initialState,
  reducers: {
    onSetCurrency: (state, action) => { state.fCurrency = action.payload },
    onSetSecondCurrency: (state, action) => { state.sCurrency = action.payload },
    onSetHospital: (state, action) => { state.hospital = action.payload },
    onSetRate: (state, action) => { state.rate = action.payload },
    onSetFOperation: (state, action) => { state.fOperation = action.payload },
    onSetLOperation: (state, action) => { state.lOperation = action.payload },
    resetParameters: () => initialState,
  },
})

export const {
  onSetFOperation,
  onSetLOperation,
  onSetCurrency,
  onSetSecondCurrency,
  onSetHospital,
  onSetRate,
  resetParameters,
} = parametersSlice.actions

export default parametersSlice.reducer
