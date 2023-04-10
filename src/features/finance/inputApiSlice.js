import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalInputs = 0
const inputsAdapter = createEntityAdapter()
const initialState = inputsAdapter.getInitialState()

export let totalResearchInputs = 0
export let researchInputsPages = 1
export let inputsPages = 1

export const inputApiSlice = api.injectEndpoints({
  endpoints: build => ({

    addNewInput: build.mutation({
      query: input => ({
        url: pathToApi+'/box_inputs',
        method: 'POST',
        body: {...input, amount: input.amount.toString()},
      }),
      invalidatesTags: ['Input', 'Box'],
    }), // Add new Input

    getInputs: build.query({
      query: () => pathToApi+'/box_inputs',
      transformResponse: res => {
        totalInputs = parseInt(res['hydra:totalItems'])
        inputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        const loadInputs = data.map(input => {
          if (input?.createdAt) input.createdAt = moment(input.createdAt).calendar()
          return input
        })
        return inputsAdapter.setAll(initialState, loadInputs)
      },
      providesTags: result => [
        {type: 'Input', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Input', id }))
      ]
    }), // Get list of Input

    getInputsByPagination: build.query({
      query: page => pathToApi+`/box_inputs?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalInputs = res['hydra:totalItems']
        inputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchInputs: build.query({
      query: keyword => pathToApi+`/box_inputs?reason=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchInputs = res['hydra:totalItems']
        researchInputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchInputsByPagination: build.query({
      query: search => pathToApi+`/box_inputs?reason=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchInputs = res['hydra:totalItems']
        researchInputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetInputsByPaginationQuery,
  useLazyGetResearchInputsQuery,
  useLazyGetResearchInputsByPaginationQuery,
  useGetInputsQuery,
  useAddNewInputMutation,
} = inputApiSlice
