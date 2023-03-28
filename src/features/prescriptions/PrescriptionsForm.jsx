import {Button, Card, Col, Form, Modal, Row, Spinner} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AppFloatingTextAreaField, AppMainError} from "../../components";
import img from '../../assets/app/img/medic_2.jpg';
import {useState} from "react";
import {useUpdatePrescriptionMutation} from "./prescriptionApiSlice";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {OrderItem} from "./OrderItem";
import PatientInfos from "../patients/PatientInfos";
import parser from 'html-react-parser';

export function PrescriptionsForm({ data, loader, isError, onRefresh }) {
  const [prescription, setPrescription] = useState({descriptions: '', orders: [{item: '', value: ''}]})
  const [updatePrescription, {isLoading}] = useUpdatePrescriptionMutation()

  const canSave = [prescription].every(Boolean) && !isLoading
  const navigate = useNavigate()

  const onAddOrderItem = () => setPrescription(prev => {
    return {
      ...prev,
      orders: [...prev.orders, {item: '', value: ''}]
    }
  })

  const onOrderChange = (event, index) => {
    const values = [...prescription.orders]
    values[index][event.target.name] = event.target.value
    setPrescription({
      ...prescription,
      orders: [...values]
    })
  }

  const onRemoveOrderItem = (index) => {
    const values = [...prescription.orders]
    values.splice(index, 1)
    setPrescription({...prescription, orders: [...values]})
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (canSave && data) {
      const formData = await updatePrescription({...prescription, id: data?.id})
      if (!formData.error) {
        toast.success('Prescription(s) bien efféctuée(s).')
        navigate('/member/orders', {replace: true})
      }
    }
    else alert('Veuillez renseigner ce champ !')
  }

  const [show, setShow] = useState(false)
  const [show2, setShow2] = useState(false)
  const [show3, setShow3] = useState(false)

  const onToggleShow = () => setShow(!show)
  const onToggleShow2 = () => setShow2(!show2)
  const onToggleShow3 = () => setShow3(!show3)

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={7}>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title' style={cardTitleStyle}>
                  <i className='bi bi-person'/> Patient(e)
                </h5>
                <div className='mb-3'>
                  {!loader && data && data?.patient && <PatientInfos patient={data.patient}/>}
                </div>

                <h5 className='card-title' style={cardTitleStyle}>
                  <i className='bi bi-pen'/> Prescription médicale (ordonnance)
                </h5>

                {isError && <AppMainError/>}

                {prescription.orders.map((order, idx) =>
                  <OrderItem
                    key={idx}
                    order={order}
                    idx={idx}
                    loader={loader || isLoading}
                    onOrderChange={onOrderChange}
                    prescription={prescription}
                    onRemoveOrderItem={onRemoveOrderItem}/>)}

                <Button
                  disabled={loader || isLoading}
                  type='button'
                  variant='info'
                  className='mb-3 w-100'
                  onClick={onAddOrderItem}>
                  <i className='bi bi-plus'/>
                </Button>

                <AppFloatingTextAreaField
                  onChange={({target}) => setPrescription({...prescription, descriptions: target?.value})}
                  disabled={loader || isLoading}
                  value={prescription.descriptions}
                  name='descriptions'
                  label='Commentaire :'
                  placeholder='Commentaire :' />

                <div className='text-center'>
                  <Button type='submit' disabled={isLoading || loader}>
                    {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></>: 'Valider'}
                  </Button>
                </div>

              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title' style={cardTitleStyle}>
                  <i className='bi bi-file-medical'/> Résultat des examens
                </h5>
                <div className='mb-2'>
                  <Button
                    type='button'
                    variant='dark' className='d-block mb-2 w-100'
                    onClick={onToggleShow}
                    disabled={loader || isLoading}>
                    <i className='bi bi-file-medical-fill'/> Examens prescritent
                  </Button>
                  <Button
                    type='button'
                    variant='secondary'
                    className='d-block mb-2 w-100'
                    onClick={onToggleShow2}
                    disabled={loader || isLoading}>
                    <i className='bi bi-virus2'/> Résultat des examens
                  </Button>
                  <Button
                    type='button'
                    variant='primary'
                    className='d-block mb-2 w-100'
                    onClick={onToggleShow3}
                    disabled={loader || isLoading}>
                    <i className='bi bi-list-check'/> Commentaire(s)
                  </Button>
                  {!loader && data &&
                    <Link
                      to={`/member/treatments/consultations/${data?.consultation.id}/show`}
                      className='d-block mb-2 w-100 btn btn-success'
                      disabled={loader || isLoading}>
                      <i className='bi bi-journal-medical'/> Fiche de consultation
                    </Link>}
                </div>
                {loader && <BarLoaderSpinner loading={loader}/>}
              </Card.Body>
              <Card.Img variant='bottom' src={img} />
            </Card>
          </Col>
        </Row>
      </Form>

      <Modal show={show} onHide={onToggleShow} size='lg'>
        <Modal.Header closeButton className='bg-dark text-light'>
          <Modal.Title><i className='bi bi-file-medical-fill'/> Examens prescritent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ul id='prescriptions-lab-exams'>
            {data && data?.lab && data.lab?.labResults && data.lab.labResults?.map((item, idx) =>
              <li key={idx}>
                <i className='bi bi-virus2 me-1'/>
                {item?.exam.wording}
              </li>)}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onToggleShow}>
            <i className='bi bi-x'/> Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show2} onHide={onToggleShow2} size='lg'>
        <Modal.Header closeButton className='bg-secondary text-light'>
          <Modal.Title><i className='bi bi-virus2'/> Résultat des examens</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data && data?.lab && parser(data.lab?.descriptions)}
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onToggleShow2}>
            <i className='bi bi-x'/> Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show3} onHide={onToggleShow3} size='lg'>
        <Modal.Header closeButton className='bg-primary text-light'>
          <Modal.Title><i className='bi bi-list-check'/> Commentaire(s)</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data && data?.lab && parser(data.lab?.comment)}
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onToggleShow3}>
            <i className='bi bi-x'/> Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
