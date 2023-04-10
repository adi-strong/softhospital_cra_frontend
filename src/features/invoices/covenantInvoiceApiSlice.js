import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalCovenantInvoices = 0
export let covenantInvoicesPages = 1

export const covenantInvoiceApiSlice = api.injectEndpoints({
  endpoints: build => ({

    getSearchCovenantsInvoice: build.query({
      query: ({ year, month, covenantId }) => pathToApi+`/get_covenant_invoices/${year}/${month}/${covenantId}`,
      transformResponse: res => res,
    }),

    addNewCovenantInvoice: build.mutation({
      query: invoice => ({
        url: pathToApi+'/covenant_invoices',
        method: 'POST',
        body: {...invoice,
          currency: invoice?.currency,
          subTotal: invoice?.subTotal.toString(),
          year: parseInt(invoice?.year),
          month: invoice?.month,
          filesPrice: invoice?.filesPrice.toString(),
          totalActsBaskets: invoice?.totalActsBaskets.toString(),
          totalExamsBaskets: invoice?.totalExamsBaskets.toString(),
          totalNursingPrice: invoice?.totalNursingPrice.toString(),
          hospPrice: invoice?.hospPrice.toString()},
      }),
    }), // add new

    updateCovenantInvoice: build.mutation({
      query: invoice => ({
        headers: patchHeaders,
        url: pathToApi+`/covenant_invoices/${invoice.id}`,
        method: 'PATCH',
        body: JSON.stringify(!invoice?.isPublished
          ? {...invoice,
            discount: invoice?.check1 ? parseFloat(invoice?.discount) : null,
            vTA: invoice?.check2 ? parseFloat(invoice?.vTA) : null,
            isComplete: invoice?.isComplete,
            amount: invoice?.amount.toString(),
            totalAmount: invoice?.totalAmount.toString(),
            sum: invoice?.sum.toString(),
            isPublished: true,}
          : {
            isComplete: invoice?.isComplete,
            sum: invoice?.sum.toString(),}),
      }),
      invalidatesTags: (result, error, arg) => [
        {type: 'SingleCovenantInvoicesList', id: arg},
        'Box',
      ]
    }),

    getCovenantInvoices: build.query({
      query: id => pathToApi+`/covenants/${id}/covenant_invoices`,
      transformResponse: res => {
        totalCovenantInvoices = res['hydra:totalItems']
        covenantInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return res['hydra:member']?.map(invoice => {
          const date = invoice?.releasedAt ? invoice.releasedAt : null
          if (invoice?.releasedAt) invoice.releasedAt = moment(invoice.releasedAt).calendar()
          return {...invoice, date}
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'SingleCovenantInvoicesList', id })), 'SingleCovenantInvoicesList']
          : ['SingleCovenantInvoicesList']
    }),

    getCovenantInvoicesByPagination: build.query({
      query: ({ id, page }) => pathToApi+`/covenants/${id}/covenant_invoices?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalCovenantInvoices = res['hydra:totalItems']
        covenantInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.releasedAt) act.releasedAt = moment(act.releasedAt).calendar()
          return act
        })
      },
    }), // pagination list,

  })
})

export const {
  useLazyGetCovenantInvoicesByPaginationQuery,
  useUpdateCovenantInvoiceMutation,
  useAddNewCovenantInvoiceMutation,
  useLazyGetSearchCovenantsInvoiceQuery,
  useGetCovenantInvoicesQuery,
} = covenantInvoiceApiSlice
