import {memo, useMemo} from "react";
import {useGetBoxQuery} from "./boxApiSlice";
import {useSelector} from "react-redux";
import {Col, Row} from "react-bootstrap";

const BoxSum = ({id}) => {
  const { fCurrency, sCurrency, rate } = useSelector(state => state.parameters)
  const { box } = useGetBoxQuery('Box', {
    selectFromResult: ({ data }) => ({
      box: data.entities[id]
    })
  })

  const sum = useMemo(() => {
    const total = box.sum - box.outputSum
    return parseFloat(total).toFixed(2).toLocaleString()
  }, [box])

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
            {parseFloat((sum * rate).toString()).toFixed(2).toLocaleString()} {sCurrency.value}
          </h4>
        </Col>}
    </Row>
  )
}

export default memo(BoxSum)
