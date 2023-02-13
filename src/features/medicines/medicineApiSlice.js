import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalMedicines = 0

export const medicineApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getMedicines: build.query({
      query: () => pathToApi+'/medicines',
      transformResponse: res => {
        totalMedicines = res['hydra:totalItems']
        const data = res['hydra:member']
        return data.map(medicine => {
          if (medicine?.createdAt)
            medicine.createdAt = moment(medicine.createdAt).calendar()

          return medicine
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'Drugstore', id })), 'Drugstore']
          : ['Drugstore']
    }), // list of medicines

    addNeMedicine: build.mutation({
      query: medicine => ({
        url: pathToApi+'/medicines',
        method: 'POST',
        body: medicine,
      }),
      invalidatesTags: ['Drugstore']
    }), // add new medicine

    updateMedicine: build.mutation({
      query: medicine => ({
        headers: patchHeaders,
        url: pathToApi+`/medicines/${medicine.id}`,
        method: 'PATCH',
        body: JSON.stringify({wording: medicine.wording}),
      }),
      invalidatesTags: ['Drugstore']
    }), // update medicine

    deleteMedicine: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/medicines/${id}`,
        headers: patchHeaders,
        method: 'PATCH',
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['Drugstore']
    }), // delete medicine
  })
})

export const {
  useGetMedicinesQuery,
  useAddNeMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
} = medicineApiSlice
