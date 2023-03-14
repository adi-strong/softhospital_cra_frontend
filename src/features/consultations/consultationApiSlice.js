import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalConsultations = 0

export const consultationApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getConsultations: build.query({
      query: () => pathToApi+'/consultations',
      transformResponse: res => {
        totalConsultations = res['hydra:totalItems']
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
        body: JSON.stringify({...consultation,
          weight: consultation?.weight.toString(),
          temperature: consultation?.temperature.toString(),
          file: consultation?.file ? consultation.file?.value : null,
          doctor: consultation?.agent ? consultation.agent?.value : null,
          bed: consultation?.bed ? consultation.bed?.value : null,
          patient: consultation?.patient ? consultation.patient?.value : null,
          exams: consultation?.exams ? consultation.exams?.map(exam => exam?.value) : [],
          acts: consultation?.acts ? consultation.acts?.map(act => act?.value) : [],
          treatments: consultation?.treatments ? consultation.treatments?.map(treatment => treatment?.value) : [],
        }),
      }),
      invalidatesTags: ['Consultations', 'Lab', 'Nursing', 'Invoices', 'Appointments']

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
  })
})

export const {
  useGetConsultationsQuery,
  useAddNewConsultationMutation,
  useUpdateConsultationMutation,
  useDeleteConsultationMutation,
  useLazyLoadAgentConsultationsQuery,
  useGetSingleConsultQuery,
} = consultationApiSlice