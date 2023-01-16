import {useDispatch} from "react-redux";
import img from '../../assets/app/img/profile-img.jpg';
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {useEffect, useState} from "react";
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {PatientOverviewTab} from "./PatientOverviewTab";
import {EditPatientTab} from "./EditPatientTab";

const style = {
  fontSize: 24,
  fontWeight: 700,
  color: 'rgb(44, 56, 78)',
  margin: '10px 0 0'
}

const tabs = [{title: 'Détails', eventKey: 'details'}, {title: 'Modification', eventKey: 'edit'}]

function SinglePatient() {
  const dispatch = useDispatch()
  const [key, setKey] = useState('details')

  useEffect(() => {
    dispatch(onInitSidebarMenu('/patients'))
  }, [dispatch])

  return (
    <>
      <AppHeadTitle title='Patient(e)' />
      <AppBreadcrumb title='Patient' links={[{label: 'Patients', path: '/patients'}]} />
      <Row className='section'>
        <Col md={4}>
          <Card className='border-0'>
            <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
              <img src={img} className='rounded-circle' width={120} height={120} alt=''/>
              <h2 className="text-capitalize text-center" style={style}>
                Adivin LIFWA
              </h2>
              <h3 style={{ fontSize: 18 }} className='text-primary'>Privé(e)</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className='border-0'>
            <Card.Body className='pt-4'>
              <Tabs id='patient-tabs' activeKey={key} onSelect={(k) => setKey(k)} className='nav-pills pb-2'>
                {tabs.map((tab, idx) =>
                  <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-2'>
                    {tab.eventKey === 'details'
                      ? <PatientOverviewTab/>
                      : <EditPatientTab/>}
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
