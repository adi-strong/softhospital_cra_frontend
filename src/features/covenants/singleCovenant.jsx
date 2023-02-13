import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle, AppMainError} from "../../components";
import {Button, Card, Col, Form, InputGroup, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useGetSingleCovenantQuery} from "./covenantApiSlice";
import {CovenantOverview} from "./CovenantOverview";
import {SingleContract} from "./SingleContract";
import {CovenantPatientsList} from "./CovenantPatientsList";
import {useGetCovenantPatientsQuery} from "../patients/patientApiSlice";

const SingleCovenant = () => {
  const dispatch = useDispatch(), {id} = useParams()
  const [invoice, setInvoice] = useState({date: ''})
  const {data: covenant, isLoading, isError, isSuccess, refetch} = useGetSingleCovenantQuery(id)
  const {
    data: patients = [],
    isLoading: isPLoading,
    isFetching,
    isError: isPError,
    refetch: pRefetch,
    isSuccess: isPSuccess,
  } = useGetCovenantPatientsQuery(parseInt(id))

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/patients'))
  }, [dispatch])

  let errors
  if (isError) errors = <AppMainError/>

  const onCancelInvoiceSearch = () => setInvoice({date: ''})

  async function onRefresh() {
    await pRefetch()
    await refetch()
  } // refresh patients data

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
                <CovenantPatientsList
                  patients={patients}
                  isLoading={isPLoading}
                  isFetching={isFetching}
                  isError={isPError}
                  isSuccess={isPSuccess}
                  onRefresh={onRefresh} />
              </Card.Body>
            </Card>
          </Col> {/* list of patients */}

          <Col md={4}>
            <CovenantOverview
              covenant={covenant}
              isLoading={isLoading}
              isSuccess={isSuccess}
              errors={errors}/> {/* Logo */}

            <SingleContract covenant={covenant} isSuccess={isSuccess} isLoading={isLoading}/> {/* contract */}

            <Card className='border-0'>
              <Card.Body>
                <h2><i className='me-3 bi bi-search'/> Facture</h2> <hr className='mt-0'/>
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
