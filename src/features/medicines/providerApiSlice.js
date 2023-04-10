import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalProviders = 0
export let totalResearchProviders = 0
export let researchProvidersPages = 1
export let providersPages = 1

export const providerApiSlice = api.injectEndpoints({
  endpoints: build => ({

    addNewProvider: build.mutation({
      query: provider => ({
        url: pathToApi+'/providers',
        method: 'POST',
        body: provider,
      }),
      invalidatesTags: ['Providers']
    }), // add new provider

    updateProvider: build.mutation({
      query: provider => ({
        headers: patchHeaders,
        url: pathToApi+`/providers/${provider.id}`,
        method: 'PATCH',
        body: JSON.stringify({
          wording: provider?.wording,
          focal: provider?.focal,
          tel: provider?.tel,
          email: provider?.email ? provider.email : null,
        }),
      }),
      invalidatesTags: ['Providers']
    }), // update provider

    deleteProvider: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/providers/${id}`,
        headers: patchHeaders,
        method: 'PATCH',
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['Providers']
    }), // delete provider

    handleLoadProvidersOptions: build.query({
      query: keyword => pathToApi+`/providers?wording=${keyword}`,
      transformResponse: res => res['hydra:member']?.map(provider => {
        return {
          id: provider.id,
          label: provider?.wording,
          value: provider['@id'],
          data: provider,
        }
      })
    }), // get providers options

    getProviders: build.query({
      query: () => pathToApi+'/providers',
      transformResponse: res => {
        totalProviders = res['hydra:totalItems']
        providersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        return data.map(provider => {
          if (provider?.createdAt) provider.createdAt = moment(provider.createdAt).calendar()
          return provider
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'Providers', id })), 'Providers']
          : ['Providers']
    }), // list of providers

    getProvidersByPagination: build.query({
      query: page => pathToApi+`/providers?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalProviders = res['hydra:totalItems']
        providersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchProviders: build.query({
      query: keyword => pathToApi+`/providers?wording=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchProviders = res['hydra:totalItems']
        researchProvidersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchProvidersByPagination: build.query({
      query: search => pathToApi+`/providers?wording=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchProviders = res['hydra:totalItems']
        researchProvidersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {

  useLazyGetProvidersByPaginationQuery,
  useLazyGetResearchProvidersQuery,
  useLazyGetResearchProvidersByPaginationQuery,
  useGetProvidersQuery,
  useAddNewProviderMutation,
  useUpdateProviderMutation,
  useDeleteProviderMutation,
  useLazyHandleLoadProvidersOptionsQuery,
} = providerApiSlice
