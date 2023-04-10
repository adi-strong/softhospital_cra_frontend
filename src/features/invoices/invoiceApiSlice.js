import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalInvoices = 0
export let totalResearchInvoices = 0
export let researchInvoicesPages = 1
export let invoicesPages = 1

export const invoiceApiSlice = api.injectEndpoints({
  endpoints: build => ({

    getSingleInvoice: build.query({
      query: id => pathToApi+`/invoices/${id}`,
      transformResponse: res => {
        return { ...res, updatedAt: res?.updatedAt ? moment(res.updatedAt).calendar() : null, }
      },
      providesTags: (result, error, arg) => [{ type: 'SingleInvoice', id: arg }]
    }),

    updateInvoice: build.mutation({
      query: invoice => ({
        headers: patchHeaders,
        url: pathToApi+`/invoices/${invoice.id}`,
        method: 'PATCH',
        body: JSON.stringify(!invoice?.isPublished
          ? {
            ...invoice,
            sum: invoice?.sum.toString(),
            subTotal: invoice?.subTotal.toString(),
            amount: invoice?.amount.toString(),
            totalAmount: invoice?.totalAmount.toString(),
            discount: invoice?.check1 ? parseFloat(invoice?.discount) : null,
            vTA: invoice?.check2 ? parseFloat(invoice?.vTA) : null}
          : {
            sum: invoice?.sum.toString(),
            daysCounter: parseInt(invoice?.daysCounter),
            isBedroomLeaved: invoice?.isBedroomLeaved,
            isComplete: invoice?.isComplete}
        ),
      }),
      invalidatesTags: ['Invoices', 'Consultations', 'Box']
    }),

    getInvoices: build.query({
      query: () => pathToApi+'/invoices',
      transformResponse: res => {
        totalInvoices = res['hydra:totalItems']
        invoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
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

    getInvoicesByPagination: build.query({
      query: page => pathToApi+`/invoices?page=${page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalInvoices = res['hydra:totalItems']
        invoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[1]) : 1
        return data?.map(act => {
          if (act?.releasedAt) act.releasedAt = moment(act.releasedAt).calendar()
          return act
        })
      },
    }), // pagination list,

    getResearchInvoices: build.query({
      query: keyword => pathToApi+`/invoices?fullName=${keyword}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchInvoices = res['hydra:totalItems']
        researchInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

    getResearchInvoicesByPagination: build.query({
      query: search => pathToApi+`/invoices?fullName=${search?.keyword}&page=${search?.page}`,
      transformResponse: res => {
        const data = res['hydra:member']
        totalResearchInvoices = res['hydra:totalItems']
        researchInvoicesPages = res['hydra:view'] ? parseInt(res['hydra:view']['hydra:last']?.split('=')[2]) : 1
        return data?.map(act => {
          if (act?.createdAt) act.createdAt = moment(act.createdAt).calendar()
          return act
        })
      },
    }),

  })
})

export const {
  useLazyGetInvoicesByPaginationQuery,
  useLazyGetResearchInvoicesQuery,
  useLazyGetResearchInvoicesByPaginationQuery,
  useGetInvoicesQuery,
  useGetSingleInvoiceQuery,
  useUpdateInvoiceMutation,
} = invoiceApiSlice
