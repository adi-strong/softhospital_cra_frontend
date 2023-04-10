import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import {useGetSingleUserQuery} from "../users/userApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useEffect, useState} from "react";
import {DetailsParameters} from "./DetailsParameters";
import {Hospital} from "./Hospital";
import {ParametersForm} from "./ParametersForm";
import {ParametersOverView} from "./ParametersOverView";
import {useNavigate} from "react-router-dom";
import {allowShowParametersPage} from "../../app/config";
import toast from "react-hot-toast";

const tabs = [
  {title: 'Détails', eventKey: 'details'},
  {title: 'Hôpital', eventKey: 'hospital'},
  {title: 'Taux & Devise', eventKey: 'currency'},
]

const Parameters = () => {
  const user = useSelector(selectCurrentUser)
  const {hospital, fCurrency, sCurrency, rate} = useSelector(state => state.parameters)
  const {data: singleUser} = useGetSingleUserQuery(user ? user : null)

  const [key, setKey] = useState('details'), navigate = useNavigate()

  const handleShowTab = (key) => {
    let element
    switch (key) {
      case 'details':
        element =
          <DetailsParameters
            user={singleUser}
            hospital={hospital}
            fCurrency={fCurrency}
            sCurrency={sCurrency}
            rate={rate}/>
        break
      case 'hospital':
        element = <Hospital user={user}/>
        break
      case 'currency':
        element = <ParametersForm/>
        break
      default:
        element = <DetailsParameters user={singleUser}/>
        break
    }
    return element
  }

  useEffect(() => {
    if (user && !allowShowParametersPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Paramètres' />
      <AppBreadcrumb title='Paramètres' />
      <section className='section profile'>
        <Row>
          <Col xl={4}>
            <Card className='border-0'>
              <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
                <ParametersOverView user={user} />
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card className='border-0'>
              <Card.Body className='pt-3'>
                <Tabs
                  id='parameters-tabs'
                  variant='tabs-bordered'
                  activeKey={key}
                  onSelect={(k) => setKey(k)}>
                  {tabs.map((tab, idx) =>
                    <Tab
                      key={idx} title={tab.title}
                      eventKey={tab.eventKey}
                      className='pt-2'>
                      {handleShowTab(tab.eventKey)}
                    </Tab>)}
                </Tabs>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </>
  )
}

export default Parameters
