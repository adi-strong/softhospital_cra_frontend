import {api, pathToApi} from "../../app/store";

export const authApiSlice = api.injectEndpoints({
  endpoints: build => ({
    login: build.mutation({
      query: credentials => ({
        url: '/auth',
        method: 'POST',
        body: credentials,
      })
    }), // login
    register: build.mutation({
      query: credentials => ({
        url: pathToApi+'/users',
        method: 'POST',
        body: credentials,
      })
    }), // register
  })
})

export const {
  useLoginMutation,
  useRegisterMutation,
} = authApiSlice
