import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {useEffect, useState} from "react";
import {MainGalleryList} from "./MainGalleryList";
import {PersonalGalleryList} from "./PersonalGalleryList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowGalleryPage} from "../../app/config";
import toast from "react-hot-toast";

const tabs = [{title: 'Principales', eventKey: 'main'}, {title: 'Personnelles', eventKey: 'personals'}]

function Galleries() {
  const [key, setKey] = useState('main')

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowGalleryPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Galleries' />
      <AppBreadcrumb title='Galleries Images' />
      <Card className='border-0'>
        <Card.Body>
          <Tabs
            id='galleries-tabs'
            variant='tabs-bordered'
            className='pt-2'
            activeKey={key}
            onSelect={(k) => setKey(k)}>
            {tabs.map((tab, idx) =>
              <Tab
                key={idx}
                title={tab.title}
                eventKey={tab.eventKey}
                className='pt-3'>
                {tab.eventKey === 'main'
                  ? <MainGalleryList/>
                  : <PersonalGalleryList/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Galleries
