import {api, patchHeaders, pathToApi} from "../../app/store";
import {createEntityAdapter} from "@reduxjs/toolkit";
import moment from "moment";

export let totalParameters = 0
const parametersAdapter = createEntityAdapter()
const initialState = parametersAdapter.getInitialState()

export const parametersApiSlice = api.injectEndpoints({
  endpoints: build => ({
    addNewParameters: build.mutation({
      query: parameters => ({
        url: pathToApi+'/parameters',
        method: 'POST',
        body: {...parameters,
          currency: parameters?.currency ? parameters.currency.value : null,
          secondCurrency: parameters?.secondCurrency ? parameters.secondCurrency.value : null,
          rate: parameters?.rate && !isNaN(parameters?.rate) ? parseFloat(parameters.rate).toString() : null,
          name: parameters?.currency ? parameters.currency.label : null,
          code: parameters?.currency ? parameters.currency.code : null,
          secondCode: parameters?.secondCurrency ? parameters.secondCurrency.code : null}
      }),
      invalidatesTags: ['Parameters'],
    }), // Add new Parameters

    getParameters: build.query({
      query: () => pathToApi+'/parameters',
      transformResponse: res => {
        totalParameters = parseInt(res['hydra:totalItems'])
        const data = res['hydra:member'] ? res['hydra:member'] : []
        const loadParameters = data?.map(item => {
          if (item?.createdAt) item.createdAt = moment(item.createdAt).calendar()
          if (item?.updatedAt) item.updatedAt = moment(item.updatedAt).calendar()
          return item
        })
        return parametersAdapter.setAll(initialState, loadParameters)
      },
      // Parameters
      providesTags: result => [
        { type: 'Parameters', id: 'LIST' },
        ...result.ids.map(id => ({ type: 'Parameters', id }))
      ]
    }), // Get Parameters

    updateHospital: build.mutation({
      query: hospital => ({
        headers: patchHeaders,
        url: pathToApi+`/hospitals/${hospital.id}`,
        method: 'PATCH',
        body: JSON.stringify({...hospital, logo: hospital?.logo ? hospital.logo.id : null})
      }),
      invalidatesTags: ['Parameters']
    }), // Update Hospital
  })
})

export const {
  useUpdateHospitalMutation,
  useAddNewParametersMutation,
  useGetParametersQuery,
} = parametersApiSlice
