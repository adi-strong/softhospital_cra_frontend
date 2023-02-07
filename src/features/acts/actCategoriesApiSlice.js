import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalActCategories = 0
const actCategoriesAdapter = createEntityAdapter()
const initialState = actCategoriesAdapter.getInitialState()

export const actCategoriesApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getActCategories: build.query({
      query: () => pathToApi+'/act_categories',
      transformResponse: res => {
        totalActCategories = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadActCategories = data.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
        return actCategoriesAdapter.setAll(initialState, loadActCategories)
      },
      providesTags: result => [
        {type: 'ActCategories', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'ActCategories', id }))
      ]
    }), // list of acts

    addNewActCategory: build.mutation({
      query: category => ({
        url: pathToApi+'/act_categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['ActCategories']
    }), // add new act

    updateActCategory: build.mutation({
      query: category => ({
        headers: patchHeaders,
        url: pathToApi+`/act_categories/${category.id}`,
        method: 'PATCH',
        body: JSON.stringify({name: category.name}),
      }),
      invalidatesTags: ['ActCategories', 'Act']
    }), // update act

    deleteActCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/act_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['ActCategories', 'Act']
    }), // delete act
  })
})

export const {
  useGetActCategoriesQuery,
  useAddNewActCategoryMutation,
  useUpdateActCategoryMutation,
  useDeleteActCategoryMutation,
} = actCategoriesApiSlice
