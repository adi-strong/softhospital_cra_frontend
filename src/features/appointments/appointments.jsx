import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {selectCurrentUser} from "../auth/authSlice";
import toast from "react-hot-toast";
import {useLazyLoadAgentConsultationsQuery} from "../consultations/consultationApiSlice";
import {AgentConsultationsList} from "./AgentConsultationsList";

const tabs = [{title: 'Consultations', eventKey: 'consultations'}, {title: 'Rendez-vous', eventKey: 'appointments'},]

const Appointments = () => {
  const dispatch = useDispatch()
  const [key, setKey] = useState('consultations')
  const [consultations, setConsultations] = useState([])
  const [loadAgentConsultations, {isLoading, isFetching, isError, isSuccess}] = useLazyLoadAgentConsultationsQuery()
  const { agent: agentId } = useSelector(selectCurrentUser)

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/appointments'))
  }, [dispatch])

  useEffect(() => {
    async function getConsultations(agentId) {
      try {
        const data = await loadAgentConsultations(agentId)
        if (!data.error) setConsultations(data?.data)
      }
      catch (e) { toast.error(e.message) }
    }

    if (agentId) getConsultations(agentId)
  }, [agentId, loadAgentConsultations])

  const onRefresh = async (agentId) => {
    if (agentId) {
      try {
        const data = await loadAgentConsultations(agentId)
        if (!data.error) setConsultations(data?.data)
      }
      catch (e) { toast.error(e.message) }
    }
  }

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
                  ? <AgentConsultationsList
                    consultations={consultations}
                    isFetching={isFetching}
                    isLoading={isLoading}
                    isSuccess={isSuccess}
                    isError={isError}
                    onRefresh={() => onRefresh(agentId)}/>
                  : <div/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Appointments
