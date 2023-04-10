import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalServices = 0
const servicesAdapter = createEntityAdapter()
const initialState = servicesAdapter.getInitialState()

export let totalResearchServices = 0
export let researchServicesPages = 1
export let servicesPages = 1

export const serviceApiSlice = api.injectEndpoints({
  endpoints: build => ({

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
    }), // Get Service Options

    getServices: build.query({
      query: () => pathToApi+'/services',
      transformResponse: res => {
        totalServices = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        servicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
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

    getServicesByPagination: build.query({
      query: page => pathToApi+`/services?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalServices = res['hydra:totalItems']
        servicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchServices: build.query({
      query: keyword => pathToApi+`/services?name=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchServices = res['hydra:totalItems']
        researchServicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchServicesByPagination: build.query({
      query: search => pathToApi+`/services?name=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchServices = res['hydra:totalItems']
        researchServicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetServicesByPaginationQuery,
  useLazyGetResearchServicesQuery,
  useLazyGetResearchServicesByPaginationQuery,
  useGetServicesQuery,
  useLazyGetServicesOptionsQuery,
  useAddNewServiceMutation,
  useUpdateServiceMutation,
  useDeleteServiceMutation,
} = serviceApiSlice
