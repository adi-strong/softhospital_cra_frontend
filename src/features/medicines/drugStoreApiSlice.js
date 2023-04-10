import {api, pathToApi} from "../../app/store";
import moment from "moment";

export let totalDrugstoreList = 0
export let totalResearchDrugstore = 0
export let researchDrugstorePages = 1
export let drugstorePages = 1

export let totalSupplyMedicineInvoices = 0
export let supplyMedicineInvoicesPages = 1

export const drugStoreApiSlice = api.injectEndpoints({
  endpoints: build => ({

    onSupplyingDrugInStore: build.mutation({
      query: drugs => ({
        url: pathToApi+`/drugstore_supplies`,
        method: 'POST',
        body: drugs,
      }),
      invalidatesTags: ['Drugstore', 'DrugstoreList', 'DrugstoreInvoices', 'Box']
    }),

    supplyInvoicesList: build.query({
      query: () => pathToApi+`/drugstore_supplies`,
      transformResponse: res => {
        totalSupplyMedicineInvoices = res['hydra:totalItems']
        supplyMedicineInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(invoice => {
          if (invoice?.released) invoice.released = moment(invoice.released).calendar()
          return invoice
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'SupplyInvoices', id })), 'SupplyInvoices']
          : ['SupplyInvoices']
    }),

    getSupplyMedicineInvoicesByPagination: build.query({
      query: page => pathToApi+`/drugstore_supplies?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalSupplyMedicineInvoices = res['hydra:totalItems']
        supplyMedicineInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.release) act.released = moment(act.released).calendar()
          return act
        })
      },
    }), // pagination list,

    getSingleSupplyMedicineInvoice: build.query({
      query: id => pathToApi+`/drugstore_supplies/${id}`,
      transformResponse: res => {
        if (res?.released) res.released = moment(res.released).format('ll')
        return res
      },
      providesTags: (result, error, arg) => [{ type: 'SingleSupplyInvoice', id: arg }]
    }),

    getDrugstoreList: build.query({
      query: () => pathToApi+'/medicines',
      transformResponse: res => {
        totalDrugstoreList = res['hydra:totalItems']
        drugstorePages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(medicine => medicine)
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'DrugstoreList', id })), 'DrugstoreList']
          : ['DrugstoreList']
    }),

    getDrugstoreByPagination: build.query({
      query: page => pathToApi+`/medicines?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalDrugstoreList = res['hydra:totalItems']
        drugstorePages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchDrugstore: build.query({
      query: keyword => pathToApi+`/medicines?wording=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchDrugstore = res['hydra:totalItems']
        researchDrugstorePages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchDrugstoreByPagination: build.query({
      query: search => pathToApi+`/medicines?wording=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchDrugstore = res['hydra:totalItems']
        researchDrugstorePages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetDrugstoreByPaginationQuery,
  useLazyGetResearchDrugstoreQuery,
  useLazyGetResearchDrugstoreByPaginationQuery,
  useGetSingleSupplyMedicineInvoiceQuery,
  useLazyGetSupplyMedicineInvoicesByPaginationQuery,
  useSupplyInvoicesListQuery,
  useGetDrugstoreListQuery,
  useOnSupplyingDrugInStoreMutation,
} = drugStoreApiSlice
