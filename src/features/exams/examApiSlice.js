import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalExams = 0
export let totalResearchExams = 0
export let researchExamsPages = 1
export let examsPages = 1

export const examApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getExams: build.query({
      query: () => pathToApi+'/exams',
      transformResponse: res => {
        totalExams = res['hydra:totalItems']
        examsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(exam => {
          if (exam?.createdAt) exam.createdAt = moment(exam.createdAt).calendar()
          return exam
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'Exam', id })), 'Exam']
          : ['Exam']
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

    handleLoadExams: build.query({
      query: keyword => pathToApi+`/exams?wording=${keyword}`,
      transformResponse: res => {
        return res['hydra:member']?.map(exam => {

          return {
            id: exam?.id,
            label: exam?.wording,
            value: exam['@id'],
          }

        })
      },
    }),

    getExamsByPagination: build.query({
      query: page => pathToApi+`/exams?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalExams = res['hydra:totalItems']
        examsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(exam => {
          if (exam?.createdAt) exam.createdAt = moment(exam.createdAt).calendar()
          return exam
        })
      },
    }), // pagination list,

    getResearchExams: build.query({
      query: keyword => pathToApi+`/exams?wording=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchExams = res['hydra:totalItems']
        researchExamsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(exam => {
          if (exam?.createdAt) exam.createdAt = moment(exam.createdAt).calendar()
          return exam
        })
      },
    }),

    getResearchExamsByPagination: build.query({
      query: search => pathToApi+`/exams?wording=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchExams = res['hydra:totalItems']
        researchExamsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(exam => {
          if (exam?.createdAt) exam.createdAt = moment(exam.createdAt).calendar()
          return exam
        })
      },
    }),

  })
})

export const {
  useLazyGetExamsByPaginationQuery,
  useLazyGetResearchExamsQuery,
  useLazyGetResearchExamsByPaginationQuery,
  useGetExamsQuery,
  useAddNewExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation,
  useLazyHandleLoadExamsQuery,
} = examApiSlice
