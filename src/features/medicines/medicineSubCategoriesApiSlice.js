import {api, patchHeaders, pathToApi} from "../../app/store";
import moment from "moment";

export let totalMedicineSubCategories = 0

export const medicineSubCategoriesApiSlice = api.injectEndpoints({
  endpoints: build => ({
    getMedicineSubCategories: build.query({
      query: () => pathToApi+'/medicine_sub_categories',
      transformResponse: res => {
        totalMedicineSubCategories = res['hydra:totalItems']
        const data = res['hydra:member']
        return data.map(medicineSubCategory => {
          if (medicineSubCategory?.createdAt)
            medicineSubCategory.createdAt = moment(medicineSubCategory.createdAt).calendar()

          return medicineSubCategory
        })
      },
      providesTags: result =>
        result
          ? [...result?.map(({ id }) => ({ type: 'MedicineSubCategories', id })), 'MedicineSubCategories']
          : ['MedicineSubCategories']
    }), // list of medicine's sub-categories

    addNewMedicineSubCategory: build.mutation({
      query: medicineSubCategory => ({
        url: pathToApi+'/medicine_sub_categories',
        method: 'POST',
        body: medicineSubCategory,
      }),
      invalidatesTags: ['MedicineSubCategories']
    }), // add new medicine's sub-category

    updateMedicineSubCategory: build.mutation({
      query: medicineSubCategory => ({
        headers: patchHeaders,
        url: pathToApi+`/medicine_sub_categories/${medicineSubCategory.id}`,
        method: 'PATCH',
        body: JSON.stringify(medicineSubCategory),
      }),
      invalidatesTags: ['MedicineSubCategories', 'Drugstore']
    }), // update medicine's sub-category

    deleteMedicineSubCategory: build.mutation({
      query: ({ id }) => ({
        url: pathToApi+`/medicine_sub_categories/${id}`,
        method: 'DELETE',
        body: id,
      }),
      invalidatesTags: ['MedicineSubCategories', 'Drugstore']
    }), // delete medicine's sub-category

    handleLoadSubCategoriesOptions: build.query({
      query: id => pathToApi+`/medicine_categories/${id}/sub_categories`,
      transformResponse: res => {
        return res['hydra:member']
          ? res['hydra:member']?.map(subCategory => {
            return {
              label: subCategory?.wording,
              value: subCategory['@id'],
            }
          })
          : []
      }
    })
  })
})

export const {
  useGetMedicineSubCategoriesQuery,
  useAddNewMedicineSubCategoryMutation,
  useUpdateMedicineSubCategoryMutation,
  useDeleteMedicineSubCategoryMutation,
  useLazyHandleLoadSubCategoriesOptionsQuery,
} = medicineSubCategoriesApiSlice
