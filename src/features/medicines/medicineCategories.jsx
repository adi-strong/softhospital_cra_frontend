import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Col, Row} from "react-bootstrap";
import {MedicineCategoriesList} from "./MedicineCategoriesList";
import {MedicineCategoriesList2} from "./MedicineCategoriesList2";

const MedicineCategories = () => {
  return (
    <>
      <AppHeadTitle title='Pharmacie | Catégories' />
      <AppBreadcrumb
        title='Catégories des produits pharmaceutiques'
        links={[{path: '/member/drugstore/medicines', label: 'Liste des produits'}]} />

      <Row>
        <Col md={6}>
          <MedicineCategoriesList/>
        </Col> {/* list of categories */}

        <Col md={6}>
          <MedicineCategoriesList2/>
        </Col> {/* list of unit consumer */}
      </Row>
    </>
  )
}

export default MedicineCategories
