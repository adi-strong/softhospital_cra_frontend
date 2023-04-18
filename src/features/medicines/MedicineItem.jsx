import {limitStrTo} from "../../services";
import {Button, ButtonGroup, Form, Modal, Spinner} from "react-bootstrap";
import {useState} from "react";
import {ShowMedicineModal} from "./ShowMedicineModal";
import {
  useDeleteMedicineMutation, useOnDestockingForHospitalMutation,
} from "./medicineApiSlice";
import toast from "react-hot-toast";
import {AppDelModal} from "../../components";
import {EditMedicineModal} from "./EditMedicineModal";
import {useGetDestockingMutation} from "./destockingApiSlice";

const style = {cursor: 'pointer'}

function DestockModal({ medicine, onHide, onSubmit, show = false, isLoading = false }) {
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static'>
        <Modal.Header className='bg-danger text-light'>
          <Modal.Title><i className='bi bi-database-dash'/> Déstockage de <b>{medicine?.wording}</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-center'>
            <small>
              <code><i className='bi bi-exclamation-circle-fill'/> Cette action est irréversible.</code>
            </small>
          </p>
          <p className='text-center'>
            Êtes-vous certain(e) de vouloir déstocker ce remède : <br/> <b className='text-danger'>{medicine?.wording+' '}
            <i className='bi bi-question-circle text-danger'/></b>
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' disabled={isLoading} onClick={onHide}>
            <i className='bi bi-x'/> Fermer
          </Button>
          <Button type='button' variant='danger' disabled={isLoading} onClick={onSubmit}>
            <i className='bi bi-database-dash me-1'/>
            {!isLoading ? 'Déstocker' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

function DestockModal2({medicine, onChange, state, onHide, onSubmit, show = false, isLoading = false}) {
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static'>
        <Modal.Header className='bg-warning'>
          <Modal.Title><i className='bi bi-database-fill-dash'/> Déstockage de <b>{medicine?.wording}</b></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className='text-center'>
            <small>
              <code><i className='bi bi-exclamation-circle-fill'/> Cette action est irréversible.</code>
            </small>
          </p>
          <div className='text-center'>
            <Form.Label htmlFor='dStockQuantity'>Quantité à déstocker :</Form.Label>
            <Form.Control
              id='dStockQuantity'
              className='w-50 m-auto text-end'
              type='number'
              name='dStockQuantity'
              value={state}
              onChange={onChange}
              disabled={isLoading} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' disabled={isLoading} onClick={onHide}>
            <i className='bi bi-x'/> Fermer
          </Button>
          <Button type='button' variant='danger' disabled={isLoading} onClick={onSubmit}>
            <i className='bi bi-database-dash me-1'/>
            {!isLoading ? 'Déstocker' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export const MedicineItem = ({ medicine, currency }) => {
  const price = parseFloat(medicine?.price).toFixed(2).toLocaleString()
  const expiryDate = medicine?.expiryDate ? medicine.expiryDate : '-'
  const createdAt = medicine?.createdAt ? medicine.createdAt : '❓'
  const [show, setShow] = useState(false)
  const [showDestock, setShowDestock] = useState(false)
  const [showDestock2, setShowDestock2] = useState(false)
  const [dStockQuantity, setDStockQuantity] = useState(0.00)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteMedicine, {isLoading}] = useDeleteMedicineMutation()
  const [getDestocking, {isLoading: isLoad}] = useGetDestockingMutation()
  const [onDestockingForHospital, {isLoading: isLoad2}] = useOnDestockingForHospitalMutation()

  const toggleShowModal = () => setShow(!show)
  const toggleShowEditModal = () => setShowEdit(!showEdit)
  const toggleShowDeleteModal = () => setShowDelete(!showDelete)
  const toggleDestockModal = () => setShowDestock(!showDestock)
  const toggleDestock2Modal = () => setShowDestock2(!showDestock2)

  async function onDelete() {
    try {
      toggleShowDeleteModal()
      const data = await deleteMedicine(medicine)
      if (!data.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  async function onDestocking() {
    try {
      const onSubmit = await getDestocking(medicine)
      if (!onSubmit?.error) {
        toast.success('Destockage bien efféctué.')
        setShowDestock(false)
      }
    } catch (e) { }
  }

  async function onDestocking2() {
    try {
      const onSubmit = await onDestockingForHospital({id: medicine?.id, dStockQuantity})
      if (!onSubmit?.error) {
        toast.success('Destockage bien efféctué.')
        setDStockQuantity(0.00)
        setShowDestock2(false)
      }
    } catch (e) { }
  }

  const onChange = ({ target }) => {
    const value = target.value > 0 && !isNaN(target.value) ? parseFloat(target.value) : 0
    setDStockQuantity(value)
  }

  return (
    <>
      <tr>
        <td><i className='bi bi-capsule'/></td>
        <th scope='row'>#{medicine?.id}</th>
        <td
          onClick={toggleShowModal}
          className={`text-capitalize text-${medicine?.daysRemainder <= 15 
            ? 'danger text-decoration-underline' 
            : 'primary'} fw-bold`}
          title={medicine?.wording.toUpperCase()}
          style={style}>
          {medicine?.daysRemainder <= 15 && <span className='bi bi-exclamation-triangle-fill me-1'/>}
          {limitStrTo(20, medicine?.wording)}
        </td>
        <td className='text-primary' style={{ fontWeight: 800 }}>
          <span className='text-secondary'>{currency ? currency.value : ''}</span> {price}
        </td>
        <td style={{ fontWeight: 800 }}>
          <span className={`text-${medicine?.quantity <= 30 
            ? medicine?.quantity <= 80 
              ? 'warning text-decoration-underline' 
              : 'danger text-decoration-underline'
            : 'dark'}`}>
            {medicine?.quantity.toLocaleString()}
          </span>
        </td>
        <td className='text-uppercase'>{medicine?.consumptionUnit ? medicine.consumptionUnit.wording : '❓'}</td>
        <td className={`text-${medicine?.daysRemainder <= 15 
          ? 'danger text-decoration-underline' 
          : 'dark'}`}>{expiryDate}</td>
        <td>{createdAt}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' title='Déstocker' onClick={toggleDestockModal} disabled={isLoad}>
              <i className='bi bi-database-dash text-danger'/>
            </Button>
            <Button
              type='button'
              variant='light' title="Déstockage pour pour l'hôpital"
              onClick={toggleDestock2Modal}
              disabled={isLoad2}>
              <i className='bi bi-database-fill-dash text-dark'/>
            </Button>
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

      <DestockModal
        onSubmit={onDestocking}
        isLoading={isLoad}
        onHide={toggleDestockModal}
        medicine={medicine}
        show={showDestock} />

      <DestockModal2
        onChange={onChange}
        state={dStockQuantity}
        medicine={medicine}
        onSubmit={onDestocking2}
        onHide={toggleDestock2Modal}
        show={showDestock2}
        isLoading={isLoad2} />
    </>
  )
}
