import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalExpenseCategories = 0
const expensesAdapter = createEntityAdapter()
const initialState = expensesAdapter.getInitialState()

export const expenseCategoryApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getExpenseCategories: build.query({
      query: () => pathToApi+'/expense_categories',
      transformResponse: res => {
        totalExpenseCategories = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member']
        const loadExpenseCategories = data.map(category => {
          if (category?.createdAt) category.createdAt = moment(category.createdAt).calendar()
          return category
        })
        return expensesAdapter.setAll(initialState, loadExpenseCategories)
      },
      providesTags: result => [
        { type: 'ExpenseCategories', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'ExpenseCategories', id }))
      ]
    }), // Get list of category

    addNewExpenseCategory: build.mutation({
      query: category => ({
        url: pathToApi+'/expense_categories',
        method: 'POST',
        body: category,
      }),
      invalidatesTags: ['ExpenseCategories'],
    }), // Add new category

    updateExpenseCategory: build.mutation({
      query: category => ({
        headers: patchHeaders,
        url: pathToApi+`/expense_categories/${category.id}`,
        method: 'PATCH',
        body: JSON.stringify({name: category.name}),
      }),
      invalidatesTags: ['ExpenseCategories', 'Expense', 'Output'],
    }), // Update category

    deleteExpenseCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/expense_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['ExpenseCategories', 'Expense', 'Output'],
    }), // Update category
  })
})

export const {
  useGetExpenseCategoriesQuery,
  useAddNewExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApiSlice
