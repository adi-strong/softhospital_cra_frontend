import {useDeleteExpenseCategoryMutation, useGetExpenseCategoriesQuery} from "./expenseCategoryApiSlice";
import {Button, ButtonGroup} from "react-bootstrap";
import {useState} from "react";
import {EditExpenseCategory} from "./EditExpenseCategory";
import {AppDelModal} from "../../components";

export const ExpenseCategoriesItem = ({id, onDelete}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteExpenseCategory, {isLoading}] = useDeleteExpenseCategoryMutation()
  const { category } = useGetExpenseCategoriesQuery('ExpenseCategories', {
    selectFromResult: ({ data }) => ({ category: data?.entities[id] })
  })

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  return (
    <>
      <tr>
        <th scope='row'><i className='bi bi-bookmark-star-fill'/></th>
        <td className='text-uppercase'>{category.name}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' disabled={isLoading} onClick={toggleEditModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='light' disabled={isLoading} onClick={toggleDeleteModal}>
              <i className='bi bi-trash3 text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditExpenseCategory onHide={toggleEditModal} show={showEdit} data={category} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={() => onDelete(category, deleteExpenseCategory, toggleDeleteModal)}
        text={
          <>
            <p>
              Êtes-vous certain de vouloir supprimer la catégorie <br/>
              <i className='bi bi-quote me-1'/>
              <span className="fw-bold text-uppercase">{category.name}</span>
              <i className='bi bi-quote mx-1'/>
            </p>
          </>
        }>
      </AppDelModal>
    </>
  )
}
