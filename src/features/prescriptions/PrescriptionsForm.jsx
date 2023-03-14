import {Button, Card, Col, Form, Row, Spinner} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AppFloatingTextAreaField, AppMainError} from "../../components";
import img from '../../assets/app/img/microscopic_4.jpg';
import {useState} from "react";
import {useUpdatePrescriptionMutation} from "./prescriptionApiSlice";
import {Link, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {OrderItem} from "./OrderItem";
import PatientInfos from "../patients/PatientInfos";

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
                  <Button type='button' variant='dark' className='d-block mb-2 w-100' disabled={loader || isLoading}>
                    <i className='bi bi-file-medical-fill'/> Examens prescritent
                  </Button>
                  <Button type='button' variant='secondary' className='d-block mb-2 w-100' disabled={loader || isLoading}>
                    <i className='bi bi-virus2'/> Résultat des examens
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
    </>
  )
}
