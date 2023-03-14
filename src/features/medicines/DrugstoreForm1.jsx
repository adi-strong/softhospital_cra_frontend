import {limitStrTo} from "../../services";
import {Button} from "react-bootstrap";

export const DrugstoreForm1 = ({ item, currency, onRemove, isLoading = false }) => {
  const medicine = {
    wording: item?.medicine?.label,
    cost: item?.cost,
  }

  const totalPrice = parseFloat(item?.quantity) * parseFloat(medicine.cost)

  return (
    <>
      <tr data-aos='fade-in'>
        <th scope='row'>{item.document}</th>
        <td className='text-uppercase' title={medicine.wording}>
          <i className='bi bi-capsule me-1'/>
          {limitStrTo(15, medicine.wording)}
        </td>
        <td style={{ fontWeight: 700 }} className='text-primary'>
          <span className='text-secondary me-1'>{currency && currency.value}</span>
          {medicine.cost.toLocaleString()}
        </td>
        <td>{parseInt(item?.quantity).toLocaleString()}</td>
        <td style={{ fontWeight: 700 }} className='text-success'>
          <span className='text-secondary me-1'>{currency && currency.value}</span>
          {totalPrice.toLocaleString()}
        </td>
        <td className='text-end'>
          <Button type='button' variant='outline-danger' size='sm' onClick={onRemove} disabled={isLoading}>
            <i className='bi bi-x'/>
          </Button>
        </td>
      </tr>
    </>
  )
}
