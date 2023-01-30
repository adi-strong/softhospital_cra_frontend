import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";

const boxAdapter = createEntityAdapter()
const initialState = boxAdapter.getInitialState()

export const boxApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getBox: build.query({
      query: () => pathToApi+'/boxes',
      transformResponse: res => {
        const data = res['hydra:member']
        const loadBoxes = data.map(box => box)
        return boxAdapter.setAll(initialState, loadBoxes)
      },
      providesTags: (result, error, arg) => [
        { type: 'Box', id: 'CURRENT_BOX' },
        ...result.ids.map(id => ({ type: 'Box', id }))
      ]
    }) // Get current box
  })
})

export const { useGetBoxQuery } = boxApiSlice
