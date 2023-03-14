import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card} from "react-bootstrap";
import {OrdersList} from "./OrdersList";

function Orders() {
  return (
    <>
      <AppHeadTitle title='Ordonances' />
      <AppBreadcrumb title='Ordonnances' />
      <section className="section">
        <Card className='border-0'>
          <Card.Body>
            <OrdersList/>
          </Card.Body>
        </Card>
      </section>
    </>
  )
}

export default Orders
