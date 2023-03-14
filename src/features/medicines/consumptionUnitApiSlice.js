import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalConsumptionUnits = 0

export const consumptionUnitApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getConsumptionUnits: build.query({
      query: () => pathToApi+'/consumption_units',
      transformResponse: res => {
        totalConsumptionUnits = res['hydra:totalItems']
        const data = res['hydra:member']
        return data.map(consumptionUnit => {
          if (consumptionUnit?.createdAt) consumptionUnit.createdAt = moment(consumptionUnit.createdAt).calendar()
          return consumptionUnit
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'ConsumptionUnits', id })), 'ConsumptionUnits']
          : ['ConsumptionUnits']
    }), // list of consumption units

    addNewConsumptionUnit: build.mutation({
      query: consumptionUnit => ({
        url: pathToApi+'/consumption_units',
        method: 'POST',
        body: consumptionUnit,
      }),
      invalidatesTags: ['ConsumptionUnits']
    }), // add new consumption unit

    updateConsumptionUnit: build.mutation({
      query: consumptionUnit => ({
        headers: patchHeaders,
        url: pathToApi+`/consumption_units/${consumptionUnit.id}`,
        method: 'PATCH',
        body: JSON.stringify({wording: consumptionUnit.wording}),
      }),
      invalidatesTags: ['ConsumptionUnits', 'Drugstore']
    }), // update consumption unit

    deleteConsumptionUnit: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/consumption_units/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['ConsumptionUnits', 'Drugstore']
    }), // delete consumption unit

    handleGetConsumptionUnitsOptions: build.query({
      query: keyword => pathToApi+`/consumption_units?wording=${keyword}`,
      transformResponse: res => {
        totalConsumptionUnits = res['hydra:totalItems']
        const data = res['hydra:member']
        return data.map(consumptionUnit => {
          return {
            id: consumptionUnit.id,
            label: consumptionUnit.wording,
            value: consumptionUnit['@id'],
          }
        })
      },
    })
  })
})

export const {
  useGetConsumptionUnitsQuery,
  useAddNewConsumptionUnitMutation,
  useUpdateConsumptionUnitMutation,
  useDeleteConsumptionUnitMutation,
  useLazyHandleGetConsumptionUnitsOptionsQuery,
} = consumptionUnitApiSlice
