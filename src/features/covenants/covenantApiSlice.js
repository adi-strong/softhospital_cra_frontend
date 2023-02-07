import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalCovenants = 0
const covenantsAdapter = createEntityAdapter()
const initialState = covenantsAdapter.getInitialState()

export const covenantApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getCovenants: build.query({
      query: () => pathToApi+'/covenants',
      transformResponse: res => {
        totalCovenants = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadCovenants = data.map(covenant => {
          if (covenant?.createdAt) covenant.createdAt = moment(covenant.createdAt).calendar()
          return covenant
        })
        return covenantsAdapter.setAll(initialState, loadCovenants)
      },
      providesTags: result => [
        {type: 'Covenant', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Covenant', id }))
      ]
    }), // list of covenants

    addNewCovenant: build.mutation({
      query: covenant => ({
        url: pathToApi+'/covenants',
        method: 'POST',
        body: {...covenant, cost: covenant.cost.toString(), price: covenant.price.toString()},
      }),
      invalidatesTags: ['Covenant']
    }), // add new covenant

    updateCovenant: build.mutation({
      query: covenant => ({
        headers: patchHeaders,
        url: pathToApi+`/covenants/${covenant.id}`,
        method: 'PATCH',
        body: JSON.stringify(covenant),
      }),
      invalidatesTags: ['Covenant']

    }), // update covenant

    deleteCovenant: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/covenants/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Covenant']
    }), // delete covenant
  })
})

export const {
  useGetCovenantsQuery,
  useAddNewCovenantMutation,
  useUpdateCovenantMutation,
  useDeleteCovenantMutation,
} = covenantApiSlice
