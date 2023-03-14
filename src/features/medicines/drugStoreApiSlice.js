import {api, pathToApi} from "../../app/store";

export let totalDrugstoreList = 0

export const drugStoreApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getDrugstoreList: build.query({
      query: () => pathToApi+'/medicines',
      transformResponse: res => {
        totalDrugstoreList = res['hydra:totalItems']
        return res['hydra:member']?.map(medicine => medicine)
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'DrugstoreList', id })), 'DrugstoreList']
          : ['DrugstoreList']
    }),

    onSupplyingDrugInStore: build.mutation({
      query: drugs => ({
        url: pathToApi+`/drugstore_supplies`,
        method: 'POST',
        body: {
          document: drugs[0].document,
          released: drugs[0].released,
          provider: drugs[0].provider?.value,
          values: drugs?.values,
          amount: drugs?.amount.toString(),
        }
      }),
      invalidatesTags: ['Drugstore', 'DrugstoreList', 'DrugstoreInvoices', 'Box']
    }),
  })
})

export const {
  useGetDrugstoreListQuery,
  useOnSupplyingDrugInStoreMutation,
} = drugStoreApiSlice
