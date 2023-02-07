import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalTreatmentCategories = 0
const treatmentCategoriesAdapter = createEntityAdapter()
const initialState = treatmentCategoriesAdapter.getInitialState()

export const treatmentCategoryApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getTreatmentCategories: build.query({
      query: () => pathToApi+'/treatment_categories',
      transformResponse: res => {
        totalTreatmentCategories = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadTreatmentCategories = data.map(category => {
          if (category?.createdAt) category.createdAt = moment(category.createdAt).calendar()
          return category
        })
        return treatmentCategoriesAdapter.setAll(initialState, loadTreatmentCategories)
      },
      providesTags: result => [
        {type: 'TreatmentCategories', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'TreatmentCategories', id }))
      ]
    }), // list of categories

    addNewTreatmentCategory: build.mutation({
      query: category => ({
        url: pathToApi+'/treatment_categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['TreatmentCategories']
    }), // add new category

    updateTreatmentCategory: build.mutation({
      query: category => ({
        headers: patchHeaders,
        url: pathToApi+`/treatment_categories/${category.id}`,
        method: 'PATCH',
        body: JSON.stringify({name: category.name}),
      }),
      invalidatesTags: ['TreatmentCategories', 'Treatment']
    }), // update category

    deleteTreatmentCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/treatment_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['TreatmentCategories', 'Treatment']
    }), // delete category
  })
})

export const {
  useGetTreatmentCategoriesQuery,
  useAddNewTreatmentCategoryMutation,
  useUpdateTreatmentCategoryMutation,
  useDeleteTreatmentCategoryMutation,
} = treatmentCategoryApiSlice
