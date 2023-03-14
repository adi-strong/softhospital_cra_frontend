import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";
import {createEntityAdapter} from "@reduxjs/toolkit";

export let totalBedroomCategories = 0
const bedroomCategoriesAdapter = createEntityAdapter()
const initialState = bedroomCategoriesAdapter.getInitialState()

export const bedroomCategoryApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getBedroomCategories: build.query({
      query: () => pathToApi+'/bedroom_categories',
      transformResponse: res => {
        totalBedroomCategories = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadBedroomCategories = data.map(category => {
          if (category?.createdAt) category.createdAt = moment(category.createdAt).calendar()
          return category
        })
        return bedroomCategoriesAdapter.setAll(initialState, loadBedroomCategories)
      },
      providesTags: result => [
        {type: 'BedroomCategories', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'BedroomCategories', id }))
      ]
    }), // list of categories

    addNewBedroomCategory: build.mutation({
      query: category => ({
        url: pathToApi+'/bedroom_categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['BedroomCategories']
    }), // add new category

    updateBedroomCategory: build.mutation({
      query: category => ({
        headers: patchHeaders,
        url: pathToApi+`/bedroom_categories/${category.id}`,
        method: 'PATCH',
        body: JSON.stringify({name: category.name}),
      }),
      invalidatesTags: ['BedroomCategories', 'Bedroom', 'Bed']
    }), // update category

    deleteBedroomCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/bedroom_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['BedroomCategories', 'Bedroom', 'Bed']
    }), // delete category
  })
})

export const {
  useGetBedroomCategoriesQuery,
  useAddNewBedroomCategoryMutation,
  useUpdateBedroomCategoryMutation,
  useDeleteBedroomCategoryMutation,
} = bedroomCategoryApiSlice
