import {Badge, Button, Col, Modal, Row} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";

export const ShowSingleAct = ({ act, currency, onHide, show = false }) => {
  return (
    <>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton className='bg-light text-capitalize'>
          <Modal.Title><i className='bi bi-clipboard-plus-fill'/> {act?.wording}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='pe-3'>
            <Col md={4} className='text-capitalize mb-4'>
              <h5 className='card-title' style={cardTitleStyle}>Catégorie</h5>
              <span className='fw-bold'>{act?.category && act.category?.name}</span>

              <h5 className='card-title mt-4' style={cardTitleStyle}>Dénomination</h5>
              <span className='fw-bold'>{act?.wording}</span> <br/>
              Coût : {act?.cost} {currency && currency?.value} <br/>
              Prix : {act?.price} {currency && currency?.value}
            </Col>

            <Col md={8} className='bg-light' style={{ borderRadius: 6 }}>
              <h5
                className='card-title text-center'
                style={cardTitleStyle}><i className='bi bi-caret-down-fill'/> Procédures
              </h5>
              {act?.procedures && act.procedures.length > 0 && act.procedures.map((p, idx) =>
                <Row key={idx}>
                  <Col md={4}>
                    <h6 className="fw-bold text-capitalize"><i className='bi bi-clipboard2-pulse'/> {p?.item} :</h6>
                  </Col>
                  <Col md={8}>
                    {p?.children && p.children && p.children.length > 0 && p.children?.map((c, i) =>
                      <Badge key={i} bg='primary' className='me-1 mb-1'>
                        {c?.wording}
                      </Badge>)}
                  </Col>
                  <hr className='mb-2'/>
                </Row>)}
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
