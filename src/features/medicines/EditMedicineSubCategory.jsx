import {useEffect, useMemo, useState} from "react";
import {useGetMedicineCategoriesQuery} from "./medicineCategoriesApiSlice";
import toast from "react-hot-toast";
import {useUpdateMedicineSubCategoryMutation} from "./medicineSubCategoriesApiSlice";
import {AppEditModal, AppSelectOptions} from "../../components";
import {Form} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const EditMedicineSubCategory = ({show, onHide, data}) => {
  const [subCategory, setSubCategory] = useState(data)
  const [category, setCategory] = useState(null)
  const {
    data: categories = [],
    isLoading: isCLoading,
    isFetching,
    isSuccess,
    isError: isCError} = useGetMedicineCategoriesQuery('MedicineCategories')
  const [updateMedicineSubCategory, {isLoading, isError, error}] = useUpdateMedicineSubCategoryMutation()
  let apiErrors = {wording: null}

  let options
  if (isCError) alert('ERRUER: Erreur lors du chargement des catégories !!!')
  options = useMemo(() => {
    if (isSuccess && categories) return categories.map(category => {
      return {
        label: category?.wording,
        value: category['@id'],
      }
    })
  }, [isSuccess, categories])

  useEffect(() => {
    if (data && data?.category) setCategory({
      label: data.category.wording,
      value: data.category['@id'],
    })
  }, [data])

  async function onSubmit() {
    apiErrors = {wording: null}
    try {
      const formData = await updateMedicineSubCategory({
        id: subCategory.id,
        wording: subCategory.wording,
        category: category ? category.value : null})
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <AppEditModal
        show={show}
        onHide={onHide}
        onEdit={onSubmit}
        loader={isLoading}>
        <div className='mb-3'>
          <AppSelectOptions
            value={category}
            options={options}
            disabled={isLoading || isCLoading || isFetching}
            placeholder='-- Catégorie --'
            name='category'
            label='Catégorie'
            onChange={(e) => setCategory(e)} />
        </div>
        <Form.Control
          required
          disabled={isLoading}
          name='wording'
          value={subCategory.wording}
          onChange={(e) => handleChange(e, subCategory, setSubCategory)}
          placeholder='Libellé' />
      </AppEditModal>
    </>
  )
}
