import {AppModal} from "../../components";
import {RowContent} from "../patients/PatientOverviewTab";
import {Badge, Col, Row} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {usernameFiltered} from "../../components/AppNavbar";
import {useMemo} from "react";

const style = {fontWeight: 800}

export const ShowMedicineModal = ({show, onHide, data, currency}) => {
  let medicine = useMemo(() => data, [data])

  return (
    <>
      <AppModal
        show={show}
        onHide={onHide}
        size='xl'
        className='bg-light'
        title={medicine?.wording
          ? <span className='text-capitalize text-primary' style={style}>
              <i className='bi bi-capsule'/> {medicine.wording}</span>
          : ''}>
        <Row>
          <Col>
            <h2 className='card-title mb-3' style={cardTitleStyle}>Description</h2>
            <RowContent
              className=''
              label={<><i className='bi bi-calendar-event'/> Enregistrement</>}
              body={medicine?.createdAt ? medicine.createdAt : '❓'} />
            <RowContent
              className='fw-bold text-uppercase'
              label={<><i className='bi bi-capsule'/> Désignation</>}
              body={medicine?.wording ? medicine.wording : ''} />
            <RowContent
              label={<><i className='bi bi-qr-code'/> Code</>}
              body={medicine?.code ? medicine.code : '❓'} />
            <RowContent
              className='text-capitalize'
              label={<><i className='bi bi-thermometer'/> Unité C.</>}
              body={medicine?.consumptionUnit ? medicine.consumptionUnit.wording : '❓'} />
            <RowContent
              label={<><i className='bi bi-currency-exchange'/> Coût</>}
              body={
                medicine?.cost
                  ? <span className='text-primary' style={style}>{currency && currency.value} {medicine.cost}</span>
                  : '❓'} />
            <RowContent
              label={<><i className='bi bi-currency-exchange'/> Prix</>}
              body={
                medicine?.price
                  ? <span className='text-success' style={style}>{currency && currency.value} {medicine.price}</span>
                  : '❓'} />
            <RowContent
              label={<><i className='bi bi-calendar-event-fill'/> Appro.</>}
              body={medicine?.released ? <>{medicine.released}</> : '❓'} />
            <RowContent
              label={<><i className='bi bi-calendar-event-fill'/> Péremption</>}
              body={medicine?.expiryDate ? <>{medicine.expiryDate}</> : '❓'} />
            <RowContent
              className='text-capitalize'
              label={<><i className='bi bi-tags'/> Catégorie</>}
              body={medicine?.category ? <Badge>{medicine.category.wording}</Badge> : '❓'} />
            <RowContent
              className='text-capitalize'
              label={<><i className='bi bi-tag'/> Sous-catégorie</>}
              body={medicine?.subCategory ? <Badge bg='secondary'>{medicine.subCategory.wording}</Badge> : '❓'} />
            <RowContent
              className='text-capitalize fw-bold'
              label={<><i className='bi bi-person'/> Par</>}
              body={
                medicine?.user
                  ? <>{medicine.user?.name ? usernameFiltered(medicine.user.name) : medicine.user.username}</>
                  : '❓'} />
          </Col>

          <Col md={5}>
            <h2 className='card-title mb-3' style={cardTitleStyle}>Stock</h2>
            <RowContent
              label={<><i className='bi bi-database'/> Qté</>}
              body={parseInt(medicine?.quantity).toLocaleString()} />
          </Col>
        </Row>
      </AppModal>
    </>
  )
}
