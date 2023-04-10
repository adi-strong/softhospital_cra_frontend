import {api, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalExpenses = 0
const expensesAdapter = createEntityAdapter()
const initialState = expensesAdapter.getInitialState()

export let totalResearchExpenses = 0
export let researchExpensesPages = 1
export let expensesPages = 1

export const expenseApiSlice = api.injectEndpoints({
  endpoints: build => ({

    addNewExpense: build.mutation({
      query: expense => ({
        url: pathToApi+'/box_expenses',
        method: 'POST',
        body: {...expense, amount: expense.amount.toString()},
      }),
      invalidatesTags: ['Expense', 'Box'],
    }), // Add new Expense

    getExpenses: build.query({
      query: () => pathToApi+'/box_expenses',
      transformResponse: res => {
        totalExpenses = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member']
        expensesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
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

    getExpensesByPagination: build.query({
      query: page => pathToApi+`/box_expenses?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalExpenses = res['hydra:totalItems']
        expensesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchExpenses: build.query({
      query: keyword => pathToApi+`/box_expenses?reason=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchExpenses = res['hydra:totalItems']
        researchExpensesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchExpensesByPagination: build.query({
      query: search => pathToApi+`/box_expenses?reason=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchExpenses = res['hydra:totalItems']
        researchExpensesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetExpensesByPaginationQuery,
  useLazyGetResearchExpensesQuery,
  useLazyGetResearchExpensesByPaginationQuery,
  useGetExpensesQuery,
  useAddNewExpenseMutation,
} = expenseApiSlice
