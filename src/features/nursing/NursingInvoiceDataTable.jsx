import {Table} from "react-bootstrap";
import {AppTHead} from "../../components";
import {useMemo} from "react";
import moment from "moment";
import {NursingInvoiceSumsData} from "./NursingInvoiceSumsData";

const theadItems = [ {label: 'Date'}, {label: 'TRAITEMENT'}, {label: 'PROCÉDURE(s)'} ]

export const NursingInvoiceDataTable = ({ data, nursing, setNursing, onRefresh }) => {
  let elements, acts

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

      return Array.from(groups, ([item, values]) => ({ item, values }))
    }
    return []
  }, [data]) // handle get treatment items

  acts = useMemo(() => {
    if (data?.acts && data.acts.length > 0) {
      const items = data.acts
      const groups = new Map()

      items?.forEach(item => {
        if (item?.releasedAt) {
          const act = item
          if (groups?.has(act.releasedAt)) {
            groups.get(act.releasedAt).push({
              'isDone': act?.isDone,
              'wording': act?.wording,
              'procedures': act?.procedures,
            })
          }
          else {
            groups.set(act?.releasedAt, [{
              'isDone': act?.isDone,
              'wording': act?.wording,
              'procedures': act?.procedures,}])
          }
        }
      })

      return Array.from(groups, ([item, values]) => ({ item, values }))
    }
    return null
  }, [data])

  return (
    <>
      <Table bordered className='w-100' style={{ fontSize: '0.7rem' }}>
        <AppTHead items={theadItems} className='bg-primary text-light text-center' />
        <tbody>
          {elements && elements?.map((element, idx) =>
            <tr key={idx}>
              <th>{moment(element?.item).format('ll')}</th>
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
                        <span className='fw-bold' style={{ fontWeight: 800 }}>
                          {drug?.wording}
                        </span> : {drug?.quantity}
                      </p>)}
                  </div>)}
              </td>
            </tr>)}

          {acts && acts?.map((element, idx) =>
            <tr key={idx}>
              <th>{element?.item && moment(element.item).format('ll')}</th>
              <th>
                {element?.values && element.values?.map((item, key) =>
                  <p key={key} className='text-capitalize'>
                    {item?.wording}
                  </p>)}
              </th>
              <th>
                {element?.values && element.values?.length > 0 && element.values?.map((item, i) =>
                  <div key={i} className='text-capitalize'>
                    {item?.procedures && item.procedures?.map((drug, j) =>
                      <p key={j}>
                        <span className='fw-bold' style={{ fontWeight: 800 }}>
                          {drug?.item}
                        </span> {drug?.quantity && `: ${drug.quantity}`}
                      </p>)}
                  </div>)}
              </th>
            </tr>)}
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
