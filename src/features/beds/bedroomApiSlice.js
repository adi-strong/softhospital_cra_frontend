import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";
import {createEntityAdapter} from "@reduxjs/toolkit";

export let totalBedrooms = 0
const bedroomsAdapter = createEntityAdapter()
const initialState = bedroomsAdapter.getInitialState()

export const bedroomApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getBedrooms: build.query({
      query: () => pathToApi+'/bedrooms',
      transformResponse: res => {
        totalBedrooms = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadBedrooms = data.map(bedroom => {
          if (bedroom?.createdAt) bedroom.createdAt = moment(bedroom.createdAt).calendar()
          return bedroom
        })
        return bedroomsAdapter.setAll(initialState, loadBedrooms)
      },
      providesTags: result => [
        {type: 'Bedroom', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Bedroom', id }))
      ]
    }), // list of bedrooms

    addNewBedroom: build.mutation({
      query: bedroom => ({
        url: pathToApi+'/bedrooms',
        method: 'POST',
        body: bedroom,
      }),
      invalidatesTags: ['Bedroom']
    }), // add new bedroom

    updateBedroom: build.mutation({
      query: bedroom => ({
        headers: patchHeaders,
        url: pathToApi+`/bedrooms/${bedroom.id}`,
        method: 'PATCH',
        body: JSON.stringify(bedroom),
      }),
      invalidatesTags: ['Bedroom', 'Bed']

    }), // update bedroom

    deleteBedroom: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/bedrooms/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Bedroom', 'Bed']
    }), // delete bedroom

    handleLoadBedrooms: build.query({
      query: keyword => pathToApi+`/bedrooms?number=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        return data.map(bedroom => {
          const category = data?.category ? ` (${data.category?.name})` : ''
          return {
            label: bedroom.number+category,
            value: bedroom['@id'],
          }
        })
      }
    }), // list of bedrooms
  })
})

export const {
  useGetBedroomsQuery,
  useAddNewBedroomMutation,
  useUpdateBedroomMutation,
  useDeleteBedroomMutation,
  useLazyHandleLoadBedroomsQuery,
} = bedroomApiSlice
