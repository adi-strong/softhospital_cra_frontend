import {Badge, Col, ListGroup, Row, Table} from "react-bootstrap";
import {AppTHead} from "../../components";
import {useMemo, useState} from "react";
import {InvoiceSumsData} from "./InvoiceSumsData";
import moment from "moment";

const theadItems = [ {label: 'SVC ID'}, {label: 'SERVICE MÉDICAL'}, {label: 'COÛT'} ]

export const InvoiceDataTable = ({ invoice }) => {
  const [actsSums, setActsSums] = useState(0)
  const [examsSums, setExamsSums] = useState(0)
  let consult, file, acts, exams, hosp, hospDaysCounter

  consult = useMemo(() => invoice?.consultation ? invoice.consultation : null, [invoice])
  // handle get consultation's data

  file = useMemo(() => consult && consult?.file ? consult.file : null, [consult])
  // handle get consultation's file

  acts = useMemo(() => {
    let sum = 0
    if (invoice?.actsInvoiceBaskets) {
      const items = invoice?.actsInvoiceBaskets
      for (const key in items) {
        sum += parseFloat(items[key]?.price)
      }
      setActsSums(sum)
      return items?.map(act => {
        return { wording: act?.act.wording, price: act?.price }
      })
    }

    setActsSums(0)
    return []
  }, [invoice])
  // handle get medical acts

  exams = useMemo(() => {
    let sum = 0
    if (invoice?.examsInvoiceBaskets) {
      const items = invoice?.examsInvoiceBaskets
      for (const key in items) {
        sum += parseFloat(items[key]?.price)
      }
      setExamsSums(sum)
      return items?.map(exam => {
        return { wording: exam?.exam.wording, price: exam?.price }
      })
    }

    setExamsSums(0)
    return []
  }, [invoice])
  // handle get medical acts

  hosp = useMemo(() => consult?.hospitalization
    ? consult.hospitalization
    : null, [consult])
  // handle get hospitalization's data

  hospDaysCounter = useMemo(() => {
    if (hosp) {
      const releasedAt = moment(hosp?.releasedAt)
      return !hosp?.isCompleted
        ? moment(new Date()).diff(releasedAt, 'days') + 1
        : hosp?.daysCounter
    }
    return 0
  }, [hosp])

  return (
    <>
      <Table bordered className='w-100' style={{ fontSize: '0.7rem' }}>
        <AppTHead items={theadItems} className='bg-primary text-light text-center' />
        <tbody>
          <tr className='bg-light'>
            <th>Fiche médical</th>

            <th className='text-end'>{file ? file?.wording : '-'}</th>

            <th className='text-end'>
              {file && file?.price <= 0.00 ? '-' : parseFloat(file.price).toFixed(2).toLocaleString()+' '}
              {invoice?.currency && invoice.currency}
            </th>
          </tr>

          {acts && acts?.length > 0 && (
            <>
              <tr>
                <th>Actes médicaux</th>

                <th className='text-end'>
                  {acts?.map((act, idx) =>
                    <p key={idx} className='mb-2'>
                      {act?.wording}
                    </p>)}
                </th>

                <th className='text-end'>
                  {acts?.map((act, idx) =>
                    <p key={idx} className='mb-2'>
                      {act?.price > 0.00
                        ? <>{parseFloat(act.price).toFixed(2).toLocaleString()} {invoice?.currency}</>
                        : '-'}
                    </p>)}
                </th>
              </tr>

              <tr className='text-uppercase bg-light' style={{ fontWeight: 800 }}>
                <td style={{ fontWeight: 800 }} className='text-center'>Sous total</td>
                <td colSpan={2} className='text-end'>
                  {parseFloat(actsSums).toFixed(2).toLocaleString()} {invoice?.currency}
                </td>
              </tr>
            </>
          )}{/* Acts */}

          {exams && exams?.length > 0 && (
            <>
              <tr>
                <th>Examens</th>

                <th className='text-end'>
                  {exams?.map((exam, idx) =>
                    <p key={idx} className='mb-2'>
                      {exam?.wording}
                    </p>)}
                </th>

                <th className='text-end'>
                  {exams?.map((exam, idx) =>
                    <p key={idx} className='mb-2'>
                      {exam?.price > 0.00
                        ? <>{parseFloat(exam.price).toFixed(2).toLocaleString()} {invoice?.currency}</>
                        : '-'}
                    </p>)}
                </th>
              </tr>

              <tr className='text-uppercase bg-light' style={{ fontWeight: 800 }}>
                <td style={{ fontWeight: 800 }} className='text-center'>Sous total</td>
                <td colSpan={2} className='text-end'>
                  {parseFloat(examsSums).toFixed(2).toLocaleString()} {invoice?.currency}
                </td>
              </tr>
            </>
          )}{/* Exams */}
        </tbody>
      </Table> {/* Tableau de données */}

      {invoice && hosp &&
        <Row>
          <Col md={7} />
          <Col>
            <ListGroup className='w-100  list-group-flush'>
              <ListGroup.Item className='d-flex justify-content-between'>
                <span>HOSPITALISATION :</span>
                <span>
                <Badge bg='primary'>
                  {parseFloat(hosp?.bed.price).toFixed(2).toLocaleString()+' '}
                  {invoice?.currency}
                </Badge>
              </span>
              </ListGroup.Item>

              <ListGroup.Item active className='d-flex justify-content-between'>
                <span>
                  <i className='bi bi-arrow-right me-1'/>
                  <span className='fw-bold'>{hospDaysCounter.toLocaleString()+' jour(s)'}</span>
                </span>

                <span style={{ fontWeight: 800 }}>
                  : {parseFloat(hosp?.bed.price * hospDaysCounter).toFixed(2).toLocaleString()+' '}
                  {invoice?.currency}
                </span>
              </ListGroup.Item>
            </ListGroup>
          </Col>
        </Row>}

      <InvoiceSumsData
        data={invoice}
        daysCounter={hospDaysCounter}
        bedPrice={hosp ? hosp?.bed.price : 0}
        hosp={hosp} />
    </>
  )
}
