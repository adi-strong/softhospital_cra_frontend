import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalConsultations = 0
export let totalResearchConsultations = 0
export let researchConsultationsPages = 1
export let consultationsPages = 1

export const consultationApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getConsultations: build.query({
      query: () => pathToApi+'/consultations',
      transformResponse: res => {
        totalConsultations = res['hydra:totalItems']
        consultationsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        return data.map(consultation => {
          if (consultation?.createdAt) consultation.createdAt = moment(consultation.createdAt).calendar()
          return consultation
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'Consultations', id })), 'Consultations']
          : ['Consultations']
    }), // list of Consultations

    addNewConsultation: build.mutation({
      query: consultation => ({
        url: pathToApi+'/consultations',
        method: 'POST',
        body: {...consultation,
          weight: consultation?.weight.toString(),
          temperature: consultation?.temperature.toString(),
          file: consultation?.file ? consultation.file?.value : null,
          doctor: consultation?.agent ? consultation.agent?.value : null,
          bed: consultation?.bed ? consultation.bed?.value : null,
          hospReleasedAt: consultation?.bed ? consultation?.hospReleasedAt : null,
          patient: consultation?.patient ? consultation.patient?.value : null,
          exams: consultation?.exams ? consultation.exams?.map(exam => exam?.value) : [],
          acts: consultation?.acts ? consultation.acts?.map(act => act?.value) : [],
          treatments: consultation?.treatments ? consultation.treatments?.map(treatment => treatment?.value) : [],
        },
      }),
      invalidatesTags: ['Consultations', 'Lab', 'Nursing', 'Invoices', 'Appointments']
    }), // add new Consultation

    updateConsultation: build.mutation({
      query: consultation => ({
        headers: patchHeaders,
        url: pathToApi+`/consultations/${consultation.id}`,
        method: 'PATCH',
        body: JSON.stringify(consultation?.isPublished ? {...consultation,
          weight: consultation?.weight.toString(),
          temperature: consultation?.temperature.toString(),
          file: consultation?.file ? consultation.file?.value : null,
          doctor: consultation?.agent ? consultation.agent?.value : null,
          bed: consultation?.bed ? consultation.bed?.value : null,
          patient: consultation?.patient ? consultation.patient?.value : null,
          exams: consultation?.exams ? consultation.exams?.map(exam => exam?.value) : [],
          acts: consultation?.acts ? consultation.acts?.map(act => act?.value) : [],
          treatments: consultation?.treatments ? consultation.treatments?.map(treatment => treatment?.value) : [],
        } : {
          comment: consultation?.comment,
          actsItems: consultation?.actsItems,
          diagnostic: consultation?.diagnostic,
          weight: consultation?.weight.toString(),
          temperature: consultation?.temperature.toString(),
          arterialTension: consultation?.arterialTension,
          cardiacFrequency: consultation?.cardiacFrequency,
          respiratoryFrequency: consultation?.respiratoryFrequency,
          oxygenSaturation: consultation?.oxygenSaturation,
        }),
      }),
      invalidatesTags: ['Consultations', 'Lab', 'Nursing', 'Invoices', 'Appointments']

    }), // update Consultation

    updateConsultationTreatmentsDescriptions: build.mutation({
      query: ({ id, treatmentsDescriptions }) => ({
        headers: patchHeaders,
        url: pathToApi+`/consultations/${id}`,
        method: 'PATCH',
        body: JSON.stringify({ treatmentsDescriptions: treatmentsDescriptions }),
      }),
      invalidatesTags: ['Consultations']

    }), // update Consultation

    deleteConsultation: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/consultations/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Consultations']
    }), // delete Consultation

    loadAgentConsultations: build.query({
      query: id => pathToApi+`/agents/${id}/consultations`,
      transformResponse: res => {
        return res['hydra:member']?.map(consultation => {
          if (consultation?.createdAt) consultation.createdAt = moment(consultation.createdAt).calendar()
          return consultation
        })
      },
    }),

    getSingleConsult: build.query({
      query: id => pathToApi+`/consultations/${id}`,
      transformResponse: res => {
        return {...res, createdAt: res?.createdAt ? moment(res.createdAt).calendar() : null}
      },
      providesTags: (result, error, arg) => [{ type: 'SingleConsultation', id: arg }]
    }),

    getConsultationsByPagination: build.query({
      query: page => pathToApi+`/consultations?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalConsultations = res['hydra:totalItems']
        consultationsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(consult => {
          if (consult?.createdAt) consult.createdAt = moment(consult.createdAt).calendar()
          return consult
        })
      },
    }), // pagination list,

    getResearchConsultations: build.query({
      query: keyword => pathToApi+`/consultations?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchConsultations = res['hydra:totalItems']
        researchConsultationsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(consult => {
          if (consult?.createdAt) consult.createdAt = moment(consult.createdAt).calendar()
          return consult
        })
      },
    }),

    getResearchConsultationsByPagination: build.query({
      query: search => pathToApi+`/consultations?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchConsultations = res['hydra:totalItems']
        researchConsultationsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(consult => {
          if (consult?.createdAt) consult.createdAt = moment(consult.createdAt).calendar()
          return consult
        })
      },
    }),
  })
})

export const {
  useUpdateConsultationTreatmentsDescriptionsMutation,
  useLazyGetResearchConsultationsByPaginationQuery,
  useLazyGetResearchConsultationsQuery,
  useLazyGetConsultationsByPaginationQuery,
  useGetConsultationsQuery,
  useAddNewConsultationMutation,
  useUpdateConsultationMutation,
  useDeleteConsultationMutation,
  useLazyLoadAgentConsultationsQuery,
  useGetSingleConsultQuery,
} = consultationApiSlice
