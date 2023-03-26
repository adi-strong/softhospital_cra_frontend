import {Col, Row, Table} from "react-bootstrap";
import {entrypoint} from "../../app/store";
import moment from "moment";

export const PrintHospitalInfos = ({ hospital, invoice, document, patient, releasedDate, endDate }) => {
  return (
    <Row>
      {hospital &&
        <>
          <Col md={3}>
            <h5 className='text-uppercase card-title' style={{ fontWeight: 900 }}>{hospital?.denomination}</h5>
            <address className='text-capitalize'>{hospital?.address ? hospital.address : 'Adresse :'}</address>
            <p>{hospital?.tel ? hospital.tel : 'n° de téléphone :'}</p>
          </Col>

          <Col md={6}>
            <Table bordered striped className='w-100' style={{ fontSize: '0.7rem', marginTop: 19 }}>
              <tbody className='text-uppercase fw-bold text-end'>
                <tr>
                  <td>N° de facture</td>
                  <td>{invoice && `#${document}`}</td>
                </tr>
                <tr>
                  <td>Identifiant du patient</td>
                  <td>
                    {patient && patient?.id}
                  </td>
                </tr>
                <tr>
                  <td>Date de facturation</td>
                  <td>{patient && moment(releasedDate).calendar()}</td>
                </tr>
                <tr>
                  <td>Date d'échéance</td>
                  <td>--</td>
                </tr>
              </tbody>
            </Table>
          </Col>

          <Col md={3}>
            {hospital?.logo &&
              <img
                src={entrypoint+hospital.logo?.contentUrl}
                style={{ marginTop: 19 }}
                className='img-fluid'
                alt=''/>}
          </Col>
        </>}
    </Row>
  )
}
