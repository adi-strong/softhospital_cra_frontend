import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalServices = 0
const servicesAdapter = createEntityAdapter()
const initialState = servicesAdapter.getInitialState()

export const serviceApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getServices: build.query({
      query: () => pathToApi+'/services',
      transformResponse: res => {
        totalServices = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        const loadServices = data.map(service => {
          if (service?.createdAt) service.createdAt = moment(service.createdAt).calendar()
          return service
        })
        return servicesAdapter.setAll(initialState, loadServices)
      },
      providesTags: result => [
        { type: 'Services', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'Services', id }))
      ]
    }), // Get List of Services

    addNewService: build.mutation({
      query: service => ({
        url: pathToApi+'/services',
        method: 'POST',
        body: service,
      }),
      invalidatesTags: ['Services'],
    }), // Add new Service

    updateService: build.mutation({
      query: service => ({
        headers: patchHeaders,
        url: pathToApi+`/services/${service.id}`,
        method: 'PATCH',
        body: JSON.stringify(service),
      }),
      invalidatesTags: ['Services'],
    }), // Update Service

    deleteService: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/services/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Services', 'Agents']
    }), // Delete Service

    getServicesOptions: build.query({
      query: id => pathToApi+`/departments/${id}/services`
    }) // Get Service Options
  })
})

export const {
  useGetServicesQuery,
  useLazyGetServicesOptionsQuery,
  useAddNewServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApiSlice
