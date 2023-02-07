import {useEffect, useState} from "react";
import {useGetOfficesQuery} from "./officeApiSlice";
import {useLazyGetServicesOptionsQuery} from "./serviceApiSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useAddNewAgentMutation} from "./agentApiSlice";
import {useGetDepartmentsQuery} from "./departmentApiSlice";
import {Card, Col, Row} from "react-bootstrap";
import {ParametersOverView} from "../parameters/ParametersOverView";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";
import {AgentForm} from "./AgentForm";

const AddAgent = () => {
  const dispatch = useDispatch(), navigate = useNavigate()
  const [agent, setAgent] = useState({
    wording: '',
    lastName: '',
    firstName: '',
    sex: 'none',
    phone: '',
    email: '',
  })
  const [addNewAgent, {isLoading: loading, isError, error, isSuccess: isSuccessAdded}] = useAddNewAgentMutation()
  const [getServicesOptions, {isLoading: servicesLoading, isFetching: servicesFetching}] =
    useLazyGetServicesOptionsQuery()
  const [office, setOffice] = useState(null)
  const [service, setService] = useState(null)
  const [department, setDepartment] = useState(null)
  const [services, setServices] = useState([])
  const [validated, setValidated] = useState(false)
  const {data: officeData = [], isLoading, isSuccess} = useGetOfficesQuery('Offices')
  const {data: departmentData = [], isLoading: departmentLoading, isSuccess: success} =
    useGetDepartmentsQuery('Departments')

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/staff/agents'))
  }, [dispatch])

  let offices = [], departments = [], apiErrors = {
    office: null,
    name: null,
    lastName: null,
    firstName: null,
    sex: null,
    phone: null,
    email: null}
  if (isSuccess) offices = officeData && officeData.ids.map(id => {
    return {
      label: officeData.entities[id].title,
      value: `/api/offices/${officeData.entities[id].id}`
    }
  })

  if (success) departments = departmentData && departmentData.ids.map(id => {
    return {
      label: departmentData.entities[id].name,
      value: departmentData.entities[id].id
    }
  })

  function onReset() {
    setOffice(null)
    setService(null)
    setDepartment(null)
    setAgent({
      name: '',
      lastName: '',
      firstName: '',
      sex: 'none',
      phone: '',
      email: '',
    })
  }

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
      catch (e) { }
    }
  }

  const canSave = [agent.name].every(Boolean) || !loading

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    apiErrors = {office: null, wording: null, lastName: null, firstName: null, sex: null, phone: null, email: null}
    const form = e.currentTarget
    if (form.checkValidity() === false || canSave) {
      try {
        await addNewAgent({...agent,
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
      <AppHeadTitle title='Agents | Ajouter un agent' />
      <AppBreadcrumb title="Ajout d'un agent" links={[ {path: '/member/staff/agents', label: 'Liste des agents'} ]} />

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
                  onReset={onReset}
                  apiErrors={apiErrors}
                  onSelectDepartment={onSelectDepartment}
                  servicesFetching={servicesFetching}
                  servicesLoading={servicesLoading}
                  setOffice={setOffice}
                  setService={setService}
                  validated={validated} />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default AddAgent
