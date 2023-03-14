import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalActs = 0
const actsAdapter = createEntityAdapter()
const initialState = actsAdapter.getInitialState()

export const actApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getActs: build.query({
      query: () => pathToApi+'/acts',
      transformResponse: res => {
        totalActs = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadActs = data.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
        return actsAdapter.setAll(initialState, loadActs)
      },
      providesTags: result => [
        {type: 'Act', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Act', id }))
      ]
    }), // list of acts

    addNewAct: build.mutation({
      query: act => ({
        url: pathToApi+'/acts',
        method: 'POST',
        body: {...act, price: act.price ? act.price.toString() : '0'},
      }),
      invalidatesTags: ['Act']
    }), // add new act

    updateAct: build.mutation({
      query: act => ({
        headers: patchHeaders,
        url: pathToApi+`/acts/${act.id}`,
        method: 'PATCH',
        body: JSON.stringify(act),
      }),
      invalidatesTags: ['Act']

    }), // update act

    deleteAct: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/acts/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Act']
    }), // delete act

    handleLoadActs: build.query({
      query: keyword => pathToApi+`/acts?wording=${keyword}`,
      transformResponse: res => {
        return res['hydra:member']?.map(act => {

          return {
            id: act?.id,
            label: act?.wording,
            value: act['@id'],
          }

        })
      },
    }),
  })
})

export const {
  useGetActsQuery,
  useAddNewActMutation,
  useUpdateActMutation,
  useDeleteActMutation,
  useLazyHandleLoadActsQuery
} = actApiSlice
