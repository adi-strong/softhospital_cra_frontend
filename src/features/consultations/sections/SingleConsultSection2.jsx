import {Table} from "react-bootstrap";
import {useMemo} from "react";
import moment from "moment";
import parser from "html-react-parser";

export const SingleConsultSection2 = ({ consult }) => {
  const patient = consult?.patient ? consult.patient : null

  let followed
  followed = useMemo(() => {
    if (consult?.followed) {
      const groups = new Map()
      consult.followed?.forEach(item => {
        if (item.date !== undefined) {
          if (groups.has(item.date)) groups.get(item.date).push({
            diagnostic: item?.diagnostic ? item.diagnostic : null,
            weight: item?.weight ? item.weight : null,
            temperature: item?.temperature ? item.temperature : null,
            arterialTension: item?.arterialTension ? item.arterialTension : null,
            cardiacFrequency: item?.cardiacFrequency ? item.cardiacFrequency : null,
            oxygenSaturation: item?.oxygenSaturation ? item.oxygenSaturation : null,
            respiratoryFrequency: item?.respiratoryFrequency ? item.respiratoryFrequency : null})
          else groups.set(item.date, [{
            diagnostic: item?.diagnostic ? item.diagnostic : null,
            weight: item?.weight ? item.weight : null,
            temperature: item?.temperature ? item.temperature : null,
            arterialTension: item?.arterialTension ? item.arterialTension : null,
            cardiacFrequency: item?.cardiacFrequency ? item.cardiacFrequency : null,
            oxygenSaturation: item?.oxygenSaturation ? item.oxygenSaturation : null,
            respiratoryFrequency: item?.respiratoryFrequency ? item.respiratoryFrequency : null}])
        }
      })
      return Array.from(groups, ([item, values]) => ({ item, values }))
    }
    return []
  }, [consult])

  return (
    <div className='mt-4 mx-3'>
      {patient &&
        <>
          <Table borderless className='w-100' style={{ padding: 0 }}>
            <tbody>
              <tr>
                <td>Nom du malade</td>
                <td style={{ borderBottom: '2px dotted #000' }} className='text-uppercase fw-bold' colSpan={9}>
                  : {patient?.name+' '}
                  {patient?.lastName && patient.lastName+' '}
                  {patient?.firstName && patient.firstName+' '}
                </td>
              </tr>

              <tr>
                <td>Adresse</td>
                <td style={{ borderBottom: '2px dotted #000' }} className='fw-bold' colSpan={9}>
                  : {patient?.address && patient.address}
                </td>
              </tr>

              <tr>
                <td>N° Tél</td>
                <th style={{ borderBottom: '2px dotted #000' }}>
                  : {patient?.tel && patient.tel}
                </th>

                <td>État-civil</td>
                <th style={{ borderBottom: '2px dotted #000' }}>
                  : {patient?.maritalStatus &&
                  patient.maritalStatus === 'single'
                    ? 'Célibataire'
                    : patient.maritalStatus === 'married' && 'Marié(e)'}
                </th>

                <td>Âge</td>
                <td style={{ borderBottom: '2px dotted #000' }}>
                  : {patient?.age && patient.age+' an(s)'}
                </td>

                <td>Sexe</td>
                <td style={{ borderBottom: '2px dotted #000' }} colSpan={3}>
                  : {patient?.sex &&
                    patient.sex === 'M' ? 'Masculin' : patient.sex === 'F' && 'Féminin'}
                </td>
              </tr>

              <tr>
                <td>Poids</td>
                <td style={{ borderBottom: '2px dotted #000' }}>
                  {consult?.weight && consult.weight > 0 && consult.weight} Kg
                </td>

                <td>; FC</td>
                <td style={{ borderBottom: '2px dotted #000' }}>
                  : {consult?.cardiacFrequency && consult.cardiacFrequency}
                </td>

                <td>; Bat/min</td>
                <td style={{ borderBottom: '2px dotted #000' }}>
                  : {/*consult?.respiratoryFrequency && consult.respiratoryFrequency*/}
                </td>

                <td>; FR</td>
                <td style={{ borderBottom: '2px dotted #000' }}>
                  : {consult?.respiratoryFrequency && consult.respiratoryFrequency}
                </td>

                <td>; Cycle/min</td>
                <td style={{ borderBottom: '2px dotted #000' }}>
                  : {/*consult?.respiratoryFrequency && consult.respiratoryFrequency*/}
                </td>
              </tr>
            </tbody>
          </Table>

          <Table bordered className='w-100 mt-4'>
            <tbody>
              <tr className='text-center'>
                <th rowSpan={2}>Date</th>
                <th colSpan={2}>
                  S. Vitaux
                </th>
                <th rowSpan={2} className='pt-4'>Plaintes & Diagnostics</th>
                <th rowSpan={2} className='pt-4'>C.A.T et Traitement</th>
              </tr>

              <tr>
                <td className='text-center'>T° C</td>
                <td className='text-center'>T.A</td>
              </tr>

              {followed && followed?.map((element, idx) =>
                <tr key={idx}>
                  <td>{element?.item && moment(element.item).format('D/MM/Y')}</td>

                  <td>
                    {element?.values && element?.values?.map((item, i) =>
                      <div key={i} className='mb-3'>
                        {item?.temperature && item.temperature > 0 && item.temperature}
                      </div>)}
                  </td>

                  <td>
                    {element?.values && element?.values?.map((item, i) =>
                      <div key={i} className='mb-3'>
                        {item?.arterialTension && item.arterialTension > 0 && item.arterialTension}
                      </div>)}
                  </td>

                  <td>
                    {element?.values && element?.values?.map((item, i) =>
                      <div key={i} className='mb-4'>
                        {item?.diagnostic && parser(`${item.diagnostic}`)}
                      </div>)}
                  </td>

                  <td />
                </tr>)}
            </tbody>
          </Table>
        </>}
    </div>
  )
}
