import {useDispatch} from "react-redux";
import {useEffect, useState} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {ConsultationsList} from "../consultations/ConsultationsList";

const tabs = [{title: 'Consultations', eventKey: 'consultations'}, {title: 'Rendez-vous', eventKey: 'appointments'},]

const Appointments = () => {
  const dispatch = useDispatch()
  const [key, setKey] = useState('consultations')

  useEffect(() => {
    dispatch(onInitSidebarMenu('/treatments/appointments'))
  }, [dispatch])

  return (
    <>
      <AppHeadTitle title='Médecin (Rendez-vous)' />
      <AppBreadcrumb title='Médecin (Rendez-vous)' />
      <Card className='border-0'>
        <Card.Body>
          <Tabs
            id='appointments-tabs'
            activeKey={key}
            variant='tabs-bordered'
            onSelect={(k) => setKey(k)} className='pt-2'>
            {tabs.map((tab, idx) =>
              <Tab key={idx} eventKey={tab.eventKey} title={tab.title} className='pt-3'>
                {tab.eventKey === 'consultations'
                  ? <ConsultationsList/>
                  : <div/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Appointments
