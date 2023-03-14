import {api, pathToApi} from "../../app/store";
import moment from "moment";

export let totalOrders = 0

export const orderApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getOrders: build.query({
      query: () => pathToApi+`/prescriptions?isPublished=true`,
      transformResponse: res => {
        totalOrders = res['hydra:totalItems']
        const data = res['hydra:member']
        return data?.map(order => {
          if (order?.updatedAt) order.updatedAt = moment(order.updatedAt).calendar()
          return order
        })
      },
      providesTags: result =>
        result ? [...result?.map(({ id }) => ({ type: 'Orders', id })), 'Orders'] : ['Orders'],
    }),

    getSingleOrder: build.query({
      query: id => pathToApi+`/prescriptions/${id}`,
      transformResponse: res => {
        return {...res, updatedAt: res?.updatedAt ? moment(res.updatedAt).calendar() : null}
      },
      providesTags: (result, error, arg) => [{ type: 'SingleOrder', id: arg }]
    }),
  })
})

export const { useGetOrdersQuery, useGetSingleOrderQuery } = orderApiSlice
