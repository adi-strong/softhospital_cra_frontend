import {Badge, Button, Card, Col, Form, Row, Spinner} from "react-bootstrap";
import {useEffect, useMemo, useState} from "react";
import {AppFloatingTextAreaField, AppMainError} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import PatientInfos from "../patients/PatientInfos";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {Link, useNavigate} from "react-router-dom";
import {useUpdateNursingMutation} from "./nursingApiSlice";
import toast from "react-hot-toast";
import {useGetTreatmentsQuery} from "../treatments/treatmentApiSlice";
import {NurseTreatmentItem} from "./NurseTreatmentItem";
import img from '../../assets/app/img/medic_3.jpg';

export function NursingForm({ data, onRefresh, isError = false, loader = false}) {
  const navigate = useNavigate()
  const [nursing, setNursing] = useState({
    treatments: [{wording: 'Libellé', content: null}],
    comment: '',
    isCompleted: false
  })
  const [updateNursing, {isLoading}] = useUpdateNursingMutation()
  const {data: items = [], isFetching, isSuccess, isError: isItemsError, refetch} = useGetTreatmentsQuery('Treatment')

  useEffect(() => {
    if (!loader && data) {
      if (data?.isCompleted) navigate('/member/treatments/nursing', {replace: true})
      if (data?.isPublished) setNursing(prev => {
        return {
          ...prev,
          comment: data?.comment ? data.comment : '',
          isCompleted: data?.isCompleted ? data.isCompleted : false,
        }
      })
    }
  }, [loader, data, navigate])

  let treatments, options
  treatments = useMemo(() => !loader && data && data?.nursingTreatments
    ? data.nursingTreatments?.map(t => {
      return { id: t?.treatment.id, label: t?.treatment.wording }
    })
    : null, [loader, data])

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

  const onLoadTreatments = keyword => {
  }

  const onRemoveNursingItem = (index) => {
    const values = [...nursing.treatments]
    values.splice(index, 1)
    setNursing({...nursing, treatments: values})
  }

  const onAddNursingItem = () => setNursing(prev => {
    return {
      ...prev,
      treatments: [...prev.treatments, {wording: 'Libellé', content: null}]
    }
  })

  const onChangeNursingItem = (event, index) => {
    const values = [...nursing.treatments]
    values[index]['content'] = event
    setNursing({...nursing, treatments: values})
  }

  async function onSubmit(e) {
    e.preventDefault()
    if (data && !data?.isPublished) {
      const formData = await updateNursing({
        treatments,
        id: data?.id,
        comment: nursing.comment,
        isCompleted: nursing.isCompleted
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
          treatments: nursing.treatments.map(item => { return { id: item.content ? item.content?.id : 0 }}),
          id: data?.id,
          comment: nursing.comment,
          isNursingCompleted: nursing.isCompleted
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
                <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-heart-pulse'/> Traitement</h5>
                {!loader && data && !data?.isPublished && (
                  <div style={{ border: '1px solid #fff7f7' }} className='p-1 pb-3 mb-3'>
                    <h5 style={{ fontWeight: 800 }} className='text-danger'>
                      <i className='bi bi-clipboard-pulse'/> Premier(s) soin(s)
                    </h5>
                    {treatments && treatments?.map((item, idx) =>
                      <Badge
                        key={idx}
                        bg='danger'
                        className='p-3 shadow-lg me-2 mt-2 text-uppercase'
                        style={{ fontWeight: 800 }}>
                        <i className='bi bi-lungs'/> {item?.label}
                      </Badge>)}

                    {!loader && data && data?.isPublished && (
                      <>
                        Traitement ici.
                      </>
                    )}
                  </div>
                )}

                {!loader && data && data?.isPublished && (
                  <div className='mb-3'>
                    <div className='text-end'>
                      <Button
                        type='button'
                        variant='light'
                        className='border-0 bg-transparent'
                        size='sm'
                        disabled={isFetching || isLoading || loader}
                        onClick={onRefetch}>
                        {isFetching && <Spinner animation='border' size='sm'/>}
                        {!isFetching && <i className='bi bi-arrow-clockwise'/>}
                      </Button>
                    </div>
                    {nursing.treatments && nursing.treatments.map((item, idx) => (
                      <Row key={idx} className='mt-3'>
                        <NurseTreatmentItem
                          idx={idx}
                          items={nursing.treatments}
                          loader={loader || isLoading || isFetching}
                          options={options}
                          item={item}
                          onChangeNursingItem={onChangeNursingItem}
                          onRemoveItem={onRemoveNursingItem}
                          onLoadTreatments={onLoadTreatments} />
                      </Row>
                    ))}

                    <Button
                      type='button'
                      variant='info'
                      className='d-block w-100 mt-3'
                      onClick={onAddNursingItem}
                      disabled={loader || isLoading || isFetching}>
                      <i className='bi bi-plus'/>
                    </Button>
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

                {!loader && data && data?.isPublished && !data?.isCompleted && (
                  <Form.Group className='mb-3'>
                    <Form.Check
                      id='isCompleted'
                      label={<span className='text-primary'>
                        Clôturer le traitement <i className='bi bi-question-circle text-warning'/></span>}
                      name='isCompleted'
                      value={nursing.isCompleted}
                      onChange={(e) => handleChange(e, nursing, setNursing)}
                      checked={nursing.isCompleted} />
                  </Form.Group>
                )}

                <div className='text-center'>
                  <Button type='button' variant='light' className='me-1' disabled={loader || isLoading} onClick={onRefresh}>
                    {loader
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
