import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {useState} from "react";
import {TreatmentsList} from "./TreatmentsList";
import {TreatmentCategoriesList} from "./TreatmentCategoriesList";

const tabs = [
  {title: 'Liste de traitements disponibles', eventKey: 'treatments'},
  {title: 'Liste des catégories de traitements', eventKey: 'categories'},
]

const Treatments = () => {
  const [key, setKey] = useState('treatments')

  return (
    <>
      <AppHeadTitle title='Traitements' />
      <AppBreadcrumb title='Traitements' />
      <Card className='border-0'>
        <Card.Body>
          <Tabs
            id='treatments-tabs'
            variant='tabs-bordered'
            activeKey={key}
            onSelect={(k) => setKey(k)}
            className='pt-2'>
            {tabs.map((tab, idx) =>
              <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-3'>
                {tab.eventKey === 'treatments'
                  ? <TreatmentsList/>
                  : <TreatmentCategoriesList/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Treatments
