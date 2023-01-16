import {useState} from "react";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row, Tab, Tabs} from "react-bootstrap";
import {BedsList} from "./BedsList";
import {BedroomsList} from "./BedroomsList";
import {BedroomCategoriesList} from "./BedroomCategoriesList";

const tabs = [
  {title: 'List', eventKey: 'beds'},
  {title: 'Chambres', eventKey: 'bedrooms'},
]

const Beds = () => {
  const [key, setKey] = useState('beds')

  return (
    <>
      <AppHeadTitle title="Lits d'hospitalisation" />
      <AppBreadcrumb title="Lits d'hospitalisation" />
      <Row>
        <Col md={8}>
          <Card className='border-0'>
            <Card.Body className='pt-4'>
              <Tabs
                id='beds-tabs'
                activeKey={key}
                onSelect={(k) => setKey(k)}
                variant='tabs-bordered'
                className='pb-2'>
                {tabs.map((tab, idx) =>
                  <Tab key={idx} title={tab.title} eventKey={tab.eventKey} className='pt-2'>
                    {tab.eventKey === 'beds'
                      ? <BedsList/>
                      : <BedroomsList/>}
                  </Tab>)}
              </Tabs>
            </Card.Body>
          </Card>
        </Col> {/* beds and bedrooms tabs */}
        <Col md={4}>
          <Card className='border-0'>
            <Card.Body>
              <BedroomCategoriesList/>
            </Card.Body>
          </Card>
        </Col> {/* categories of bedrooms list */}
      </Row>
    </>
  )
}

export default Beds
