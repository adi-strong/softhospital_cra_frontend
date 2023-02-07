import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalBeds = 0
const bedsAdapter = createEntityAdapter()
const initialState = bedsAdapter.getInitialState()

export const bedApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getBeds: build.query({
      query: () => pathToApi+'/beds',
      transformResponse: res => {
        totalBeds = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadBeds = data.map(bed => {
          if (bed?.createdAt) bed.createdAt = moment(bed.createdAt).calendar()
          return bed
        })
        return bedsAdapter.setAll(initialState, loadBeds)
      },
      providesTags: result => [
        {type: 'Bed', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Bed', id }))
      ]
    }), // list of beds

    addNewBed: build.mutation({
      query: bed => ({
        url: pathToApi+'/beds',
        method: 'POST',
        body: {...bed, cost: bed.cost.toString(), price: bed.price.toString()},
      }),
      invalidatesTags: ['Bed']
    }), // add new bed

    updateBed: build.mutation({
      query: bed => ({
        headers: patchHeaders,
        url: pathToApi+`/beds/${bed.id}`,
        method: 'PATCH',
        body: JSON.stringify({...bed, cost: bed.cost.toString(), price: bed.price.toString()}),
      }),
      invalidatesTags: ['Bed']

    }), // update bed

    deleteBed: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/beds/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Bed']
    }), // delete bed
  })
})

export const {
  useGetBedsQuery,
  useAddNewBedMutation,
  useUpdateBedMutation,
  useDeleteBedMutation,
} = bedApiSlice
