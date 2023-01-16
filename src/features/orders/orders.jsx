import {AppBreadcrumb, AppDataTableStripped, AppHeadTitle, AppTHead} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {OrderItem} from "./OrderItem";
import {useState} from "react";
import {Order} from "./Order";

const orders = [
  {id: 1, patient: 'Adivin lifwa', createdAt: '2022-03-05 12:30'},
  {id: 2, patient: 'Romeo akondjaka', createdAt: '2023-01-01 15:33'},
]

function Orders() {
  const [id, setId] = useState(null)

  const handleClick = id => setId(id)

  function handleRefresh() {
  }

  return (
    <>
      <AppHeadTitle title='Ordonances' />
      <AppBreadcrumb title='Ordonnances' />
      <section className="section">
        <Row>
          <Col md={7}>
            <Card className='border-0'>
              <Card.Body>
                <Order id={id} setId={setId} />
              </Card.Body>
            </Card>
          </Col> {/* Medicine's order */}

          <Col md={5}>
            <Card className='border-0'>
              <Card.Body>
                {/* orders data ---------------------------------------------------------------------- */}
                <AppDataTableStripped
                  title="Liste d'ordonnances"
                  thead={<AppTHead isImg onRefresh={handleRefresh} img={<i className='bi bi-file-earmark-text'/>} items={[
                    {label: '#'},
                    {label: 'Patient(e)'},
                    {label: 'Date'},
                  ]}/>}
                  tbody={
                    <tbody>
                    {orders && orders.map(order =>
                      <OrderItem
                        key={order.id}
                        order={order}
                        onClick={() => handleClick(order.id)}/>)}
                    </tbody>
                  }/>
                {/* End orders data ------------------------------------------------------------------- */}
              </Card.Body>
            </Card>
          </Col> {/* list of orders */}
        </Row>
      </section>
    </>
  )
}

export default Orders
