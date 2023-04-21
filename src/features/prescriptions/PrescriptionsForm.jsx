import {Button, Card, Col, Form, InputGroup, Row, Table} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useEffect, useMemo, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AppAsyncSelectOptions, AppMainError} from "../../components";
import toast from "react-hot-toast";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";
import {requiredField} from "../covenants/addCovenant";
import {useGetMedicinesQuery, useLazyHandleLoadMedicinesOptionsQuery} from "../medicines/medicineApiSlice";
import {useUpdatePrescriptionMutation} from "./prescriptionApiSlice";
import PatientInfos from "../patients/PatientInfos";

export function PrescriptionsForm({ data, loader, isError, onRefresh }) {
  let lab, options
  lab = useMemo(() => {
    if (data && data?.lab) return data.lab
    return null
  }, [data])

  const [handleLoadMedicinesOptions] = useLazyHandleLoadMedicinesOptionsQuery()
  const {data: medicines, isSuccess, isFetching, isError: isErr} = useGetMedicinesQuery('Drugstore')
  if (isErr) toast.error('Erreur lors du chargement des produits.')
  options = useMemo(() => {
    if (isSuccess && medicines) {
      return medicines?.map(medicine => {
        return {
          id: medicine?.id,
          label: medicine?.wording,
          value: medicine['@id'],
        }
      })
    }
    return []
  }, [isSuccess, medicines])
  const navigate = useNavigate()

  const [orders, setOrders] = useState([{medicine: null, dosage: ''}])
  const [check, setCheck] = useState(false)
  const [others, setOthers] = useState([])
  const [descriptions, setDescriptions] = useState('')
  const [updatePrescription, {isLoading}] = useUpdatePrescriptionMutation()

  async function onLoadExam(keyword) {
    try {
      const search = await handleLoadMedicinesOptions(keyword).unwrap()
      if (!search.error) return search
    } catch (e) { }
  }
  const handleChangeMedicine = (event, index) => {
    const values = [...orders]
    values[index]['medicine'] = event
    setOrders(values)
  }

  const onAddItem = () => setOrders([...orders, {medicine: null, dosage: ''}])

  useEffect(() => {
    if (!check) setOthers([])
  }, [check])

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const submit = await updatePrescription({
        id: data?.id,
        orders: orders && orders.length > 0 ? orders.map(o => o.medicine ? o : null) : null,
        others: others && others.length > 0 ? others.map(o => o) : null,
        descriptions})
      if (!submit.error) {
        toast.success('Prescription bien efféctuée.')
        onRefresh()
        navigate('/member/orders', {replace: true})
      }
    } catch (e) { }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <Row>
          <Col md={3}>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title text-md-center' style={cardTitleStyle}>
                  <i className='bi bi-person'/> Patient(e)
                </h5>
                {loader && <BarLoaderSpinner loading={loader}/>}
                {!(loader || isError) && data && data?.patient && <PatientInfos patient={data.patient}/>}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title' style={cardTitleStyle}>Formulaire de prescription</h5>
                {isError && <AppMainError/>}
                {loader && <BarLoaderSpinner loading={loader}/>}
                {!(isError || loader) && lab &&
                  <>
                    {orders && orders.length > 0 && orders.map((o, idx) =>
                      <Row key={idx} className='mb-2'>
                        <Col className='mb-1'>
                          <AppAsyncSelectOptions
                            onChange={(e) => handleChangeMedicine(e, idx)}
                            className='text-capitalize'
                            value={o.medicine}
                            disabled={isFetching || isLoading}
                            label={<>Produit {requiredField}</>}
                            loadOptions={onLoadExam}
                            defaultOptions={options} />
                        </Col>
                        <Col className='mb-1'>
                          <Form.Label htmlFor='dosage'>Dosage / Posologie</Form.Label>
                          <InputGroup>
                            <Form.Control
                              required
                              disabled={isLoading}
                              autoComplete='off'
                              id='dosage'
                              name='dosage'
                              value={o.dosage}
                              onChange={(e) => onArrayChange(e, idx, orders, setOrders)} />
                            <Button
                              type='button'
                              variant='info'
                              disabled={isFetching || loader || isLoading}
                              onClick={onAddItem}>
                              <i className='bi bi-plus'/>
                            </Button>
                            {orders.length > 1 &&
                              <Button
                                type='button'
                                variant='dark'
                                disabled={loader || isFetching || isLoading}
                                onClick={() => onRemoveArrayClick(idx, orders, setOrders)}>
                                <i className='bi bi-dash'/>
                              </Button>}
                          </InputGroup>
                        </Col>
                      </Row>)}
                  </>}

                <Form.Check
                  id='check'
                  name='check'
                  value={check}
                  checked={check}
                  disabled={loader || isFetching || isLoading}
                  onChange={() => setCheck(!check)}
                  label='Ajout hors stock (écrire)' />
                {check &&
                  <div className='mt-3'>
                    {others && others.length > 0 && others.map((o, idx) =>
                      <Row key={idx} className='mb-1'>
                        <Col className='mb-2'>
                          <Form.Label htmlFor='medicine'>Produit {requiredField}</Form.Label>
                          <Form.Control
                            required
                            autoComplete='off'
                            id='medicine'
                            name='medicine'
                            value={o?.medicine}
                            onChange={(e) => onArrayChange(e, idx, others, setOthers)}
                            disabled={loader || isFetching || isLoading} />
                        </Col>
                        <Col className='mb-2'>
                          <Form.Label htmlFor='medicine'>Dosage / Posologie</Form.Label>
                          <InputGroup>
                            <Form.Control
                              autoComplete='off'
                              id='dosage'
                              name='dosage'
                              value={o?.dosage}
                              onChange={(e) => onArrayChange(e, idx, others, setOthers)}
                              disabled={loader || isFetching || isLoading} />
                            <Button
                              type='button'
                              variant='dark'
                              disabled={isLoading}
                              onClick={() => onRemoveArrayClick(idx, others, setOthers)}>
                              <i className='bi bi-dash'/>
                            </Button>
                          </InputGroup>
                        </Col>
                      </Row>)}
                    <Button
                      type='button'
                      className='d-block mt-2 w-100 mb-3'
                      variant='info'
                      disabled={isLoading}
                      onClick={() => onAddArrayClick({medicine: '', dosage: ''}, others, setOthers)}>
                      <i className='bi bi-plus'/>
                    </Button>
                  </div>} <hr/>

                <div className='mb-3'>
                  <Form.Label htmlFor='descriptions'>
                    <i className='bi bi-exclamation-triangle'/> Laisser une remarque (note du médecin) :
                  </Form.Label>
                  <Form.Control
                    as='textarea'
                    id='descriptions'
                    name='descriptions'
                    value={descriptions}
                    onChange={({target}) => setDescriptions(target.value)}
                    disabled={isLoading || loader} />
                </div>

                <div className='text-end'>
                  <Button type='submit' disabled={isLoading}>
                    <i className='bi bi-check me-1'/>
                    Valider
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col md={3}>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title mb-3 text-md-center' style={cardTitleStyle}>Résultats d'analyses</h5>
                {loader && <BarLoaderSpinner loading={loader}/>}

                {lab && !(loader || isError) &&
                  <>
                    <Table borderless striped className='text-center' style={{ fontSize: '0.7rem' }}>
                      <thead>
                      <tr>
                        <th>Examen</th>
                        <th>Résultat</th>
                      </tr>
                      </thead>
                      <tbody>
                      {lab?.results && lab.results?.map((r, idx) =>
                        <tr key={idx}>
                          <td>{r?.exam}</td>
                          <td>{r?.result}</td>
                        </tr>)}
                      </tbody>
                    </Table>

                    <div className='text-md-center'>
                      <Link to={`/member/treatments/lab/${lab?.id}/show`} className='text-decoration-none mt-3 text-center'>
                        ↪ Voir plus
                      </Link>
                    </div>
                  </>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </>
  )
}
