import {useEffect, useMemo, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle} from "../../components";
import {useGetSinglePatientQuery} from "./patientApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import {PatientOverviewTab} from "./PatientOverviewTab";
import {EditPatientTab} from "./EditPatientTab";
import {PatientOverviewTab2} from "./PatientOverviewTab2";
import {useReactToPrint} from "react-to-print";
import {selectCurrentUser} from "../auth/authSlice";
import {allowActionsToPatients, allowShowPatientsPage} from "../../app/config";
import toast from "react-hot-toast";

function SinglePatient() {
  const dispatch = useDispatch(), { id } = useParams()
  const [key, setKey] = useState('details')
  const {data: patient, isLoading, isFetching, isError, refetch} = useGetSinglePatientQuery(parseInt(id))

  useEffect(() => { dispatch(onInitSidebarMenu('/member/patients')) }, [dispatch])

  const printRef = useRef()
  const handlePrint = useReactToPrint({content: () => printRef.current})

  const onRefresh = async () => await refetch()

  function onClick(name) {
    if (name === 'print') handlePrint()
    else onRefresh()
  }
  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  let tabs

  useEffect(() => {
    if (user && !allowShowPatientsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  tabs = useMemo(() => {
    if (user && allowActionsToPatients(user?.roles[0])) return [{
      title: 'Détails', eventKey: 'details'},
      {title: 'Modification', eventKey: 'edit'}]
    return [{title: 'Détails', eventKey: 'details'}]
  }, [user])

  return (
    <div className='section dashboard'>
      <AppHeadTitle title={`Patient(e)`} />
      <AppBreadcrumb title={`Patient(e)`} links={[{path: '/member/patients', label: 'Liste des patients'}]}/>

      <Row>
        <Col md={4}>
          <Card className='border-0'>
            <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
              <PatientOverviewTab
                loader={isFetching}
                patient={patient}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}/>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className='border-0'>
            <AppDropdownFilerMenu
              onClick={onClick}
              heading='Actions'
              items={[
                {label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh', action: '#'},
                {label: <><i className='bi bi-printer'/> Impression</>, name: 'print', action: '#'},
              ]}
            />

            <Card.Body>
              <div className='container-fluid' ref={printRef}>
                <Tabs
                  activeKey={key}
                  onSelect={(k) => setKey(k)}
                  variant='tabs-bordered'
                  id='patient-tabs'>
                  {tabs?.map((tab, idx) =>
                    <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-4'>
                      {tab.eventKey === 'edit'
                        ? <EditPatientTab
                          data={patient}
                          refetch={refetch}
                          isLoading={isLoading}
                          isError={isError}/>
                        : <PatientOverviewTab2
                          patient={patient}
                          isLoading={isLoading}
                          isFetching={isFetching}
                          isError={isError}
                          refetch={refetch}/>}
                    </Tab>)}
                </Tabs>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default SinglePatient
