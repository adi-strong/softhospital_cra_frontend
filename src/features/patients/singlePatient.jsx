import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useGetSinglePatientQuery} from "./patientApiSlice";
import {useParams} from "react-router-dom";
import {PatientOverviewTab} from "./PatientOverviewTab";
import {EditPatientTab} from "./EditPatientTab";
import {PatientOverviewTab2} from "./PatientOverviewTab2";

const tabs = [{title: 'Détails', eventKey: 'details'}, {title: 'Modification', eventKey: 'edit'}]

function SinglePatient() {
  const dispatch = useDispatch(), { id } = useParams()
  const [key, setKey] = useState('details')
  const {data: patient, isLoading, isFetching, isError, refetch} = useGetSinglePatientQuery(parseInt(id))

  useEffect(() => { dispatch(onInitSidebarMenu('/member/patients')) }, [dispatch])

  return (
    <>
      <AppHeadTitle title={`Patient(e)`} />
      <AppBreadcrumb title={`Patient(e)`} links={[{path: '/member/patients', label: 'Liste des patients'}]}/>

      <Row>
        <Col md={4}>
          <Card className='border-0'>
            <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
              <PatientOverviewTab
                patient={patient}
                isLoading={isLoading}
                isFetching={isFetching}
                isError={isError}/>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className='border-0'>
            <Card.Body>
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
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default SinglePatient
