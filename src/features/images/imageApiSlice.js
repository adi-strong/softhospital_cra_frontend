import {api, pathToApi} from "../../app/store";
import moment from "moment";
import {createEntityAdapter} from "@reduxjs/toolkit";

export let totalImages = 0
const imagesAdapter = createEntityAdapter()
const initialState = imagesAdapter.getInitialState()

export let imagesPages = 1

export const imageApiSlice = api.injectEndpoints({
  endpoints: build => ({
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

    getImages: build.query({
      query: () => pathToApi+'/image_objects',
      transformResponse: res => {
        totalImages = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        imagesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
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

    getImagesByPagination: build.query({
      query: page => pathToApi+`/image_objects?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalImages = res['hydra:totalItems']
        imagesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

  })
})

export const {
  useLazyGetImagesByPaginationQuery,
  useGetImagesQuery,
  useAddNewImageMutation,
  useDeleteImageMutation,
} = imageApiSlice
