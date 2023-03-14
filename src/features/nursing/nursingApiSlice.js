import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalNursing = 0

export const nursingApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getNursings: build.query({
      query: () => pathToApi+`/nursings`,
      transformResponse: res => {
        totalNursing = res['hydra:totalItems']
        const data = res['hydra:member']
        return data?.map(nursing => {
          if (nursing?.createdAt) nursing.createdAt = moment(nursing.createdAt).calendar()
          return nursing
        })
      },
      providesTags: result =>
        result ? [...result?.map(({ id }) => ({ type: 'Nursing', id })), 'Nursing'] : ['Nursing'],
    }),

    getSingleNursing: build.query({
      query: id => pathToApi+`/nursings/${id}`,
      transformResponse: res => {
        return {...res, createdAt: res?.createdAt ? moment(res.createdAt).calendar() : null}
      },
      providesTags: (result, error, arg) => [{ type: 'SingleNursing', id: arg }]
    }),

    updateNursing: build.mutation({
      query: nursing => ({
        headers: patchHeaders,
        method: 'PATCH',
        url: pathToApi+`/nursings/${nursing?.id}`,
        body: JSON.stringify(nursing),
      }),
      invalidatesTags: (result, error, arg) => ['Nursing', { type: 'SingleNursing', id: arg }]
    }),
  })
})

export const {
  useGetNursingsQuery,
  useGetSingleNursingQuery,
  useUpdateNursingMutation,
} = nursingApiSlice
