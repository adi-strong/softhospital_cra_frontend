import {api, pathToApi} from "../../app/store";
import moment from "moment";

export let totalOrders = 0
export let totalResearchOrders = 0
export let researchOrdersPages = 1
export let ordersPages = 1

export const orderApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getOrders: build.query({
      query: () => pathToApi+`/prescriptions?isPublished=true`,
      transformResponse: res => {
        totalOrders = res['hydra:totalItems']
        ordersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
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

    getOrdersByPagination: build.query({
      query: page => pathToApi+`/prescriptions?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalOrders = res['hydra:totalItems']
        ordersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchOrders: build.query({
      query: keyword => pathToApi+`/prescriptions?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchOrders = res['hydra:totalItems']
        researchOrdersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchOrdersByPagination: build.query({
      query: search => pathToApi+`/prescriptions?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchOrders = res['hydra:totalItems']
        researchOrdersPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),
  })
})

export const {
  useLazyGetOrdersByPaginationQuery,
  useLazyGetResearchOrdersQuery,
  useLazyGetResearchOrdersByPaginationQuery,
  useGetOrdersQuery,
  useGetSingleOrderQuery
} = orderApiSlice
