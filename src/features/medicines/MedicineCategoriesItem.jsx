import {limitStrTo} from "../../services";
import {Button, ButtonGroup} from "react-bootstrap";
import {useState} from "react";
import {EditMedicineCategory} from "./EditMedicineCategory";
import {AppDelModal} from "../../components";
import toast from "react-hot-toast";
import {useDeleteMedicineCategoryMutation} from "./medicineCategoriesApiSlice";

export function MedicineCategoriesItem({category}) {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteMedicineCategory, {isLoading}] = useDeleteMedicineCategoryMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const data = await deleteMedicineCategory(category)
      if (!data.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-tags'/></td>
        <td className='text-uppercase text-primary' title={category?.wording.toUpperCase()}>
          {limitStrTo(20, category?.wording)}
        </td>
        <td>{category?.createdAt ? category.createdAt : '❓'}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' onClick={toggleEditModal} disabled={isLoading}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='danger' onClick={toggleDeleteModal} disabled={isLoading}>
              <i className='bi bi-trash3'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditMedicineCategory onHide={toggleEditModal} show={showEdit} data={category} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimé cette catégorie <br/>
            <i className='bi bi-quote me-1'/>
            <span className='text-uppercase fw-bold'>{category?.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}
