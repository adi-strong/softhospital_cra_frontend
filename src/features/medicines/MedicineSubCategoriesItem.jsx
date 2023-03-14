import {useState} from "react";
import {limitStrTo} from "../../services";
import {Button, ButtonGroup} from "react-bootstrap";
import {EditMedicineSubCategory} from "./EditMedicineSubCategory";
import toast from "react-hot-toast";
import {AppDelModal} from "../../components";
import {useDeleteMedicineSubCategoryMutation} from "./medicineSubCategoriesApiSlice";

export const MedicineSubCategoriesItem = ({subCategory}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteMedicineSubCategory, {isLoading}] = useDeleteMedicineSubCategoryMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const data = await deleteMedicineSubCategory(subCategory)
      if (!data.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-tag'/></td>
        <td className='text-uppercase text-primary' title={subCategory?.wording.toUpperCase()}>
          {limitStrTo(15, subCategory?.wording)}
        </td>
        <td className='text-uppercase' title={subCategory?.category ? subCategory.category.wording : ''}>
          {subCategory?.category
            ? limitStrTo(10, subCategory.category.wording)
            : '❓'}
        </td>
        <td>{subCategory?.createdAt ? subCategory.createdAt : '❓'}</td>
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

      <EditMedicineSubCategory onHide={toggleEditModal} show={showEdit} data={subCategory} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimé la sous-catégorie <br/>
            <i className='bi bi-quote me-1'/>
            <span className='text-uppercase fw-bold'>{subCategory?.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}
