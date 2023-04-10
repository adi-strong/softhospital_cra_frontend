import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {AppointmentsList2} from "./AppointmentsList2";
import {allowShowAppointmentsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

const tabs = [{title: 'Rendez-vous', eventKey: 'consultations'}, /*{title: 'Calendrier', eventKey: 'appointments'}*/]

const Appointments = () => {
  const dispatch = useDispatch()
  const [key, setKey] = useState('consultations')
  const [id, setId] = useState(null)
  const { user } = useSelector(state => state.auth)

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/appointments'))
    if (user && user?.agent) setId(user.agent)
  }, [dispatch, user])

  const navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowAppointmentsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
                  ? <AppointmentsList2 id={id}/>
                  : <div/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Appointments
