import {useState} from "react";
import {Button, ButtonGroup} from "react-bootstrap";
import toast from "react-hot-toast";
import {useDeleteConsumptionUnitMutation} from "./consumptionUnitApiSlice";
import {AppDelModal} from "../../components";
import {EditConsumptionUnit} from "./EditConsumptionUnit";

export const ConsumptionUnitItem = ({cUnit}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteConsumptionUnit, {isLoading}] = useDeleteConsumptionUnitMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const data = await deleteConsumptionUnit(cUnit)
      if (!data.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-tag'/></td>
        <td className='text-uppercase text-primary'>{cUnit?.wording}</td>
        <td>{cUnit?.createdAt ? cUnit.createdAt : '❓'}</td>
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

      <EditConsumptionUnit data={cUnit} onHide={toggleEditModal} show={showEdit} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimé l'unité de consommation <br/>
            <i className='bi bi-quote me-1'/>
            <span className='text-uppercase fw-bold'>{cUnit?.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}
