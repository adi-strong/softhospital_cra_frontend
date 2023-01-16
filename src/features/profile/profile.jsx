import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {UserProfile} from "./UserProfile";
import {UserProfileOverview} from "./UserProfileOverview";
import {useState} from "react";

const tabs = [
  {title: 'Profil Utilisateur', eventKey: 'profile'},
  {title: 'Modification du profil', eventKey: 'edits'},
  {title: 'Paramètres', eventKey: 'settings'},
  {title: 'Changer le mot de passe', eventKey: 'pass'},
]

const Profile = () => {
  const user = useSelector(selectCurrentUser)
  const [key, setKey] = useState('profile')

  const handleShowTab = (key) => {
    let element
    switch (key) {
      case 'edits':
        element = <p>edits</p>
        break
      case 'settings':
        element = <p>settings</p>
        break
      case 'pass':
        element = <p>pass</p>
        break
      default:
        element = <UserProfileOverview user={user} />
        break
    }
    return element
  }

  return (
    <>
      <AppHeadTitle title='Profil utilisateur' />
      <AppBreadcrumb title='Profil' />
      <section className='section profile'>
        <Row>
          <Col xl={4}>
            <Card className='border-0'>
              <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
                <UserProfile user={user} />
              </Card.Body>
            </Card>
          </Col>
          <Col xl={8}>
            <Card className='border-0'>
              <Card.Body className='pt-3'>
                <Tabs
                  id='profile'
                  variant='tabs-bordered'
                  activeKey={key}
                  onSelect={(k) => setKey(k)}>
                  {tabs.map((tab, idx) =>
                    <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-2'>
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

export default Profile
