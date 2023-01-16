import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppDataTableBorderless, AppHeadTitle, AppTHead} from "../../components";
import {Button, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {PatientItem} from "../patients/PatientItem";
import {patients} from "../patients/patients";
import img from '../../assets/app/img/default_logo.png';
import file from '../../assets/app/docs/mercato.pdf';
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {Link} from "react-router-dom";
import {handleChange} from "../../services/handleFormsFieldsServices";

const SingleCovenant = () => {
  const dispatch = useDispatch()
  const [keywords, setKeywords] = useState({search: ''})
  const [invoice, setInvoice] = useState({date: ''})

  useEffect(() => {
    dispatch(onInitSidebarMenu('/patients'))
  }, [dispatch])

  const onCancelInvoiceSearch = () => setInvoice({date: ''})

  function onRefresh() {
  } // refresh patients data

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  function handleSearchInvoice(e) {
    e.preventDefault()
  } // search invoice's amount

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Organisme' />
      <AppBreadcrumb title='Back Office Pro' links={[
        {label: 'Patients', path: '/patients'},
        {label: 'Conventions', path: '/patients/covenants'},
      ]} />
      <div className="top-selling">
        <Row>
          <Col md={8}>
            <Card className='border-0'>
              <Card.Body>
                <AppDataTableBorderless
                  isStriped
                  title='Patients'
                  overview={
                    <>
                      <p>
                        {patients.length < 1
                          ? 'Aucun(e) patient(e) enregistré(e).'
                          : <>Il y a actuellement <code>{patients.length.toLocaleString()}</code> patient(s) enregistrés :</>}
                      </p>
                      <Col md={6}>
                        <Link
                          to='/patients/add'
                          title='Enregistrer un(e) patient(e)'
                          className='btn btn-primary mb-1 me-1'>
                          <i className='bi bi-plus'/> Ajouter
                        </Link>
                        <button type="button" className="btn btn-info mb-1" disabled={patients.length < 1}>
                          <i className='bi bi-printer'/> Impression
                        </button>
                      </Col> {/* add new patient and printing's launch button */}
                      <Col className='text-md-end'>
                        <form onSubmit={handleSubmit}>
                          <InputGroup>
                            <Form.Control
                              placeholder='Votre recherche ici...'
                              aria-label='Votre recherche ici...'
                              autoComplete='off'
                              disabled={patients.length < 1}
                              name='search'
                              value={keywords.search}
                              onChange={(e) => handleChange(e, keywords, setKeywords)} />
                            <Button type='submit' variant='secondary' disabled={patients.length < 1}>
                              <i className='bi bi-search'/>
                            </Button>
                          </InputGroup>
                        </form>
                      </Col> {/* search form for patients */}
                    </>
                  }
                  thead={<AppTHead isImg img={<i className='bi bi-image'/>} onRefresh={onRefresh} items={[
                    {label: '#'},
                    {label: 'Nom'},
                    {label: 'Âge'},
                    {label: 'Sexe'},
                    {label: 'État-civil'},
                    {label: <i className='bi bi-question-circle'/>},
                  ]} />}
                  tbody={
                    <tbody>
                    {patients && patients?.map(patient => <PatientItem key={patient.id} patient={patient}/>)}
                    </tbody>
                  } />
              </Card.Body>
            </Card>
          </Col> {/* list of patients */}
          <Col md={4}>
            <Card className='border-0'>
              <Card.Body className='text-center'>
                <h5 className="card-title" style={cardTitleStyle}>Logo</h5>
                <img src={img} alt=''/>
              </Card.Body>
            </Card> {/* Logo */}
            <Card className='border-0'>
              <Card.Body className='text-center'>
                <h5 className="card-title" style={cardTitleStyle}>Fichier du contrat</h5>
                <p className='text-warning'>
                  <i className='bi bi-file-earmark-text me-1'/>
                  <a href={file} target='_blank' rel='noreferrer' className='text-warning'>contrat.pdf</a>
                </p>
              </Card.Body>
            </Card> {/* contract */}

            <Card className='border-0'>
              <Card.Body className='text-center'>
                <h5 className="card-title" style={cardTitleStyle}>Paiement factures</h5>
                <form onSubmit={handleSearchInvoice}>
                  <InputGroup>
                    <Button type='button' variant='secondary' onClick={onCancelInvoiceSearch}>
                      <i className='bi bi-x'/>
                    </Button>
                    <Form.Control
                      type='date'
                      name='date'
                      value={invoice.date}
                      onChange={(e) => handleChange(e, invoice, setInvoice)} />
                    <Button type='submit' disabled={!invoice.date}><i className='bi bi-search'/></Button>
                  </InputGroup>
                </form>
              </Card.Body>
            </Card> {/* contract */}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SingleCovenant
