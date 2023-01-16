import moment from "moment";

export const OrderItem = ({order, onClick, loader = false}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-file-earmark-text'/></td>
        {order.id && <th scope='row'>{order.id.toLocaleString()}</th>}
        <td className='text-capitalize' style={{ cursor: 'pointer' }} title={order.patient} onClick={onClick}>
          {order.patient}
        </td>
        <td colSpan={2}>{order?.createdAt ? moment(order.createdAt).calendar() : '-'}</td>
      </tr>
    </>
  )
}
