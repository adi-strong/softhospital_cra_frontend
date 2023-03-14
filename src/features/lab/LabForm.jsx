import {useEffect, useState} from "react";
import {Badge, Button, Card, Col, Form, Row, Spinner} from "react-bootstrap";
import {AppFloatingTextAreaField} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useUpdateLabMutation} from "./labApiSlice";
import toast from "react-hot-toast";
import {Link, useNavigate} from "react-router-dom";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import img from '../../assets/app/img/microscopic.jpg';
import {limitStrTo} from "../../services";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import PatientInfos from "../patients/PatientInfos";

export const LabForm = ({ loader, isSuccess, data, isFetching, onRefetch }) => {
  const navigate = useNavigate()
  const [lab, setLab] = useState({
    id: null,
    note: '',
    comment: '',
    descriptions: '',
    values: [],
  })
  const [updateLab, {isLoading}] = useUpdateLabMutation()

  // Handle get data
  useEffect(() => {
    if (isSuccess && data) {
      const labResults = data?.labResults
        ? data.labResults?.map(r => {
          return {
            id: r?.exam.id,
            exam: r?.exam.wording,
            category: r?.exam ? r.exam?.category ? r.exam.category?.name : null : null
          }
        })
        : null; // Lab's results (Exams)

      setLab(prev => {
        return {
          ...prev,
          id: data?.id,
          note: data?.note ? data.note : prev.note,
          comment: data?.comment ? data.comment : prev.comment,
          values: labResults,
        }
      })

      if (data?.isPublished) {
        toast.error('Réultats déjà publiés pour ces examens', {
          icon: '❗',
          style: {
            background: 'orange',
            color: '#000'
          }
        })
        navigate('/member/treatments/lab', {replace: true})
      }
    }
  }, [isSuccess, data, navigate])
  // End Handle get data

  async function onSubmit(e) {
    e.preventDefault()
    if (data && lab.id) {
      const formData = await updateLab(lab)
      if (!formData.error) {
        await onRefetch()
        toast.success('Opération bien efféctuée.')
        navigate('/member/treatments/lab', {replace: true})
      }
    }
  }

  return (
    <>
      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-person'/> Patient(e)</h5>
              <div className='mb-3'>
                {!loader && data && data?.patient && <PatientInfos patient={data.patient}/>}
              </div>

              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-pencil'/> Résultats</h5>
              <Form onSubmit={onSubmit}>
                <AppFloatingTextAreaField
                  label='Résultats'
                  onChange={(e) => handleChange(e, lab, setLab)}
                  disabled={loader || isFetching || isLoading}
                  value={lab.descriptions}
                  name='descriptions'
                  placeholder='Résultats' />

                <AppFloatingTextAreaField
                  label={<>Commentaire(s)</>}
                  onChange={(e) => handleChange(e, lab, setLab)}
                  disabled={loader || isFetching || isLoading}
                  value={lab.comment}
                  name='comment'
                  placeholder='Commentaire(s)' />

                <div className='text-end'>
                  <Button type='button' variant='light' disabled={isFetching || isLoading} onClick={onRefetch}>
                    {isFetching && <>Chargement en cours <Spinner animation='grow' size='sm'/></>}
                    {!isFetching && <><i className='bi bi-arrow-clockwise'/> Actualiser</>}
                  </Button>
                  <Button type='submit' disabled={loader || isFetching || isLoading}>
                    {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>
                <i className='bi bi-prescription'/> Prescriptions (examens)
              </h5>
              {lab.values && lab.values?.map((item, index) => (
                <Badge key={index} bg='secondary' className='me-1 shadow-lg'>
                  <i className='bi bi-virus2'/> {limitStrTo(20, item?.exam)}
                  {item?.category &&
                    <small className='mx-1 text-info'>
                      ( {limitStrTo(15, item.category)} <i className='bi bi-tags'/> )
                    </small>}
                </Badge>
              ))}
              {loader && <BarLoaderSpinner loading={loader}/>}

              <h5 className='card-title mt-4' style={cardTitleStyle}>
                <i className='bi bi-journal-bookmark'/> Renseignement clinic
              </h5>
              {data?.consultation && (
                <>
                  {data.consultation?.note && data.consultation.note}
                  <p className='mb-0 mt-3'>
                    <Link
                      to={`/member/treatments/consultations/${data.consultation?.id}/show`}
                      className='btn btn-success'>
                      <i className='bi bi-journal-medical'/> Fiche de consultation
                    </Link>
                  </p>
                </>
              )}

              {loader && <BarLoaderSpinner loading={loader}/>}
            </Card.Body>
            <Card.Img src={img} variant='bottom' />
          </Card>
        </Col>
      </Row>
    </>
  )
}
