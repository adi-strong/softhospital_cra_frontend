import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";
import {createEntityAdapter} from "@reduxjs/toolkit";

export let totalTreatments = 0
const treatmentsAdapter = createEntityAdapter()
const initialState = treatmentsAdapter.getInitialState()
export let totalResearchTreatments = 0
export let researchTreatmentsPages = 1
export let treatmentsPages = 1

export const treatmentApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getTreatments: build.query({
      query: () => pathToApi+'/treatments',
      transformResponse: res => {
        totalTreatments = res['hydra:totalItems']
        const data = res['hydra:member']
        treatmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const loadTreatments = data.map(treatment => {
          if (treatment?.createdAt) treatment.createdAt = moment(treatment.createdAt).calendar()
          return treatment
        })
        return treatmentsAdapter.setAll(initialState, loadTreatments)
      },
      providesTags: result => [
        {type: 'Treatment', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'Treatment', id }))
      ]
    }), // list of treatments

    addNewTreatment: build.mutation({
      query: treatment => ({
        url: pathToApi+'/treatments',
        method: 'POST',
        body: {...treatment, price: treatment.price ? treatment.price.toString() : '0'},
      }),
      invalidatesTags: ['Treatment']
    }), // add new treatment

    updateTreatment: build.mutation({
      query: treatment => ({
        headers: patchHeaders,
        url: pathToApi+`/treatments/${treatment.id}`,
        method: 'PATCH',
        body: JSON.stringify(treatment),
      }),
      invalidatesTags: ['Treatment']

    }), // update treatment

    deleteTreatment: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/treatments/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Treatment']
    }), // delete treatment

    handleLoadTreatments: build.query({
      query: keyword => pathToApi+`/treatments?wording=${keyword}`,
      transformResponse: res => {
        return res['hydra:member']?.map(treatment => {

          return {
            id: treatment?.id,
            label: treatment?.wording,
            value: treatment['@id'],
          }

        })
      },
    }),

    getTreatmentsByPagination: build.query({
      query: page => pathToApi+`/treatments?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalTreatments = res['hydra:totalItems']
        treatmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(treatment => {
          if (treatment?.createdAt) treatment.createdAt = moment(treatment.createdAt).calendar()
          return treatment
        })
      },
    }), // pagination list,

    getResearchTreatments: build.query({
      query: keyword => pathToApi+`/treatments?wording=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchTreatments = res['hydra:totalItems']
        researchTreatmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(treatment => {
          if (treatment?.createdAt) treatment.createdAt = moment(treatment.createdAt).calendar()
          return treatment
        })
      },
    }),

    getResearchTreatmentsByPagination: build.query({
      query: search => pathToApi+`/treatments?wording=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchTreatments = res['hydra:totalItems']
        researchTreatmentsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(treatment => {
          if (treatment?.createdAt) treatment.createdAt = moment(treatment.createdAt).calendar()
          return treatment
        })
      },
    }),

  })
})

export const {
  useLazyGetTreatmentsByPaginationQuery,
  useLazyGetResearchTreatmentsQuery,
  useLazyGetResearchTreatmentsByPaginationQuery,
  useLazyHandleLoadTreatmentsQuery,
  useGetTreatmentsQuery,
  useAddNewTreatmentMutation,
  useUpdateTreatmentMutation,
  useDeleteTreatmentMutation,
} = treatmentApiSlice
