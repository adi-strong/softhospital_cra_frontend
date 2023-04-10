import {api, pathToApi} from "../../app/store";
import moment from "moment";

export let totalMedicineInvoices = 0
export let medicineInvoicesPages = 1

export const medicineInvoiceApiSlice = api.injectEndpoints({
  endpoints: build => ({

    getSingleMedicineInvoice: build.query({
      query: id => pathToApi+`/medicine_invoices/${id}`,
      transformResponse: res => {
        return { ...res, released: res?.released ? moment(res.released).format('D MMM YY'): null,}
      },
      providesTags: (result, error, arg) => [{type: 'SingleMedicineInvoice', id: parseInt(arg)}]
    }),

    getMedicineInvoices: build.query({
      query: () => pathToApi+`/medicine_invoices`,
      transformResponse: res => {
        totalMedicineInvoices = res['hydra:totalItems']
        medicineInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(invoice => {
          if (invoice?.release) invoice.release = moment(invoice.release).calendar()
          return invoice
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'MedicineInvoices', id })), 'MedicineInvoices']
          : ['MedicineInvoices']
    }),

    getMedicineInvoicesByPagination: build.query({
      query: page => pathToApi+`/medicine_invoices?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalMedicineInvoices = res['hydra:totalItems']
        medicineInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.release) act.release = moment(act.release).calendar()
          return act
        })
      },
    }), // pagination list,

  })
})

export const {
  useLazyGetMedicineInvoicesByPaginationQuery,
  useGetMedicineInvoicesQuery,
  useGetSingleMedicineInvoiceQuery } = medicineInvoiceApiSlice
