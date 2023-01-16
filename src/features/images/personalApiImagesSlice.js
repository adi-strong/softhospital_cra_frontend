import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalPersonalImages = 0
const personalImagesAdapter = createEntityAdapter()
const initialState = personalImagesAdapter.getInitialState()

export const personalApiImagesSlice = api.injectEndpoints({
  endpoints: build => ({
    getPersonalImages: build.query({
      query: () => pathToApi+'/personal_image_objects',
      transformResponse: res => {
        totalPersonalImages = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        const loadImages = data?.map(image => {
          if (image?.createdAt) image.createdAt = moment(image.createdAt).calendar()
          return image
        })
        return personalImagesAdapter.setAll(initialState, loadImages)
      },
      providesTags: result => [
        {type: 'PersonalImages', id: 'LIST'},
        ...result.ids.map(id => ({type: 'PersonalImages', id}))
      ],
    }), // Get Personal Images
    addNewPersonalImage: build.mutation({
      query: image => ({
        url: pathToApi+'/personal_image_objects',
        method: 'POST',
        body: image,
      }),
      invalidatesTags: ['PersonalImages']
    }), // Add new Personal Image
    deletePersonalImage: build.mutation({
      query: id => ({
        url: pathToApi+`/personal_image_objects/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['PersonalImages']
    }), // Delete Personal Image
  })
})

export const  {
  useGetPersonalImagesQuery,
  useAddNewPersonalImageMutation,
  useDeletePersonalImageMutation,
} = personalApiImagesSlice
