import {useState} from "react";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {InvoicesList} from "./InvoicesList";
// import {UnpaidInvoicesList} from "./UnpaidInvoicesList";

const tabs = [{title: 'Toutes', key: 'all'}, {title: 'Conventionnés', key: 'invalids'}]

function Invoices() {
  const [key, setKey] = useState('all')

  return (
    <>
      <AppHeadTitle title='Finances : Factures' />
      <AppBreadcrumb title='Factures' />
      <Card className='border-0'>
        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>Liste de factures</h5>
          <Tabs
            onSelect={(k) => setKey(k)}
            activeKey={key}
            id='invoices-tabs'
            variant='tabs-bordered'>
            {tabs.map((tab, idx) =>
              <Tab key={idx} title={tab.title} eventKey={tab.key} className='pt-3'>
                {tab.key === 'all' && <InvoicesList/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Invoices
