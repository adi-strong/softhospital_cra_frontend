import {Card, Tab, Tabs} from "react-bootstrap";
import {useState} from "react";
import {MedUnitConsumerList} from "./MedUnitConsumerList";
import {MedSubCategoriesList} from "./MedSubCategoriesList";

const tabs = [{title: 'Sous-catégories', eventKey: 'categories'}, {title: 'Unités de consommation', eventKey: 'unit'}]

export const MedicineCategoriesList2 = () => {
  const [key, setKey] = useState('categories')

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <Tabs
            activeKey={key}
            onSelect={(k) => setKey(k)}
            variant='tabs-bordered'
            id='categories-tab'>
            {tabs.map((tab, idx) =>
              <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-3'>
                {tab.eventKey === 'unit'
                  ? <MedUnitConsumerList/>
                  : <MedSubCategoriesList/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}
