import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalLab = 0

export const labApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getLabItems: build.query({
      query: () => pathToApi+`/labs`,
      transformResponse: res => {
        totalLab = res['hydra:totalItems']
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
        return {...res, createdAt: res?.createdAt ? moment(res.createdAt).calendar() : null}
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
  })
})

export const {
  useGetLabItemsQuery,
  useGetSingleLabQuery,
  useUpdateLabMutation,
} = labApiSlice
