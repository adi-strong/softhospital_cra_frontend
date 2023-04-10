import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {useEffect, useState} from "react";
import {DrugstoreForm1} from "./DrugstoreForm1";
import {DrugstoreForm2} from "./DrugstoreForm2";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowDrugsPage} from "../../app/config";
import toast from "react-hot-toast";

function DrugstoreSupply() {
  const [invoice, setInvoice] = useState({
    released: new Date(),
    document: '',
    amount: 0.00,
    provider: null,
    currency: {value: '$', label: "'(US) United States of America ' $ '"},
  })

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowDrugsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Pharmacie | Approvisionnement' />
      <AppBreadcrumb title='Approvisionnement de produits pharmaceutiques' links={[
        {label: 'Liste des produits', path: '/member/drugstore/medicines'}
      ]} />

      <Row>
        <Col md={8}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-file-check'/> Facture</h5>
              <DrugstoreForm1
                total={total}
                setTotal={setTotal}
                items={items}
                setItems={setItems}
                invoice={invoice}
                setInvoice={setInvoice} />
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='border-0'>
            <Card.Body>
              <DrugstoreForm2
                total={total}
                setTotal={setTotal}
                invoice={invoice}
                items={items}
                setItems={setItems} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default DrugstoreSupply
