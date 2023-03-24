import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalPatients = 0
export let totalResearchPatients = 0
export let researchPatientsPages = 1
export let patientsPages = 1
export let totalCovenantPatients = 0

export const patientApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getPatients: build.query({
      query: () => pathToApi+'/patients',
      transformResponse: res => {
        totalPatients = res['hydra:totalItems']
        patientsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        return data?.map(patient => {
          if (patient?.createdAt) patient.createdAt = moment(patient.createdAt).calendar()
          return patient
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'Patient', id })), 'Patient']
          : ['Patient']
    }), // list of patients

    getPatientsByPagination: build.query({
      query: page => pathToApi+`/patients?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalPatients = res['hydra:totalItems']
        patientsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(patient => {
          if (patient?.createdAt) patient.createdAt = moment(patient.createdAt).calendar()
          return patient
        })
      },
    }), // pagination list,

    addNewPatient: build.mutation({
      query: patient => ({
        url: pathToApi+'/patients',
        method: 'POST',
        body: patient,
      }),
      invalidatesTags: ['Patient']
    }), // add new patient

    updatePatient: build.mutation({
      query: patient => ({
        headers: patchHeaders,
        url: pathToApi+`/patients/${patient.id}`,
        method: 'PATCH',
        body: JSON.stringify({...patient,
          profile: patient?.profile
            ? patient.profile['@id']
              ? patient.profile['@id']
              : patient.profile.id
            : null
        }),
      }),
      transformResponse: (res, meta, arg) => {
        return {
          ...res,
          createdAt: res?.createdAt
            ? moment(res.createdAt).calendar()
            : null
        }
      },
      invalidatesTags: (result, error, arg) => ['Patient'],
    }), // update patient

    deletePatient: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/patients/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Patient']
    }), // delete patient

    getSinglePatient: build.query({
      query: id => pathToApi+`/patients/${id}`,
      transformResponse: res => {
        return {...res, createdAt: res?.createdAt ? moment(res.createdAt).calendar() : null}
      },
      providesTags: (result, error, arg) => [{type: 'SinglePatient', id: parseInt(arg)}]
    }), // get single patient

    getCovenantPatients: build.query({
      query: id => pathToApi+`/covenant/${id}/patients`,
      transformResponse: res => {
        totalCovenantPatients = res['hydra:totalItems']
        return res['hydra:member']?.map(patient => {
          if (patient?.createdAt) patient.createdAt = moment(patient.createdAt).calendar()
          return patient
        })
      },
      providesTags: (result, error, arg) => [{type: 'CovenantPatients', id: arg}]
    }), // covenant's patients

    handleLoadPatients: build.query({
      query: keyword => pathToApi+`/patients?fullName=${keyword}`,
      transformResponse: res => {
        return res['hydra:member']?.map(patient => {
          const name = patient?.name
          const lastName = patient?.lastName ? patient.lastName : ''
          const firstName = patient?.firstName ? patient.firstName : ''

          const label = `${name} ${lastName} ${firstName}`

          return {
            label,
            value: patient['@id'],
            id: patient?.id,
            data: patient,
          }

        })
      },
    }),

    getResearchPatients: build.query({
      query: keyword => pathToApi+`/patients?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchPatients = res['hydra:totalItems']
        researchPatientsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(patient => {
          if (patient?.createdAt) patient.createdAt = moment(patient.createdAt).calendar()
          return patient
        })
      },
    }),

    getResearchPatientsByPagination: build.query({
      query: search => pathToApi+`/patients?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchPatients = res['hydra:totalItems']
        researchPatientsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(patient => {
          if (patient?.createdAt) patient.createdAt = moment(patient.createdAt).calendar()
          return patient
        })
      },
    }),

  })
})

export const {
  useGetPatientsQuery,
  useAddNewPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGetSinglePatientQuery,
  useGetCovenantPatientsQuery,
  useLazyHandleLoadPatientsQuery,
  useLazyGetPatientsByPaginationQuery,
  useLazyGetResearchPatientsQuery,
  useLazyGetResearchPatientsByPaginationQuery,
} = patientApiSlice
