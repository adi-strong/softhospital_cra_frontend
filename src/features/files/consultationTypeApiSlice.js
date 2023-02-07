import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalConsultationTypes = 0
const consultationTypesAdapter = createEntityAdapter()
const initialState = consultationTypesAdapter.getInitialState()

export const consultationTypeApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getConsultationTypes: build.query({
      query: () => pathToApi+'/consultations_types',
      transformResponse: res => {
        totalConsultationTypes = res['hydra:totalItems']
        const data = res['hydra:member']
        const loadConsultationsTypes = data.map(type => {
          if (type?.createdAt) type.createdAt = moment(type.createdAt).calendar()
          return type
        })
        return consultationTypesAdapter.setAll(initialState, loadConsultationsTypes)
      },
      providesTags: result => [
        {type: 'ConsultationType', id: 'LIST'},
        ...result.ids.map(id => ({ type: 'ConsultationType', id }))
      ]
    }), // list of consultation's types

    addNewConsultationType: build.mutation({
      query: type => ({
        url: pathToApi+'/consultations_types',
        method: 'POST',
        body: {...type, price: type.price ? type.price.toString() : '0'},
      }),
      invalidatesTags: ['ConsultationType']
    }), // add new consultation's types

    updateConsultationType: build.mutation({
      query: type => ({
        headers: patchHeaders,
        url: pathToApi+`/consultations_types/${type.id}`,
        method: 'PATCH',
        body: JSON.stringify(type),
      }),
      invalidatesTags: ['ConsultationType']
    }), // update consultation's types

    deleteConsultationType: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/consultations_types/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['ConsultationType']
    }), // delete consultation's types
  })
})

export const {
  useGetConsultationTypesQuery,
  useDeleteConsultationTypeMutation,
  useAddNewConsultationTypeMutation,
  useUpdateConsultationTypeMutation,
} = consultationTypeApiSlice
