import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalExams = 0
const examsAdapter = createEntityAdapter()
const initialState = examsAdapter.getInitialState()

export const examApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getExams: build.query({
      query: () => pathToApi+'/exams',
      transformResponse: res => {
        totalExams = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadExams = data.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
        return examsAdapter.setAll(initialState, loadExams)
      },
      providesTags: result => [
        {type: 'Exam', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Exam', id }))
      ]
    }), // list of exams

    addNewExam: build.mutation({
      query: exam => ({
        url: pathToApi+'/exams',
        method: 'POST',
        body: {...exam, price: exam.price ? exam.price.toString() : '0'},
      }),
      invalidatesTags: ['Exam']
    }), // add new exam

    updateExam: build.mutation({
      query: exam => ({
        headers: patchHeaders,
        url: pathToApi+`/exams/${exam.id}`,
        method: 'PATCH',
        body: JSON.stringify(exam),
      }),
      invalidatesTags: ['Exam']

    }), // update exam

    deleteExam: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/exams/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Exam']
    }), // delete exam
  })
})

export const {
  useGetExamsQuery,
  useAddNewExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
} = examApiSlice
