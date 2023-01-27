import {useEffect, useState} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {useDispatch} from "react-redux";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, Card, Col, Row} from "react-bootstrap";
import {ParametersOverView} from "../parameters/ParametersOverView";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useGetSingleAgentQuery, useUpdateAgentMutation} from "./agentApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {useLazyGetServicesOptionsQuery} from "./serviceApiSlice";
import {useGetOfficesQuery} from "./officeApiSlice";
import {useGetDepartmentsQuery} from "./departmentApiSlice";
import toast from "react-hot-toast";
import {AgentForm} from "./AgentForm";

function EditAgent() {
  const dispatch = useDispatch(), navigate = useNavigate()
  const {agentId} = useParams()
  const {data, isSuccess: isDataSuccess, isLoading: isDataLoading, isFetching: isDataFetching, isError: isDataError} =
    useGetSingleAgentQuery(agentId)
  const [updateAgent, {isLoading: loading, isError, error, isSuccess: isSuccessAdded}] = useUpdateAgentMutation()
  const [getServicesOptions, {isLoading: servicesLoading, isFetching: servicesFetching}] =
    useLazyGetServicesOptionsQuery()
  const [offices, setOffices] = useState([])
  const [departments, setDepartments] = useState([])
  const [office, setOffice] = useState(null)
  const [service, setService] = useState(null)
  const [department, setDepartment] = useState(null)
  const [services, setServices] = useState([])
  const [validated, setValidated] = useState(false)
  const {data: officeData = [], isLoading, isSuccess} = useGetOfficesQuery('Offices')
  const {data: departmentData = [], isLoading: departmentLoading, isSuccess: success} =
    useGetDepartmentsQuery('Departments')
  const [agent, setAgent] = useState({
    name: '',
    lastName: '',
    firstName: '',
    sex: 'none',
    phone: '',
    email: '',
  })

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/staff/agents'))
  }, [dispatch])

  useEffect(() => {
    if (isDataSuccess && data) {
      setAgent({
        id: data.id,
        email: data?.email ? data.email : '',
        name: data.name,
        firstName: data?.firstName ? data.firstName : '',
        sex: data?.sex ? data.sex : 'none',
        lastName: data?.lastName ? data.lastName : '',
        phone: data?.phone ? data.phone : '',
      })
    }
  }, [isDataSuccess, data]) // Handle get agent's data

  let dataError
  if (isDataError) dataError =
    <Alert variant='danger'>
      <p>
        Une erreur est survenue. <br/>
        Veuillez soit recharger la page soit vous reconnecter <i className='bi bi-exclamation-triangle-fill'/>
      </p>
    </Alert>

  let apiErrors = {
    office: null,
    name: null,
    lastName: null,
    firstName: null,
    sex: null,
    phone: null,
    email: null}

  useEffect(() => {
    if (isSuccess && officeData) {
      setOffices(officeData.ids.map(id => {
        return {
          label: officeData.entities[id].title,
          value: `/api/offices/${officeData.entities[id].id}`
        }
      }))
    }
  }, [isSuccess, officeData]) // get offices data

  useEffect(() => {
    if (success && departmentData) {
      setDepartments(departmentData.ids.map(id => {
        return {
          label: departmentData.entities[id].name,
          value: departmentData.entities[id].id
        }
      }))
    }
  }, [success, departmentData]) // get all departments

  useEffect(() => {
    if (offices && data && isDataSuccess) {
      if (data?.office) {
        for (const key in offices) {
          if (offices[key].value === data.office['@id'])
            setOffice(offices[key])
        }
      }
    } // if agent's office exists
  }, [offices, data, isDataSuccess]) // Handle get agent's office

  async function onSelectDepartment(event) {
    setDepartment(event)
    setService(null)
    setServices([])
    if (event) {
      try {
        const res = await getServicesOptions(event.value).unwrap()
        if (res && res['hydra:member']) {
          const servicesData = res['hydra:member']
          const obj = servicesData.map(item => {
            return {
              label: item.name,
              value: `/api/services/${item.id}`,
            }
          })
          setServices(obj)
        }
      }
      catch (e) { toast.error(e.message) }
    }
  }

  useEffect(() => {
    const handleGetAgentService = async departmentId => {
      try {
        const res = await getServicesOptions(departmentId).unwrap()
        if (res && res['hydra:member']) {
          const servicesData = res['hydra:member']
          const obj = servicesData.map(item => {
            return {
              label: item.name,
              value: `/api/services/${item.id}`,
            }
          })
          setServices(obj)
        }
      }
      catch (e) { toast.error(e.message) }
    }

    if (departments && success && data?.service) {
      const departmentId = data.service?.department ? data.service.department.id : null
      if (departmentId) {
        for (const key in departments) {
          if (departments[key].value === departmentId) {
            setDepartment(departments[key])
            handleGetAgentService(departmentId)
          }
        }
      } // get agent's department
    }
  }, [departments, success, data, getServicesOptions]) // Handle get agent's department

  useEffect(() => {
    if (!servicesLoading && services && data && data?.service) {
      for (const key in services) {
        if (services[key].value === data.service['@id'])
          setService(services[key])
      }
    }
  }, [services, servicesLoading, data]) // handle get agent's service

  const canSave = [agent.name].every(Boolean) || !loading

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    apiErrors = {office: null, name: null, lastName: null, firstName: null, sex: null, phone: null, email: null}
    const form = e.currentTarget
    if (form.checkValidity() === false || canSave) {
      try {
        await updateAgent({...agent,
          office: offices ? office.value : null,
          service: service ? service.value : null})
      }
      catch (e) { toast.error(e.message) }
    }

    setValidated(true)
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  useEffect(() => {
    if (isSuccessAdded) {
      toast.success('Modification bien efféctuée.')
      navigate('/member/staff/agents')
    }
  }, [isSuccessAdded, navigate])

  return (
    <>
      <AppHeadTitle title='Agents | Modification' />
      <AppBreadcrumb title={`Agent `} links={[ {path: '/member/staff/agents', label: 'Liste des agents'} ]} />

      <section className='section profile'>
        <Row>
          <Col xl={4}>
            <Card className='border-0'>
              <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
                <ParametersOverView/>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className='border-0'>
              <Card.Body>
                <h5 className='card-title' style={cardTitleStyle}>
                  Agent {agent.name &&
                    <>
                      <span className='text-uppercase fw-bold'>
                      <i className='bi bi-quote me-1'/>
                        <i className='bi bi-person-vcard'/> {agent.name}
                        <i className='bi bi-quote mx-1'/>
                      </span>
                    </>}
                </h5>
                {data &&
                  <AgentForm
                    onSubmit={onSubmit}
                    departments={departments}
                    department={department}
                    services={services}
                    agent={agent}
                    setAgent={setAgent}
                    office={office}
                    service={service}
                    departmentLoading={departmentLoading}
                    offices={offices}
                    loading={loading}
                    isLoading={isLoading}
                    apiErrors={apiErrors}
                    onSelectDepartment={onSelectDepartment}
                    servicesFetching={servicesFetching}
                    servicesLoading={servicesLoading}
                    setOffice={setOffice}
                    setService={setService}
                    agentId={agentId}
                    validated={validated} />}

                {dataError && dataError}
                {(isDataLoading || isDataFetching) &&
                  <div style={{ marginTop: 50, marginBottom: 50 }}>
                    <BarLoaderSpinner loading={isDataLoading || isDataFetching}/>
                  </div>}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default EditAgent
