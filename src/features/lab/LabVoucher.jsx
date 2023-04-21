import {Card, Col, Row, Table} from "react-bootstrap";
import {RepeatableTableRows} from "../../loaders";
import {useSelector} from "react-redux";
import {entrypoint} from "../../app/store";
import {useEffect, useMemo, useState} from "react";

export function LabVoucherHeader({ title = 'BON D\'ANALYSE DE LABORATOIRE', hospital, prescriber, data }) {
  const agent = prescriber && prescriber?.agent ? prescriber.agent : null
  const office = agent && agent?.office ? agent.office?.title : null
  const name = prescriber && prescriber?.name ? prescriber.name : null
  const username = prescriber ? prescriber?.username : null
  const tel = prescriber && prescriber?.tel
  const fullName = data && data?.fullName
  const patient = data && data?.patient ? data.patient : null

  return (
    <>
      {hospital &&
        <>
          <div className='d-flex'>
            <div>
              {hospital?.logo &&
                <img
                  src={entrypoint+hospital.logo?.contentUrl}
                  className='img-fluid rounded-circle'
                  width={250}
                  alt=''/>}
            </div>

            <div className='text-center pt-5'>
              <h5 style={{ fontWeight: 800 }}>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h5>
              <h5 className='text-danger fw-bold'>MINISTÈRE DE LA SANTÉ</h5>
              <h2 className='text-uppercase text-primary' style={{ fontWeight: 800 }}>{hospital?.denomination}</h2>
              <h5 className='fw-bold'>KINSHASA / LIMETE</h5>
            </div>
          </div>

          <div style={{ borderTop: 'solid 4px black', borderBottom: 'solid #000 2px', paddingBottom: 1 }} />
        </>}

      <div className='text-center'>
        <h5 className='text-decoration-underline mt-4' style={{ fontWeight: 800 }}>{title}</h5>
      </div>

      <Table responsive borderless className='m-auto' style={{ width: '91.5%' }}>
        <tbody>
        <tr>
          <th>Demandé par :</th>
          <td colSpan={3} style={{ borderBottom: 'dotted #000 2px' }} className='text-primary'>
            {office && <span className='text-capitalize me-1'>{office}</span>}
            <span className='text-uppercase'>{name ? name : username}</span>
          </td>
          <th>Tél :</th>
          <td className='text-primary' style={{ borderBottom: 'dotted #000 2px' }}>{tel}</td>
        </tr>
        <tr>
          <th>Nom du patient :</th>
          <td style={{ borderBottom: 'dotted #000 2px' }} className='text-uppercase text-primary'>{fullName}</td>

          <th>Âge :</th>
          <td style={{ borderBottom: 'dotted #000 2px' }} className='text-primary'>
            {patient && patient?.age && patient.age} an(s)
          </td>

          <th>Sexe :</th>
          <td style={{ borderBottom: 'dotted #000 2px' }} className='text-primary'>
            {patient && patient?.sex && (patient?.sex !== 'none') && patient.sex}
          </td>
        </tr>
        <tr>
          <th>Nature de l'échantillon :</th>
          <td colSpan={5} style={{ borderBottom: 'dotted #000 2px' }} />
        </tr>
        </tbody>
      </Table>

      <div className='m-auto mt-5' style={{ width: '90%' }}>
        <b>Renseignements cliniques : </b>
        <span className="text-primary">{data && data?.note && data.note}</span>
      </div>
    </>
  )
}

export function LabVoucherBody({ categories, pExams, data, hospital }) {
  const [exams, setExams] = useState([])
  const [items, setItems] = useState([])

  useEffect(() => {
    if (categories) {
      const items = categories && categories.ids?.map(id => categories?.entities[id])
      setExams(items)
    }
  }, [categories])

  useEffect(() => {
    if (exams && exams.length > 0) {
      let obj = []
      const values = [...exams]
      for (const i in values) {
        const category = values[i]?.name
        const examItems = values[i]?.exams
        const examObj = examItems?.map(e => {return {...e, isSelected: false}})
        obj.push({category, exams: examObj})
      }

      if (pExams && pExams?.length > 0) {
        for (const i in obj) {
          const objExams = obj[i]?.exams
          for (const j in objExams) {
            for (const k in pExams) {
              if (objExams[j]?.wording === pExams[k]?.exam.wording) objExams[j]['isSelected'] = true;
            }
          }
          obj[i]['exams'] = objExams
        }
      }

      setItems(obj)
    }
  }, [exams, pExams])

  return (
    <div className='m-auto' style={{ width: '91.5%' }}>
      <div className='mt-3' style={{ borderBottom: 'solid #000 4px' }} />
      <div className='p-1' style={{ border: 'solid #000 1px', borderBottom: 'solid #000 4px', marginTop: 1 }}>
        {items && items.map((item, idx) =>
          <div key={idx} className='d-inline-block align-top me-1 mb-3'>
            <h6 className='fw-bold text-decoration-underline text-uppercase'>{item?.category}</h6>
            {item?.exams && item.exams.map((e, key) =>
              <div key={key}>
                {e?.isSelected && <i className='bi bi-x-square-fill text-primary me-1'/>}
                {!e?.isSelected && <i className='bi bi-square me-1'/>}
                {e?.wording}
              </div>)}
          </div>)}
        {hospital && hospital?.logo &&
          <img src={entrypoint+hospital.logo?.contentUrl} className='hosp-logo-wrap' alt=''/>}
      </div>
      <div className='' style={{ borderTop: 'solid #000 1px', marginTop: 1 }} />

      <div className="mt-3 d-flex justify-content-between">
        <span className='text-capitalize'>Le, {data && data?.createdAt ? data.createdAt : '.../.../......'}</span>
        <span>SIGNATURE</span>
      </div>
      <div className='mt-5' style={{ borderTop: 'solid #000 1px', marginTop: 1 }} />

      <Row className='m-auto'>
        <Col md={5} className='mb-3'>
          <b className='text-decoration-underline'>Adresse</b> <br/>
          {hospital && hospital?.address && hospital.address}
        </Col>

        <Col className='text-md-end'>
          <b className='text-decoration-underline'>Contact</b> <br/>
          Mobile : {hospital && hospital?.tel && hospital.tel} <br/>
          Email : {hospital && hospital?.email && hospital.email} <br/>
        </Col>
      </Row>
    </div>
  )
}

export const LabVoucher = ({ data, onRefresh, allCategories, prescriber, loader = false }) => {
  const { hospital } = useSelector(state => state.parameters)

  let exams
  exams = useMemo(() => data && data?.labResults
    ? data.labResults
    : [], [data])

  return (
    <div className='section dashboard'>
      <Card className='border-0'>
        <Card.Body>
          <div className='container-fluid pt-3'>
            <LabVoucherHeader hospital={hospital} prescriber={prescriber} data={data}/>
            {!loader && data &&
              <LabVoucherBody
                categories={allCategories}
                pExams={exams}
                data={data}
                hospital={hospital}/>}
            {loader && <RepeatableTableRows/>}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
