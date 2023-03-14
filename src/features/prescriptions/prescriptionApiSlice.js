import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalPrescriptions = 0

export const prescriptionApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getPrescriptions: build.query({
      query: () => pathToApi+`/prescriptions?isPublished=false`,
      transformResponse: res => {
        totalPrescriptions = res['hydra:totalItems']
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
        return {...res, updatedAt: res?.updatedAt ? moment(res.updatedAt).calendar() : null}
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
  })
})

export const {
  useGetPrescriptionsQuery,
  useGetSinglePrescriptionQuery,
  useUpdatePrescriptionMutation,
} = prescriptionApiSlice
