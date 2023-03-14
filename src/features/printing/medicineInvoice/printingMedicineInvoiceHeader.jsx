import {Col, Container, Row} from "react-bootstrap";
import {entrypoint} from "../../../app/store";

const style = {
  border: '1px dashed #000',
  borderLeft: 'none',
  borderRight: 'none',
  borderTop: 'none',
}

export const PrintingMedicineInvoiceHeader = ({ hospital, isLoading, isSuccess, invoice, invoiceNumber, id }) => {
  return (
    <>
      <div className='printing-header bg-light'>
        <Container>
          <Row>
            <Col className='mb-3'>
              <h5>Logo</h5>
              <div className='mb-3'>
                {hospital && hospital?.logo &&
                  <img src={entrypoint+hospital.logo.contentUrl} width={120} height={120} alt=''/>}
              </div>

              <span style={{ fontWeight: 700 }} className='text-capitalize'>
                {hospital && hospital?.denomination}
              </span> <br/>
              <span>Code postal et ville :</span> <br/>
              <span>
                {hospital
                  ? hospital?.address
                    ? hospital.address
                    : 'Adresse :'
                  : 'Adresse :'}
              </span> <br/>
              <span>
                {hospital
                  ? hospital?.tel
                    ? hospital.tel
                    : 'Numéro de téléphone :'
                  : 'Numéro de téléphone :'}
              </span> <br/>
              <span>
                {hospital
                  ? hospital?.email
                    ? hospital.email
                    : 'Email :'
                  : 'Email :'}
              </span> <br/>
            </Col>

            <Col md={4}>
              <h5 className='text-capitalize'>
                {isLoading && 'Chargement en cours...'}
                {isSuccess && invoice && invoice?.released && invoice.released}
              </h5>

              <span style={{ fontWeight: 800 }}>{invoiceNumber || id}</span>

              <div style={{ marginTop: 100 }}/>

              <Row>
                <Col style={{ fontWeight: 700 }} className='mb-1'>Client(e)</Col>
                <Col md={7} style={style} className='mb-2'/>

                <Col style={{ fontWeight: 700 }} className='me-2 mb-1'>Adresse</Col>
                <Col md={7} style={style} className='mb-2'/>
              </Row>

              <Row>
                <Col style={{ fontWeight: 700 }} className='me-2 mb-1'>n°. Tél.</Col>
                <Col md={7} style={style} className='mb-2'/>
              </Row>

              <Row>
                <Col style={{ fontWeight: 700 }} className='me-2 mb-1'>Email</Col>
                <Col md={7} style={style} className='mb-2'/>
              </Row>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  )
}
