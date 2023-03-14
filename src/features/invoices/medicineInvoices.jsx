import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {MedicineInvoicesList} from "./MedicineInvoicesList";
import {useSelector} from "react-redux";

function MedicineInvoices() {
  const { fCurrency } = useSelector(state => state.parameters)

  return (
    <>
      <AppHeadTitle title='Phramacie | Factures' />
      <AppBreadcrumb
        title='Factures ventes et achats'
        links={[{path: '/member/drugstore/medicines', label: 'Liste des produits'}]} />

      <Row>
        <Col md={6}>
          <Card className='border-0'>
            <Card.Body>
              <MedicineInvoicesList currency={fCurrency}/>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className='border-0'>
            <Card.Body>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default MedicineInvoices
