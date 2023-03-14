import {useMemo, useState} from "react";
import {useAddNewMedicineSubCategoryMutation} from "./medicineSubCategoriesApiSlice";
import toast from "react-hot-toast";
import {AppAddModal, AppSelectOptions} from "../../components";
import {Button, Form, InputGroup} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {useGetMedicineCategoriesQuery} from "./medicineCategoriesApiSlice";

export const AddMedicineSubCategoriesModal = ({show, onHide}) => {
  const [addNewMedicineSubCategory, {isLoading}] = useAddNewMedicineSubCategoryMutation()
  const [category, setCategory] = useState(null)
  const [subCategories, setSubCategories] = useState([{wording: ''}])
  const {
    data: categories = [],
    isLoading: isCLoading,
    isFetching,
    isSuccess,
    isError} = useGetMedicineCategoriesQuery('MedicineCategories')

  let options
  if (isError) alert('ERRUER: Erreur lors du chargement des catégories !!!')
  options = useMemo(() => {
    if (isSuccess && categories) return categories.map(category => {
      return {
        label: category?.wording,
        value: category['@id'],
      }
    })
  }, [isSuccess, categories])

  const onReset = () => {
    setCategory(null)
    setSubCategories([{wording: ''}])
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (subCategories.length > 0) {
      let values = [...subCategories]
      for (const key in subCategories) {
        const formData = await addNewMedicineSubCategory({
          ...subCategories[key],
          category: category ? category?.value : null
        })
        if (!formData.error) {
          values = values.filter(item => item !== subCategories[key])
          setSubCategories(values)
          toast.success('Sous-catégorie bien ajoutée.')
          if (values.length < 1) {
            toast.success('Enregistrement bien efféctuée.', {
              icon: '👌',
              style: {
                background: '#3f6c1e',
                color: '#fff'
              }
            })
            onReset()
            onHide()
          }
        }
        else {
          const violations = formData.error.data.violations
          if (violations) {
            violations.forEach(({propertyPath, message}) => {
              toast.error(`${propertyPath}: ${message}`, {
                style: {
                  background: 'red',
                  color: '#fff',
                }
              })
            })
          }
        }
      }
    }
    else alert('Aucune catégorie renseignée !!!')
  }

  return (
    <>
      <AppAddModal
        loader={isLoading}
        onHide={onHide}
        show={show}
        title={<><i className='bi bi-plus'/> Ajouter une sous-caégorie</>}
        onAdd={onSubmit}>
        <Form onSubmit={onSubmit}>
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
          {subCategories && subCategories.map((category, key) =>
            <InputGroup key={key} className='mb-3' data-aos='fade-in'>
              <Form.Control
                required
                disabled={isLoading}
                name='wording'
                value={category.wording}
                onChange={(e) => onArrayChange(e, key, subCategories, setSubCategories)}
                placeholder='Libellé' />
              {subCategories.length < 5 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='secondary'
                  onClick={() => onAddArrayClick({wording: ''}, subCategories, setSubCategories)}>
                  <i className='bi bi-plus'/>
                </Button>}
              {subCategories.length > 1 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='dark'
                  onClick={() => onRemoveArrayClick(key, subCategories, setSubCategories)}>
                  <i className='bi bi-dash'/>
                </Button>}
            </InputGroup>)}
        </Form>

        <Button type='button' variant='light' className='d-block w-100' disabled={isLoading} onClick={onReset}>
          <i className='bi bi-trash3 text-danger'/>
        </Button>
      </AppAddModal>
    </>
  )
}
