import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalLab = 0
export let totalResearchLabs = 0
export let researchLabsPages = 1
export let labsPages = 1

export const labApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getLabItems: build.query({
      query: () => pathToApi+`/labs`,
      transformResponse: res => {
        totalLab = res['hydra:totalItems']
        labsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        const data = res['hydra:member']
        return data?.map(lab => {
          if (lab?.createdAt) lab.createdAt = moment(lab.createdAt).calendar()
          return lab
        })
      },
      providesTags: result =>
        result ? [...result?.map(({ id }) => ({ type: 'Lab', id })), 'Lab'] : ['Lab'],
    }),

    getSingleLab: build.query({
      query: id => pathToApi+`/labs/${id}`,
      transformResponse: res => {
        return {...res, createdAt: res?.createdAt ? moment(res.createdAt).format('ll') : null}
      },
      providesTags: (result, error, arg) => [{ type: 'SingleLab', id: arg }]
    }),

    updateLab: build.mutation({
      query: lab => ({
        headers: patchHeaders,
        method: 'PATCH',
        url: pathToApi+`/labs/${lab?.id}`,
        body: JSON.stringify(lab),
      }),
      invalidatesTags: ['Lab', 'Prescription', 'Consultations']
    }),

    getLabsByPagination: build.query({
      query: page => pathToApi+`/labs?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalLab = res['hydra:totalItems']
        labsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchLabs: build.query({
      query: keyword => pathToApi+`/labs?wording=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchLabs = res['hydra:totalItems']
        researchLabsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchLabsByPagination: build.query({
      query: search => pathToApi+`/labs?wording=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchLabs = res['hydra:totalItems']
        researchLabsPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),
  })
})

export const {
  useLazyGetResearchLabsByPaginationQuery,
  useLazyGetResearchLabsQuery,
  useLazyGetLabsByPaginationQuery,
  useGetLabItemsQuery,
  useGetSingleLabQuery,
  useUpdateLabMutation,
} = labApiSlice
