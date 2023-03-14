import {AppAddModal} from "../../components";
import {useState} from "react";
import {Button, Form, InputGroup} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {useAddNewMedicineCategoryMutation} from "./medicineCategoriesApiSlice";
import toast from "react-hot-toast";

export const AddMedicineCategoriesModal = ({show, onHide}) => {
  const [addNewMedicineCategory, {isLoading}] = useAddNewMedicineCategoryMutation()
  const [categories, setCategories] = useState([{wording: ''}])

  const onReset = () => setCategories([{wording: ''}])

  const onSubmit = async (e) => {
    e.preventDefault()
    if (categories.length > 1) {
      let values = [...categories]
      for (const key in categories) {
        const formData = await addNewMedicineCategory(categories[key])
        if (!formData.error) {
          values = values.filter(item => item !== categories[key])
          setCategories(values)
          toast.success('Catégorie bien ajoutée.')
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
        title={<><i className='bi bi-plus'/> Ajouter une caégorie</>}
        onAdd={onSubmit}>
        <Form onSubmit={onSubmit}>
          {categories && categories.map((category, key) =>
            <InputGroup key={key} className='mb-3' data-aos='fade-in'>
              <Form.Control
                required
                disabled={isLoading}
                name='wording'
                value={category.wording}
                onChange={(e) => onArrayChange(e, key, categories, setCategories)}
                placeholder='Libellé' />
              {categories.length < 5 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='secondary'
                  onClick={() => onAddArrayClick({wording: ''}, categories, setCategories)}>
                  <i className='bi bi-plus'/>
                </Button>}
              {categories.length > 1 &&
                <Button
                  disabled={isLoading}
                  type='button'
                  variant='dark'
                  onClick={() => onRemoveArrayClick(key, categories, setCategories)}>
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
