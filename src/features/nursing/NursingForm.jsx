import {Button, ButtonGroup, Card, Col, Form, Row, Spinner} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {AppAsyncSelectOptions, AppDatePicker, AppFloatingTextAreaField, AppMainError} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import PatientInfos from "../patients/PatientInfos";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {Link, useNavigate} from "react-router-dom";
import {useUpdateNursingMutation} from "./nursingApiSlice";
import toast from "react-hot-toast";
import {useGetTreatmentsQuery, useLazyHandleLoadTreatmentsQuery} from "../treatments/treatmentApiSlice";
import img from '../../assets/app/img/medic_3.jpg';
import AppInputField from "../../components/forms/AppInputField";
import {requiredField} from "../covenants/addCovenant";

export function NursingForm({ data, onRefresh, isError = false, loader = false}) {
  const navigate = useNavigate()
  const [treatments, setTreatments] = useState([])
  const [nursing, setNursing] = useState({
    treatments: [{treatment: null, medicines: [{medicine: '', dosage: ''}]}],
    comment: '',
    arrivedAt: new Date(),
    leaveAt: new Date(),
  })
  const [updateNursing, {isLoading}] = useUpdateNursingMutation()
  const [handleLoadTreatments] = useLazyHandleLoadTreatmentsQuery()
  const {data: items = [], isFetching, isSuccess, isError: isItemsError, refetch} = useGetTreatmentsQuery('Treatment')

  useEffect(() => {
    if (!loader && data) {
      if (data?.isCompleted) navigate('/member/treatments/nursing', {replace: true})
      if (data?.isPublished) setNursing(prev => {
        return {
          ...prev,
          comment: data?.comment ? data.comment : '',
        }
      })
    }
  }, [loader, data, navigate])

  let options

  useEffect(() => {
    if (!loader && data && data?.nursingTreatments) {
      const values = data?.nursingTreatments?.map(t => {
        return {
          id: t?.treatment.id,
          label: t?.treatment.wording,
          medicines: [{medicine: '', dosage: ''}]
        }
      })
      setTreatments(values)
    }
  }, [loader, data]) // handle get first's treatments

  if (isError) alert('ERREUR: Erreur lors du chargement du traitement !!!')
  if (isItemsError) alert('ERREUR: Erreur lors du chargement des traitements !!!')
  options = useMemo(() => isSuccess && items
    ? items?.ids.map(id => {
      const treatment = items?.entities[id]
      return {
        id: treatment?.id,
        label: treatment?.wording,
        value: treatment['@id'],
      }
    })
    : [], [isSuccess, items])

  const canSave = [nursing.treatments, nursing.comment].every(Boolean) || !isLoading

  const onRefetch = async () => await refetch()

  const onLoadTreatments = async keyword => {
    const treatData = await handleLoadTreatments(keyword).unwrap()
    if (!treatData.error) return treatData
  }

  const onRemoveNursingItem = (index) => {
    const values = [...nursing.treatments]
    values.splice(index, 1)
    setNursing({...nursing, treatments: values})
  }

  const onAddNursingItem = () => setNursing(prev => {
    return {
      ...prev,
      treatments: [...prev.treatments, {treatment: null, medicines: [{medicine: '', dosage: ''}]}]
    }
  })

  const onChangeNursingItem = (event, index) => {
    const values = [...nursing.treatments]
    values[index]['treatment'] = event
    setNursing({...nursing, treatments: values})
  }

  const onAddNursingMedItems = (index) => {
    const values = [...nursing.treatments]
    values[index]['medicines'] = [...values[index]?.medicines, {medicine: '', dosage: ''}]
    setNursing({...nursing, treatments: values})
  }

  const onRemoveNursingMedItems = (index, index2) => {
    const values = [...nursing.treatments]
    values[index]['medicines'].splice(index2, 1)
    setNursing({...nursing, treatments: values})
  }

  const handleChangeNursingMedItem = (event, index, index2) => {
    const values = [...nursing.treatments]
    const name = event.target.name
    values[index]['medicines'][index2][name] = event.target.value
    setNursing({...nursing, treatments: values})
  }

  // ********************************************************************************

  const onAddNursingItem2 = (index) => {
    const values = [...treatments]
    values[index]['medicines'] = [...values[index]?.medicines, {medicine: '', dosage: ''}]
    setTreatments(values)
  }

  const onRemoveNursingItem2 = (index, index2) => {
    const values = [...treatments]
    values[index]['medicines'].splice(index2, 1)
    setTreatments(values)
  }

  const handleChangeNursingItem = (event, index, index2) => {
    const values = [...treatments]
    const name = event.target.name
    values[index]['medicines'][index2][name] = event.target.value
    setTreatments(values)
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (data && !data?.isPublished) {
      const formData = await updateNursing({
        treatments,
        id: data?.id,
        comment: nursing.comment,
        arrivedAt: nursing.arrivedAt,
        leaveAt: nursing.leaveAt,
      })
      if (!formData?.error) {
        toast.success('Opération bien efféctuée.')
        navigate('/member/treatments/nursing', {replace: true})
        await onRefresh()
      }
    }
    else {
      if (canSave) {
        const formData2 = await updateNursing({
          treatments: nursing.treatments.map(item => { return { id: item.treatment?.id, medicines: item.medicines }}),
          id: data?.id,
          comment: nursing.comment,
          arrivedAt: nursing.arrivedAt,
          leaveAt: nursing.leaveAt,
        })
        if (!formData2?.error) {
          toast.success('Opération bien efféctuée.')
          navigate('/member/treatments/nursing', {replace: true})
          await onRefresh()
        }
      }
      else alert('Veuillez renseigner les champs obligatoires ❗')
    }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={7}>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title' style={cardTitleStyle}>
                  <i className='bi bi-calendar-event'/> Date & Heure d'arrivée du patient
                </h5>
                <div className='mb-3'>
                  <AppDatePicker
                    disabled={loader}
                    onChange={(date) => setNursing({...nursing, arrivedAt: date})}
                    value={nursing.arrivedAt} />
                </div>

                <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-heart-pulse'/> Traitement</h5>
                {!loader && data && !data?.isPublished && (
                  <div className='p-1 pb-3 mb-3'>
                    <h5 style={{ fontWeight: 800 }} className='text-danger text-uppercase'>
                      <i className='bi bi-clipboard-pulse'/> Premier(s) soin(s)
                    </h5>
                    {treatments.length > 0 && treatments.map((item, idx) =>
                      <div key={idx}>
                        <Row className='mt-3'>
                          <Col md={10} className='text-uppercase text-secondary fw-bold'>
                            <i className='bi bi-heart-pulse'/> {item.label}
                          </Col>
                          <Col md={2} className='text-end'>
                            <Button
                              type='button'
                              variant='info'
                              size='sm'
                              disabled={loader}
                              onClick={() => onAddNursingItem2(idx)}>
                              <i className='bi bi-plus text-light'/>
                            </Button>
                          </Col>
                          {/* Add item Button*/}

                          <div className='mt-2'>
                            {item?.medicines && item.medicines?.length > 0 && item.medicines?.map((med, i) =>
                              <Row key={i} className='pb-0'>
                                <AppInputField
                                  required
                                  autofocus
                                  name='medicine'
                                  value={med?.medicine}
                                  onChange={(e) => handleChangeNursingItem(e, idx, i)}
                                  disabled={loader}
                                  placeholder='-- * Produit (Médicament) --'
                                  className='text-uppercase mb-1 col-md-4' />
                                {/* Medicine's field */}

                                <AppInputField
                                  required
                                  name='dosage'
                                  value={med?.dosage}
                                  onChange={(e) => handleChangeNursingItem(e, idx, i)}
                                  disabled={loader}
                                  placeholder='-- * Dosage (Indications) --'
                                  className='text-uppercase mb-1 col-md-5' />
                                {/* Dosage's field */}

                                <Col md={3}>
                                  <ButtonGroup size='sm' className='w-100'>
                                    <Button
                                      type='button'
                                      variant='secondary'
                                      disabled={loader}
                                      onClick={() => onAddNursingItem2(idx)}>
                                      <i className='bi bi-plus'/>
                                    </Button>
                                    {item.medicines.length > 1 &&
                                      <Button
                                        type='button'
                                        variant='dark'
                                        disabled={loader}
                                        onClick={() => onRemoveNursingItem2(idx, i)}>
                                        <i className='bi bi-dash'/>
                                      </Button>}
                                  </ButtonGroup>
                                  {/* Button's group */}
                                </Col>
                              </Row>)}
                          </div>
                        </Row> <hr/>
                      </div>)}
                  </div>
                )}

                {!loader && data && data?.isPublished && (
                  <div className='mb-3'>
                    {nursing.treatments.length > 0 && nursing.treatments.map((item, idx) =>
                      <div key={idx} className='mb-3 nursing-form-items'>
                        <Row>
                          <Col md={2} className='mb-2'>{requiredField} Libellé</Col>
                          <Col md={8} className='mb-2'>
                            <AppAsyncSelectOptions
                              disabled={loader || isFetching}
                              value={item.treatment}
                              onChange={(e) => onChangeNursingItem(e, idx)}
                              className='text-uppercase'
                              loadOptions={onLoadTreatments}
                              defaultOptions={options}
                              placeholder='-- Traitement --' />
                          </Col>
                          <Col md={2} className='mb-2'>
                            <ButtonGroup className='w-100'>
                              <Button
                                type='button'
                                variant='success'
                                disabled={loader}
                                onClick={onAddNursingItem}>
                                <i className='bi bi-plus text-light'/>
                              </Button>
                              {nursing.treatments.length > 1 &&
                                <Button
                                  type='button'
                                  variant='secondary'
                                  disabled={loader}
                                  onClick={() => onRemoveNursingItem(idx)}>
                                  <i className='bi bi-dash text-light'/>
                                </Button>}
                            </ButtonGroup>
                          </Col>

                          {item.medicines.length > 0 && item.medicines.map((med, i) =>
                            <Row key={i} className='mb-2 m-auto'>
                              <Col md={4} className='mb-2'>
                                <Form.Control
                                  required
                                  name='medicine'
                                  value={med.medicine}
                                  onChange={(e) => handleChangeNursingMedItem(e, idx, i)}
                                  disabled={loader}
                                  placeholder='-- Produit (Médicament) --' />
                              </Col>
                              <Col md={6} className='mb-2'>
                                <Form.Control
                                  required
                                  name='dosage'
                                  value={med.dosage}
                                  onChange={(e) => handleChangeNursingMedItem(e, idx, i)}
                                  disabled={loader}
                                  placeholder='-- Dosage (Indications) --' />
                              </Col>
                              <Col md={2}>
                                <ButtonGroup className='w-100'>
                                  <Button
                                    type='button'
                                    variant='secondary'
                                    disabled={loader}
                                    onClick={() => onAddNursingMedItems(idx)}>
                                    <i className='bi bi-plus'/>
                                  </Button>
                                  {item.medicines.length > 1 &&
                                    <Button
                                      type='button'
                                      variant='dark'
                                      disabled={loader}
                                      onClick={() => onRemoveNursingMedItems(idx, i)}>
                                      <i className='bi bi-dash'/>
                                    </Button>}
                                </ButtonGroup>
                              </Col>
                            </Row>)}
                        </Row> <hr/>
                      </div>)}
                  </div>
                )}

                <AppFloatingTextAreaField
                  required
                  disabled={loader}
                  name='comment'
                  value={nursing.comment}
                  onChange={(e) => handleChange(e, nursing, setNursing)}
                  label='Suivi :'
                  placeholder='Commentaire...' />

                <h5 className='card-title' style={cardTitleStyle}>
                  <i className='bi bi-calendar-event-fill'/> Date & Heure de départ
                </h5>
                <div className='mb-3'>
                  <AppDatePicker
                    value={nursing.leaveAt}
                    onChange={(date) => setNursing({...nursing, leaveAt: date})}
                    disabled={loader} />
                </div>

                <div className='text-center'>
                  <Button type='submit' variant='light' disabled={isLoading || loader} onClick={onRefetch}>
                    {isLoading
                      ? <><Spinner animation='grow' size='sm'/> Chargement en cours</>
                      : <><i className='bi bi-arrow-clockwise'/> Actualiser</>}
                  </Button>
                  <Button type='submit' disabled={isLoading || loader}>
                    {isLoading
                      ? <><Spinner animation='grow' size='sm'/> Chargement en cours</>
                      : <>Valider</>}
                  </Button>
                </div>

                {isError && <AppMainError/>}
              </Card.Body>
            </Card>
          </Col>

          <Col>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-person'/> Patient(e)</h5>
                {!loader && data && data?.patient && <PatientInfos patient={data.patient} />}

                <div>
                  {!loader && data &&
                    <Link
                      to={`/member/treatments/consultations/${data?.consultation.id}/show`}
                      className='btn btn-success'>
                      <i className='bi bi-journal-medical'/> Fiche de consultation
                    </Link>}
                </div>

                {loader && <BarLoaderSpinner loading={loader}/>}
              </Card.Body>
              <Card.Img src={img} variant='bottom'/>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  )
}
