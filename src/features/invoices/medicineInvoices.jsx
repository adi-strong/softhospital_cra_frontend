import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {MedicineInvoicesList} from "./MedicineInvoicesList";
import {useSelector} from "react-redux";
import {SupplyInvoicesList} from "../medicines/SupplyInvoicesList";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowDrugsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

function MedicineInvoices() {
  const { fCurrency } = useSelector(state => state.parameters)

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowDrugsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
              <SupplyInvoicesList/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default MedicineInvoices
