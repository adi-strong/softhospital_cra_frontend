import {memo, useMemo, useState} from "react";
import {useGetBoxQuery} from "./boxApiSlice";
import {useSelector} from "react-redux";
import {Col, Row} from "react-bootstrap";
import {roundANumber} from "../invoices/singleInvoice";

const BoxSum = ({id}) => {
  const { fCurrency, sCurrency, rate, fOperation } = useSelector(state => state.parameters)
  const { box } = useGetBoxQuery('Box', {
    selectFromResult: ({ data }) => ({
      box: data.entities[id]
    })
  })

  const [sInBoxSum, setSInBoxSum] = useState(0)

  const sum = useMemo(() => {
    const total = box.sum - box.outputSum
    if (fOperation && fOperation === '*') setSInBoxSum(roundANumber((total * rate), 2))
    else if (fOperation && fOperation === '/') setSInBoxSum(roundANumber((total / rate), 2))
    else setSInBoxSum(0)
    return parseFloat(total).toFixed(2).toLocaleString()
  }, [box, fOperation, rate])

  return (
    <Row>
      <Col md={6}>
        <h4>
          <i className='bi bi-currency-exchange'/><i className='bi bi-piggy-bank-fill me-3'/>
          {parseFloat(sum).toFixed(2).toLocaleString()} {fCurrency && fCurrency.value}
        </h4>
      </Col>
      {sCurrency && rate &&
        <Col md={6}>
          <h4>
            <i className='bi bi-currency-exchange'/><i className='bi bi-piggy-bank-fill me-3'/>
            {sInBoxSum.toFixed(2).toLocaleString()} {sCurrency.value}
          </h4>
        </Col>}
    </Row>
  )
}

export default memo(BoxSum)
