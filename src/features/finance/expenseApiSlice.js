import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalExpenses = 0
const expensesAdapter = createEntityAdapter()
const initialState = expensesAdapter.getInitialState()

export const expenseApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getExpenses: build.query({
      query: () => pathToApi+'/box_expenses',
      transformResponse: res => {
        totalExpenses = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member']
        const loadExpenses = data.map(expense => {
          if (expense?.createdAt) expense.createdAt = moment(expense.createdAt).calendar()
          return expense
        })
        return expensesAdapter.setAll(initialState, loadExpenses)
      },
      providesTags: result => [
        {type: 'Expense', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Expense', id }))
      ]
    }), // Get list of expenses

    addNewExpense: build.mutation({
      query: expense => ({
        url: pathToApi+'/box_expenses',
        method: 'POST',
        body: {...expense, amount: expense.amount.toString()},
      }),
      invalidatesTags: ['Expense', 'Box'],
    }), // Add new Expense
  })
})

export const {
  useGetExpensesQuery,
  useAddNewExpenseMutation,
} = expenseApiSlice
