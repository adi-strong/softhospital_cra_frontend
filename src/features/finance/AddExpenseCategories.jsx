import {useEffect, useState} from "react";
import {AppAddModal} from "../../components";
import {Button, Form, InputGroup} from "react-bootstrap";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {useAddNewExpenseCategoryMutation} from "./expenseCategoryApiSlice";
import toast from "react-hot-toast";

export const AddExpenseCategories = ({show, onHide, setShow}) => {
  const [categories, setCategories] = useState([{name: ''}])
  const [addNewExpenseCategory, {isLoading}] = useAddNewExpenseCategoryMutation()

  const onReset = () => setCategories([{wording: ''}])

  async function onSubmit() {
    if (categories.length > 0) {
      let values = [...categories]
      for (const key in categories) {
        try {
          const formData = await addNewExpenseCategory(categories[key])
          if (!formData.error) {
            values = values.filter(item => item !== categories[key])
            setCategories(values)
            toast.success('Ajout bien efféctué.')
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
        catch (e) { }
      }
    }
    else alert('Aucun élément renseigné !')
  }

  useEffect(() => {
    if (categories.length < 1) {
      setCategories(prev => {
        return [{name: ''}]
      })
      setShow(false)
    }
  }, [categories, setShow])

  return (
    <>
      <AppAddModal
        loader={isLoading}
        title='Ajouter une catégorie'
        show={show}
        onHide={onHide}
        onAdd={onSubmit}>
        {categories && categories.map((item, key) =>
          <InputGroup key={key} data-aos='fade-in' className='mb-3'>
            <Form.Control
              required
              disabled={isLoading}
              name='name'
              value={item.name}
              onChange={(e) => onArrayChange(e, key, categories, setCategories)}
              placeholder='Nom de la catégorie...' />
            {categories.length < 5 &&
              <Button
                disabled={isLoading}
                type='button'
                variant='secondary'
                onClick={() => onAddArrayClick({name: ''}, categories, setCategories)}>
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

        <Button type='button' variant='light' disabled={isLoading} onClick={onReset} className='d-block w-100'>
          <i className='bi bi-trash3'/>
        </Button>
      </AppAddModal>
    </>
  )
}
