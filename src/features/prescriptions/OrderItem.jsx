import {Button, Col, Form, Row} from "react-bootstrap";

export const OrderItem = ({ idx, order, onOrderChange, prescription, onRemoveOrderItem, loader = false}) => {
  return (
    <>
      <Row>
        <Col md={4} className='mb-3'>
          <Form.Group>
            <Form.Control
              disabled={loader}
              required
              autoFocus
              autoComplete='off'
              name='item'
              value={order.item}
              onChange={(e) => onOrderChange(e, idx)}
              placeholder='Prescription' />
          </Form.Group>
        </Col>

        <Col className='mb-3'>
          <Form.Group>
            <Form.Control
              disabled={loader}
              required
              autoComplete='off'
              name='value'
              value={order.value}
              onChange={(e) => onOrderChange(e, idx)}
              placeholder='Indication' />
          </Form.Group>
        </Col>

        {prescription.orders.length > 1 && (
          <Col md={2}>
            <Button
              disabled={loader}
              type='button'
              variant='light'
              className='w-100'
              onClick={() => onRemoveOrderItem(idx)}>
              <i className='bi bi-x text-danger'/>
            </Button>
          </Col>
        )}
      </Row>
    </>
  )
}
