import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalOutputs = 0
const outputsAdapter = createEntityAdapter()
const initialState = outputsAdapter.getInitialState()

export const outputApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getOutputs: build.query({
      query: () => pathToApi+'/box_outputs',
      transformResponse: res => {
        totalOutputs = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member']
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

    addNewOutput: build.mutation({
      query: output => ({
        url: pathToApi+'/box_outputs',
        method: 'POST',
        body: {...output, amount: output.amount.toString()},
      }),
      invalidatesTags: ['Output', 'Box'],
    }), // Add new Output
  })
})

export const { useGetOutputsQuery, useAddNewOutputMutation } = outputApiSlice
