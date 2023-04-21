import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalPrescriptions = 0
export let totalResearchPrescriptions = 0
export let researchPrescriptionsPages = 1
export let prescriptionsPages = 1

export const prescriptionApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getPrescriptions: build.query({
      query: () => pathToApi+`/prescriptions?isPublished=false`,
      transformResponse: res => {
        totalPrescriptions = res['hydra:totalItems']
        prescriptionsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        return data?.map(prescription => {
          if (prescription?.updatedAt) prescription.updatedAt = moment(prescription.updatedAt).calendar()
          return prescription
        })
      },
      providesTags: result =>
        result ? [...result?.map(({ id }) => ({ type: 'Prescription', id })), 'Prescription'] : ['Prescription'],
    }),

    getSinglePrescription: build.query({
      query: id => pathToApi+`/prescriptions/${id}`,
      transformResponse: res => {
        return {...res,
          date: res?.updatedAt ? moment(res.updatedAt).format('ll') : null,
          updatedAt: res?.updatedAt ? moment(res.updatedAt).calendar() : null}
      },
      providesTags: (result, error, arg) => [{ type: 'SinglePrescription', id: arg }]
    }),

    updatePrescription: build.mutation({
      query: prescription => ({
        headers: patchHeaders,
        method: 'PATCH',
        url: pathToApi+`/prescriptions/${prescription?.id}`,
        body: JSON.stringify(prescription),
      }),
      invalidatesTags: (result, error, arg) => [
        'Prescription',
        'Orders',
        { type: 'SinglePrescription', id: arg }]
    }),

    getPrescriptionsByPagination: build.query({
      query: page => pathToApi+`/prescriptions?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalPrescriptions = res['hydra:totalItems']
        prescriptionsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchPrescriptions: build.query({
      query: keyword => pathToApi+`/prescriptions?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchPrescriptions = res['hydra:totalItems']
        researchPrescriptionsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchPrescriptionsByPagination: build.query({
      query: search => pathToApi+`/prescriptions?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchPrescriptions = res['hydra:totalItems']
        researchPrescriptionsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),
  })
})

export const {
  useLazyGetPrescriptionsByPaginationQuery,
  useLazyGetResearchPrescriptionsQuery,
  useLazyGetResearchPrescriptionsByPaginationQuery,
  useGetPrescriptionsQuery,
  useGetSinglePrescriptionQuery,
  useUpdatePrescriptionMutation,
} = prescriptionApiSlice
