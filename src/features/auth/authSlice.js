import {createSlice} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, token: null },
  reducers: {
    setCredentials: (state, action) => {
      const {username, name, roles, email, tel, id} = jwtDecode(action.payload)
      state.user = {username, name, roles, email, tel, id}
      state.token = action.payload
      localStorage.setItem('authToken', state.token)
    },
    logOut: state => {
      state.user = null
      state.token = null
      localStorage.removeItem('authToken')
    },
    setup: state => {
      if (state.token) {
        const { exp } = jwtDecode(state.token)
        if (Date.now() < (exp * 1000)) {
          state.user = null
          state.token = null
          localStorage.removeItem('authToken')
        }
      }
    },
  }
})

export const { setCredentials, logOut, setup } = authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = state => state.auth.user
export const selectCurrentToken = state => state.auth.token
