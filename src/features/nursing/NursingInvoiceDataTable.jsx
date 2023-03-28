import {Table} from "react-bootstrap";
import {AppTHead} from "../../components";
import {useEffect, useMemo, useState} from "react";
import moment from "moment";
import {NursingInvoiceSumsData} from "./NursingInvoiceSumsData";

const theadItems = [ {label: 'Date'}, {label: 'TRAITEMENT'}, {label: 'MÉDICAMENT(s)'}, {label: 'COÛT'} ]

export const NursingInvoiceDataTable = ({ data, nursing, setNursing, onRefresh }) => {
  const [sum, setSum] = useState(0)
  let elements

  elements = useMemo(() => {
    if (data?.nursingTreatments && data.nursingTreatments?.length > 0) {
      const items = data.nursingTreatments
      const groups = new Map()

      items?.forEach(item => {
        if (item?.treatment) {
          const treatment = item.treatment
          if (groups?.has(item?.createdAt)) {
            groups.get(item.createdAt).push({
              wording: treatment?.wording,
              price: treatment?.price,
              medicines: item?.medicines ? item.medicines : null})
          }
          else {
            groups.set(item?.createdAt, [{
              wording: treatment?.wording,
              price: treatment?.price,
              medicines: item?.medicines ? item.medicines : null}])
          }
        }
      })

      let total = 0
      for (const key in items) {
        const item = items[key]
        if (item?.treatment) {
          total += parseFloat(item.treatment?.price)
        }
      }
      setSum(total)

      return Array.from(groups, ([item, values]) => ({ item, values }))
    }
    return []
  }, [data]) // handle get treatment items

  useEffect(() => {
    if (sum > 0.00) setNursing(prev => { return {...prev, subTotal: sum } })
  }, [sum, setNursing]) // handle set subtotal

  return (
    <>
      <Table bordered className='w-100' style={{ fontSize: '0.7rem' }}>
        <AppTHead items={theadItems} className='bg-primary text-light text-center' />
        <tbody>
          {elements && elements?.map((element, idx) =>
            <tr key={idx}>
              <th>{moment(element?.item).calendar()}</th>
              <th>
                {element?.values && element.values?.length > 0 && element.values?.map((item, i) =>
                  <p key={i} className='text-capitalize'>
                    {item?.wording}
                  </p>)}
              </th>
              <td>
                {element?.values && element.values?.length > 0 && element.values?.map((item, i) =>
                  <div key={i} className='text-capitalize'>
                    {item?.medicines && item.medicines?.map((drug, j) =>
                      <p key={j}>
                        <span className='fw-bold text-decoration-underline' style={{ fontWeight: 800 }}>
                          <i className='bi bi-capsule'/> {drug?.medicine}
                        </span> : {drug?.dosage}
                      </p>)}
                  </div>)}
              </td>
              <th>
                {element?.values && element.values?.length > 0 && element.values?.map((item, i) =>
                  <p key={i} className='text-capitalize text-end'>
                    {item?.price} {data?.currency}
                  </p>)}
              </th>
            </tr>)}
          <tr className='bg-light'>
            <th>Total</th>
            <th colSpan={3} className='text-end'>
              {parseFloat(sum).toFixed(2).toLocaleString()+' '}
              {data?.currency}
            </th>
          </tr>
        </tbody>
      </Table>

      <NursingInvoiceSumsData
        data={data}
        nursing={nursing}
        setNursing={setNursing}
        onRefresh={onRefresh} />
    </>
  )
}
