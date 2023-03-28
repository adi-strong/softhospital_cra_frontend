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
        return data?.map(nursing => { return nursing })
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

    /*
    sum: 0.00,
    subTotal: parseFloat(data?.subTotal),
    totalAmount: parseFloat(data?.totalAmount),
    isCompleted: false,
    discount: 5,
    isPayed: true,
    check: false,
   */
    updateNursing: build.mutation({
      query: nursing => ({
        headers: patchHeaders,
        method: 'PATCH',
        url: pathToApi+`/nursings/${nursing?.id}`,
        body: JSON.stringify(nursing),
        /*body: JSON.stringify(!nursing.isPayed2 ? {
          sum: nursing.sum.toString(),
            subTotal: nursing.subTotal.toString(),
            totalAmount: nursing.totalAmount.toString(),
            isCompleted: nursing.isCompleted,
            discount: nursing.check ? parseFloat(nursing.discount) : null,
            isPayed: nursing.isPayed}
          : {
          sum: nursing.sum.toString(),
            isCompleted: nursing.isCompleted})*/
      }),
      invalidatesTags: (result, error, arg) => ['Nursing', 'Box', { type: 'SingleNursing', id: arg }]
    }),
  })
})

export const {
  useGetNursingsQuery,
  useGetSingleNursingQuery,
  useUpdateNursingMutation,
} = nursingApiSlice
