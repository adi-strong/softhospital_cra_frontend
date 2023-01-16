import {useState} from "react";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {ActsList} from "./ActsList";
import {ActCategoriesList} from "./ActCategoriesList";

const tabs = [
  {title: 'Actes médicaux', eventKey: 'acts'},
  {title: 'Catégories des actes médicaux', eventKey: 'categories'},
]

const Acts = () => {
  const [key, setKey] = useState('acts')

  return (
    <div>
      <AppHeadTitle title='Actes médicaux' />
      <AppBreadcrumb title='Actes médicaux' />
      <Card className='border-0'>
        <Card.Body className='pt-4'>
          <Tabs
            id='acts-tabs'
            activeKey={key}
            variant='tabs-bordered'
            onSelect={(k) => setKey(k)}
            className='pb-2'>
            {tabs.map((tab, idx) =>
              <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-2'>
                {tab.eventKey === 'acts'
                  ? <ActsList/>
                  : <ActCategoriesList/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Acts
