import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalOutputs = 0
const outputsAdapter = createEntityAdapter()
const initialState = outputsAdapter.getInitialState()

export let totalResearchOutputs = 0
export let researchOutputsPages = 1
export let outputsPages = 1

export const outputApiSlice = api.injectEndpoints({
  endpoints: build => ({

    addNewOutput: build.mutation({
      query: output => ({
        url: pathToApi+'/box_outputs',
        method: 'POST',
        body: {...output, amount: output.amount.toString()},
      }),
      invalidatesTags: ['Output', 'Box'],
    }), // Add new Output

    getOutputs: build.query({
      query: () => pathToApi+'/box_outputs',
      transformResponse: res => {
        totalOutputs = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member']
        outputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const loadOutputs = data.map(output => {
          if (output?.createdAt) output.createdAt = moment(output.createdAt).calendar()
          return output
        })
        return outputsAdapter.setAll(initialState, loadOutputs)
      },
      providesTags: result => [
        {type: 'Output', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Output', id }))
      ]
    }), // Get list of Output

    getOutputsByPagination: build.query({
      query: page => pathToApi+`/box_outputs?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalOutputs = res['hydra:totalItems']
        outputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchOutputs: build.query({
      query: keyword => pathToApi+`/box_outputs?reason=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchOutputs = res['hydra:totalItems']
        researchOutputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchOutputsByPagination: build.query({
      query: search => pathToApi+`/box_outputs?reason=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchOutputs = res['hydra:totalItems']
        researchOutputsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetOutputsByPaginationQuery,
  useLazyGetResearchOutputsQuery,
  useLazyGetResearchOutputsByPaginationQuery,
  useGetOutputsQuery,
  useAddNewOutputMutation
} = outputApiSlice
