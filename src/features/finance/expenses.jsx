import {
  AppBreadcrumb,
  AppHeadTitle
} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {ExpenseCategoriesList} from "./ExpenseCategoriesList";
import {ExpensesList} from "./ExpensesList";
import Box from "./Box";
import {useGetBoxQuery} from "./boxApiSlice";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowFinancesPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

function Expenses() {
  const {data: boxes = [], isSuccess: isDone} = useGetBoxQuery('Box')

  let boxId
  if (isDone) boxId = boxes && boxes.entities[boxes.ids[0]]['@id']
  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowFinancesPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Finances : Dépenses' />
      <AppBreadcrumb title='Dépenses' />
      <Row>
        <Col md={8}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title mb-3' style={cardTitleStyle}>Liste de dépenses</h5>
              <Box/>
              <ExpensesList boxId={boxId}/>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className='border-0'>
            <Card.Body>
              <ExpenseCategoriesList/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default Expenses
