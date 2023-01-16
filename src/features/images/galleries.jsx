import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {useState} from "react";
import {MainGalleryList} from "./MainGalleryList";
import {PersonalGalleryList} from "./PersonalGalleryList";

const tabs = [{title: 'Principales', eventKey: 'main'}, {title: 'Personnelles', eventKey: 'personals'}]

function Galleries() {
  const [key, setKey] = useState('main')

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
