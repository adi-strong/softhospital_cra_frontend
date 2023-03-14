import {api, pathToApi} from "../../app/store";
import moment from "moment";

export let totalMedicineInvoices = 0

export const medicineInvoiceApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getMedicineInvoices: build.query({
      query: () => pathToApi+`/medicine_invoices`,
      transformResponse: res => {
        totalMedicineInvoices = res['hydra:totalItems']
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

    getSingleMedicineInvoice: build.query({
      query: id => pathToApi+`/medicine_invoices/${id}`,
      transformResponse: res => {
        return { ...res, released: res?.released ? moment(res.released).format('D MMM YY'): null,}
      },
      providesTags: (result, error, arg) => [{type: 'SingleMedicineInvoice', id: parseInt(arg)}]
    })
  })
})

export const { useGetMedicineInvoicesQuery, useGetSingleMedicineInvoiceQuery } = medicineInvoiceApiSlice
