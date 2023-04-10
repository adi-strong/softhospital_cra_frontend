import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Col, Row} from "react-bootstrap";
import {MedicineCategoriesList} from "./MedicineCategoriesList";
import {MedicineCategoriesList2} from "./MedicineCategoriesList2";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowDrugsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

const MedicineCategories = () => {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowDrugsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
