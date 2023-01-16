import {api, pathToApi} from "../../app/store";
import moment from "moment";
import {createEntityAdapter} from "@reduxjs/toolkit";

export let totalImages = 0
const imagesAdapter = createEntityAdapter()
const initialState = imagesAdapter.getInitialState()

export const imageApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getImages: build.query({
      query: () => pathToApi+'/image_objects',
      transformResponse: res => {
        totalImages = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        const loadImages = data?.map(image => {
          if (image?.createdAt) image.createdAt = moment(image.createdAt).calendar()
          return image
        })
        return imagesAdapter.setAll(initialState, loadImages)
      },
      providesTags: result => [
        {type: 'Images', id: 'LIST'},
        ...result.ids.map(id => ({type: 'Images', id}))
      ]
    }), // Get images
    addNewImage: build.mutation({
      query: image => ({
        url: pathToApi+'/image_objects',
        method: 'POST',
        body: image,
      }),
      invalidatesTags: ['Images']
    }), // Add new Image
    deleteImage: build.mutation({
      query: id => ({
        url: pathToApi+`/image_objects/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['Images']
    }), // Delete Image
  })
})

export const {
  useGetImagesQuery,
  useAddNewImageMutation,
  useDeleteImageMutation,
} = imageApiSlice
