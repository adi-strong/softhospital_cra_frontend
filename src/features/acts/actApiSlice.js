import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalActs = 0
export let totalResearchActs = 0
export let researchActsPages = 1
export let actsPages = 1

export const actApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getActs: build.query({
      query: () => pathToApi+'/acts',
      transformResponse: res => {
        totalActs = res['hydra:totalItems']
        actsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'Act', id })), 'Act']
          : ['Act']
    }), // list of acts

    addNewAct: build.mutation({
      query: act => ({
        url: pathToApi+'/acts',
        method: 'POST',
        body: act,
      }),
      invalidatesTags: ['Act']
    }), // add new act

    updateAct: build.mutation({
      query: act => ({
        headers: patchHeaders,
        url: pathToApi+`/acts/${act.id}`,
        method: 'PATCH',
        body: JSON.stringify({
          ...act,
          profitMarge: parseFloat(act?.profitMarge),
          category: act?.category ? act.category?.value : null,
          cost: act?.cost ? act.cost.toString() : '0',
          price: act.price ? act.price.toString() : '0'}),
      }),
      invalidatesTags: ['Act', 'Treatment']

    }), // update act

    deleteAct: build.mutation({
      query: ({ id }) => ({
        headers: patchHeaders,
        url: pathToApi+`/acts/${id}`,
        method: 'PATCH',
        body: JSON.stringify({isDeleted: true}),
      }),
      invalidatesTags: ['Act']
    }), // delete act

    handleLoadActs: build.query({
      query: keyword => pathToApi+`/acts?wording=${keyword}`,
      transformResponse: res => {
        return res['hydra:member']?.map(act => {

          return {
            id: act?.id,
            label: act?.wording,
            value: act['@id'],
          }

        })
      },
    }),

    getActsByPagination: build.query({
      query: page => pathToApi+`/acts?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalActs = res['hydra:totalItems']
        actsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchActs: build.query({
      query: keyword => pathToApi+`/acts?wording=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchActs = res['hydra:totalItems']
        researchActsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchActsByPagination: build.query({
      query: search => pathToApi+`/acts?wording=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchActs = res['hydra:totalItems']
        researchActsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),
  })
})

export const {
  useLazyGetActsByPaginationQuery,
  useLazyGetResearchActsQuery,
  useLazyGetResearchActsByPaginationQuery,
  useGetActsQuery,
  useAddNewActMutation,
  useUpdateActMutation,
  useDeleteActMutation,
  useLazyHandleLoadActsQuery
} = actApiSlice
