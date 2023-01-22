import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Alert, Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import img from '../../assets/app/img/default_hospital_img.jpg';
import {useGetSingleUserQuery} from "../users/userApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useEffect, useState} from "react";
import {DetailsParameters} from "./DetailsParameters";
import {Hospital} from "./Hospital";
import {ParametersForm} from "./ParametersForm";
import {entrypoint} from "../../app/store";

const tabs = [
  {title: 'Détails', eventKey: 'details'},
  {title: 'Hôpital', eventKey: 'hospital'},
  {title: 'Taux & Devise', eventKey: 'currency'},
]

const Parameters = () => {
  const user = useSelector(selectCurrentUser)
  const {hospital, fCurrency, sCurrency, rate} = useSelector(state => state.parameters)
  const {data: singleUser, isError} = useGetSingleUserQuery(user ? user : null)

  const [key, setKey] = useState('details')
  const [file, setFile] = useState(null)

  let content
  if (isError) content =
    <Alert variant='danger' className='text-center'>
      <p>
        Un problème est survenu lors du chargement de données. <br/>
        Veuillez actualiser la page ou vous reconnecter <i className='bi bi-exclamation-circle-fill'/>
      </p>
    </Alert>

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
    if (hospital && hospital?.logo && user && user.roles[0] !== 'ROLE_SUPER_ADMIN') {
      setFile({id: hospital.logo.id, contentUrl: hospital.logo.contentUrl})
    }
  }, [hospital, user])

  return (
    <>
      <AppHeadTitle title='Paramètres' />
      <AppBreadcrumb title='Paramètres' />
      <section className='section profile'>
        <Row>
          <Col xl={4}>
            <Card className='border-0'>
              <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
                <img
                  src={file ? `${entrypoint}${file.contentUrl}` : img}
                  alt="Profile"
                  className="rounded-circle"
                  width={120}
                  height={120}/>
                <h2 className='text-capitalize text-center'>
                  {hospital ? hospital?.unitName ? hospital.unitName : hospital.denomination : 'Inconnue'}
                </h2>
                {content}
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
