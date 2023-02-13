import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {MedicinesList2} from "./MedicinesList2";
import {MedSalesForm} from "./MedSalesForm";

const MedicinesInvoicing = () => {
  return (
    <>
      <AppHeadTitle title='Pharmacie | Facturation' />
      <AppBreadcrumb
        title='Facturation produit(s)'
        links={[{path: '/member/drugstore/medicines', label: 'Liste des produits'}]} />

      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body>
              <MedSalesForm/>
            </Card.Body>
          </Card>
        </Col> {/* sale's form */}

        <Col md={5}>
          <MedicinesList2/>
        </Col> {/* drugstore */}
      </Row>
    </>
  )
}

export default MedicinesInvoicing
