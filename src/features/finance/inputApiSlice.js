import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalInputs = 0
const inputsAdapter = createEntityAdapter()
const initialState = inputsAdapter.getInitialState()

export const inputApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getInputs: build.query({
      query: () => pathToApi+'/box_inputs',
      transformResponse: res => {
        totalInputs = parseInt(res['hydra:totalItems'])
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

    addNewInput: build.mutation({
      query: input => ({
        url: pathToApi+'/box_inputs',
        method: 'POST',
        body: {...input, amount: input.amount.toString()},
      }),
      invalidatesTags: ['Input', 'Box'],
    }), // Add new Input
  })
})

export const { useGetInputsQuery, useAddNewInputMutation } = inputApiSlice
