import {useEffect, useState} from "react";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Tab, Tabs} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {InvoicesList} from "./InvoicesList";
import {CovenantInvoicesList} from "../invoices/CovenantInvoicesList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowFinancesPage} from "../../app/config";
import toast from "react-hot-toast";
// import {UnpaidInvoicesList} from "./UnpaidInvoicesList";

const tabs = [{title: 'Toutes', key: 'all'}, {title: 'Conventionnés', key: 'invalids'}]

function Invoices() {
  const [key, setKey] = useState('all')

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowFinancesPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
                {tab.key === 'all'
                  ? <InvoicesList/>
                  : <CovenantInvoicesList/>}
              </Tab>)}
          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default Invoices
