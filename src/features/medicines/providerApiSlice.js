import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalProviders = 0

export const providerApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getProviders: build.query({
      query: () => pathToApi+'/providers',
      transformResponse: res => {
        totalProviders = res['hydra:totalItems']
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
  })
})

export const {
  useGetProvidersQuery,
  useAddNewProviderMutation,
  useUpdateProviderMutation,
  useDeleteProviderMutation,
  useLazyHandleLoadProvidersOptionsQuery,
} = providerApiSlice
