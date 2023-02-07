import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";
import {createEntityAdapter} from "@reduxjs/toolkit";

export let totalExamCategories = 0
const examCategoriesAdapter = createEntityAdapter()
const initialState = examCategoriesAdapter.getInitialState()

export const examCategoryApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getExamCategories: build.query({
      query: () => pathToApi+'/exam_categories',
      transformResponse: res => {
        totalExamCategories = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadExamCategories = data.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
        return examCategoriesAdapter.setAll(initialState, loadExamCategories)
      },
      providesTags: result => [
        {type: 'ExamCategories', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'ExamCategories', id }))
      ]
    }), // list of categories

    addNewExamCategory: build.mutation({
      query: category => ({
        url: pathToApi+'/exam_categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['ExamCategories']
    }), // add new category

    updateExamCategory: build.mutation({
      query: category => ({
        headers: patchHeaders,
        url: pathToApi+`/exam_categories/${category.id}`,
        method: 'PATCH',
        body: JSON.stringify({name: category.name}),
      }),
      invalidatesTags: ['ExamCategories', 'Exam']
    }), // update category

    deleteExamCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/exam_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['ExamCategories', 'Exam']
    }), // delete category
  })
})

export const {
  useGetExamCategoriesQuery,
  useAddNewExamCategoryMutation,
  useUpdateExamCategoryMutation,
  useDeleteExamCategoryMutation,
} = examCategoryApiSlice
