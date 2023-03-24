import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalMedicines = 0

export const medicineApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getMedicines: build.query({
      query: () => pathToApi+'/medicines',
      transformResponse: res => {
        totalMedicines = res['hydra:totalItems']
        const data = res['hydra:member']
        return data.map(medicine => {
          if (medicine?.createdAt)
            medicine.createdAt = moment(medicine.createdAt).calendar()
          if (medicine?.expiryDate) medicine.expiryDate = moment(medicine.expiryDate).calendar()
          if (medicine?.released) medicine.released = moment(medicine.released).calendar()

          return medicine
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'Drugstore', id })), 'Drugstore']
          : ['Drugstore']
    }), // list of medicines

    addNewMedicine: build.mutation({
      query: medicine => ({
        url: pathToApi+'/medicines',
        method: 'POST',
        body: {...medicine,
          cost: medicine?.cost ? medicine.cost.toString() : '0',
          price: medicine?.price ? medicine.price.toString() : '0',
          category: medicine?.category ? medicine.category.value : null,
          subCategory: medicine?.subCategory ? medicine.subCategory.value : null,
          consumptionUnit: medicine?.consumptionUnit ? medicine.consumptionUnit.value : null,
        },
      }),
      invalidatesTags: ['Drugstore', 'DrugstoreList']
    }), // add new medicine

    updateMedicine: build.mutation({
      query: medicine => ({
        headers: patchHeaders,
        url: pathToApi+`/medicines/${medicine.id}`,
        method: 'PATCH',
        body: JSON.stringify({
          wording: medicine?.wording,
          code: medicine?.code ? medicine.code : null,
          cost: medicine?.cost ? medicine.cost.toString() : '0',
          price: medicine?.price ? medicine.price.toString() : '0',
          category: medicine?.category ? medicine.category.value : null,
          subCategory: medicine?.subCategory ? medicine.subCategory.value : null,
          consumptionUnit: medicine?.consumptionUnit ? medicine.consumptionUnit.value : null,
        }),
      }),
      invalidatesTags: ['Drugstore', 'DrugstoreList']
    }), // update medicine

    deleteMedicine: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/medicines/${id}`,
        headers: patchHeaders,
        method: 'PATCH',
        body: JSON.stringify({ isDeleted: true }),
      }),
      invalidatesTags: ['Drugstore', 'DrugstoreList']
    }), // delete medicine

    handleLoadMedicinesOptions: build.query({
      query: keyword => pathToApi+`/medicines?wording=${keyword}`,
      transformResponse: res => res['hydra:member']?.map(medicine => {
        return {
          id: medicine.id,
          quantity: medicine.quantity,
          cost: parseFloat(medicine.cost),
          price: parseFloat(medicine.price),
          code: medicine?.code ? medicine.code : '-- --',
          label: medicine?.wording,
          value: medicine['@id'],
          data: medicine,
        }
      })
    }), // get medicines options

    handleLoadMedicinesCodesOptions: build.query({
      query: keyword => pathToApi+`/medicines?code=${keyword}`,
      transformResponse: res => res['hydra:member']?.map(medicine => {
        return {
          id: medicine.id,
          quantity: medicine.quantity,
          cost: parseFloat(medicine.cost),
          price: parseFloat(medicine.price),
          wording: medicine.wording,
          label: medicine.code,
          value: medicine['@id'],
          data: medicine,
        }
      })
    }), // get medicines options

    onPostMedicineSales: build.mutation({
      query: data => ({
        url: pathToApi+`/medicine_invoices`,
        method: 'POST',
        body: {
          amount: data?.amount.toString(),
          subTotal: data?.subTotal.toString(),
          discount: data?.check1 ? parseFloat(data?.discount) : null,
          vTA: data?.check2 ? parseFloat(data?.vTA) : null,
          totalAmount: data?.totalAmount.toString(),
          currency: data?.currency ? data.currency?.value: null,
          values: data?.values.map(item => {
            return {
              id: item?.id,
              quantity: parseFloat(item?.qty),
              price: item?.price.toString(),
              cost: item?.cost.toString(),
            }
          })},
      }),
      invalidatesTags: ['Drugstore', 'DrugstoreList', 'Box'],
    })
  })
})

export const {
  useGetMedicinesQuery,
  useAddNewMedicineMutation,
  useUpdateMedicineMutation,
  useDeleteMedicineMutation,
  useLazyHandleLoadMedicinesOptionsQuery,
  useLazyHandleLoadMedicinesCodesOptionsQuery,
  useOnPostMedicineSalesMutation,
} = medicineApiSlice
