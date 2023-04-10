import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalPersonalImages = 0
const personalImagesAdapter = createEntityAdapter()
const initialState = personalImagesAdapter.getInitialState()

export let imagesPages = 1

export const personalApiImagesSlice = api.injectEndpoints({
  endpoints: build => ({
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

    getPersonalImages: build.query({
      query: () => pathToApi+'/personal_image_objects',
      transformResponse: res => {
        totalPersonalImages = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        imagesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
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

    getPersonalImagesByPagination: build.query({
      query: page => pathToApi+`/personal_image_objects?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalPersonalImages = res['hydra:totalItems']
        imagesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,
  })
})

export const  {
  useLazyGetPersonalImagesByPaginationQuery,
  useGetPersonalImagesQuery,
  useAddNewPersonalImageMutation,
  useDeletePersonalImageMutation,
} = personalApiImagesSlice
