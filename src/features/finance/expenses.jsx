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

function Expenses() {
  const {data: boxes = [], isSuccess: isDone} = useGetBoxQuery('Box')

  let boxId
  if (isDone) boxId = boxes && boxes.entities[boxes.ids[0]]['@id']

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
