import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalMedicineCategories = 0

export const medicineCategoriesApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getMedicineCategories: build.query({
      query: () => pathToApi+'/medicine_categories',
      transformResponse: res => {
        totalMedicineCategories = res['hydra:totalItems']
        const data = res['hydra:member']
        return data.map(medicineCategory => {
          if (medicineCategory?.createdAt) medicineCategory.createdAt = moment(medicineCategory.createdAt).calendar()
          return medicineCategory
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'MedicineCategories', id })), 'MedicineCategories']
          : ['MedicineCategories']
    }), // list of medicine's categories

    addNewMedicineCategory: build.mutation({
      query: medicineCategory => ({
        url: pathToApi+'/medicine_categories',
        method: 'POST',
        body: medicineCategory,
      }),
      invalidatesTags: ['MedicineCategories']
    }), // add new medicine's category

    updateMedicineCategory: build.mutation({
      query: medicineCategory => ({
        headers: patchHeaders,
        url: pathToApi+`/medicine_categories/${medicineCategory.id}`,
        method: 'PATCH',
        body: JSON.stringify({wording: medicineCategory.wording}),
      }),
      invalidatesTags: ['MedicineCategories', 'MedicineSubCategories', 'Drugstore']
    }), // update medicine's category

    deleteMedicineCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/medicine_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['MedicineCategories', 'MedicineSubCategories', 'Drugstore']
    }), // delete medicine's category
  })
})

export const {
  useGetMedicineCategoriesQuery,
  useAddNewMedicineCategoryMutation,
  useUpdateMedicineCategoryMutation,
  useDeleteMedicineCategoryMutation,
} = medicineCategoriesApiSlice
