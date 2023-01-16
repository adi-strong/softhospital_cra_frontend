import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {useState} from "react";
import {ExamsList} from "./ExamsList";
import {ExamCategoriesList} from "./ExamCategoriesList";

const tabs = [{title: 'Examens', eventKey: 'exams'}, {title: 'Catégories des examens', eventKey: 'categories'}]

const Exams = () => {
  const [key, setKey] = useState('exams')

  return (
    <>
      <AppHeadTitle title='Examens' />
      <AppBreadcrumb title='Examens'/>
      <Card className='border-0'>
        <Card.Body className='pt-4'>
          <Tabs
            id='exams-tabs'
            activeKey={key}
            onSelect={(k) => setKey(k)}
            variant='tabs-bordered'
            className='pb-2'>
            {tabs.map((tab, idx) =>
              <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-2'>
                {tab.eventKey === 'exams'
                  ? <ExamsList/>
                  : <ExamCategoriesList/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Exams
