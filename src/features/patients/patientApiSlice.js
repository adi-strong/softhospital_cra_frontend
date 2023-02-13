import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalPatients = 0
export let totalCovenantPatients = 0

export const patientApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getPatients: build.query({
      query: () => pathToApi+'/patients',
      transformResponse: res => {
        totalPatients = res['hydra:totalItems']
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
  })
})

export const {
  useGetPatientsQuery,
  useAddNewPatientMutation,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGetSinglePatientQuery,
  useGetCovenantPatientsQuery,
} = patientApiSlice
