import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalInvoices = 0

export const invoiceApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getInvoices: build.query({
      query: () => pathToApi+'/invoices',
      transformResponse: res => {
        totalInvoices = res['hydra:totalItems']
        return res['hydra:member']?.map(invoice => {
          if (invoice?.releasedAt) invoice.releasedAt = moment(invoice.releasedAt).calendar()
          if (invoice?.updatedAt) invoice.updatedAt = moment(invoice.updatedAt).calendar()
          return invoice
        })
      },
      providesTags: result => result
        ? [...result?.map(({ id }) => ({ type: 'Invoices', id })), 'Invoices']
        :['Invoices']
    }),

    getSingleInvoice: build.query({
      query: id => pathToApi+`/invoices/${id}`,
      transformResponse: res => {
        return { ...res,
          releasedAt: res?.releasedAt ? moment(res.releasedAt).calendar() : null,
          updatedAt: res?.updatedAt ? moment(res.updatedAt).calendar() : null,
        }
      },
      providesTags: (result, error, arg) => [{ type: 'SingleInvoice', id: arg }]
    }),

    updateInvoice: build.mutation({
      query: invoice => ({
        headers: patchHeaders,
        url: pathToApi+`/invoices/${invoice.id}`,
        method: 'PATCH',
        body: JSON.stringify(invoice),
      }),
      invalidatesTags: ['Invoices', 'Consultations', 'Box']
    }),
  })
})

export const {
  useGetInvoicesQuery,
  useGetSingleInvoiceQuery,
  useUpdateInvoiceMutation,
} = invoiceApiSlice