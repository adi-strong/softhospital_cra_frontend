import {limitStrTo} from "../../services";
import {Button, ButtonGroup} from "react-bootstrap";
import {useState} from "react";
import {ShowMedicineModal} from "./ShowMedicineModal";
import {useDeleteMedicineMutation} from "./medicineApiSlice";
import toast from "react-hot-toast";
import {AppDelModal} from "../../components";
import {EditMedicineModal} from "./EditMedicineModal";

const style = {cursor: 'pointer'}

export const MedicineItem = ({medicine, currency}) => {
  const price = parseFloat(medicine?.price).toFixed(2).toLocaleString()
  const expiryDate = medicine?.expiryDate ? medicine.expiryDate : '-'
  const createdAt = medicine?.createdAt ? medicine.createdAt : '❓'
  const [show, setShow] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteMedicine, {isLoading}] = useDeleteMedicineMutation()

  const toggleShowModal = () => setShow(!show)
  const toggleShowEditModal = () => setShowEdit(!showEdit)
  const toggleShowDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    try {
      toggleShowDeleteModal()
      const data = await deleteMedicine(medicine)
      if (!data.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-capsule'/></td>
        <th scope='row'>#{medicine?.id}</th>
        <td
          onClick={toggleShowModal}
          className='text-capitalize text-primary fw-bold'
          title={medicine?.wording.toUpperCase()}
          style={style}>
          {limitStrTo(20, medicine?.wording)}
        </td>
        <td className='text-primary' style={{ fontWeight: 800 }}>
          <span className='text-secondary'>{currency ? currency.value : ''}</span> {price}
        </td>
        <td style={{ fontWeight: 800 }}>{medicine?.quantity.toLocaleString()}</td>
        <td className='text-uppercase'>{medicine?.consumptionUnit ? medicine.consumptionUnit.wording : '❓'}</td>
        <td>{expiryDate}</td>
        <td>{createdAt}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' onClick={toggleShowEditModal} disabled={isLoading}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='danger' onClick={toggleShowDeleteModal} disabled={isLoading}>
              <i className='bi bi-trash3'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <ShowMedicineModal onHide={toggleShowModal} show={show} data={medicine} currency={currency} />
      <EditMedicineModal show={showEdit} onHide={toggleShowEditModal} data={medicine} currency={currency} />
      <AppDelModal
        onHide={toggleShowDeleteModal}
        show={showDelete}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer ce produit <br/>
            <i className='bi bi-quote me-1'/>
            <span className='text-uppercase fw-bold'>{medicine?.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}
