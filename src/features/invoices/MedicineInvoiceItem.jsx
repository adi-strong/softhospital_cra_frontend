import {usernameFiltered} from "../../components/AppNavbar";
import {Link} from "react-router-dom";

export const MedicineInvoiceItem = ({ medicineInvoice, currency }) => {
  const invoiceNumber = medicineInvoice?.invoiceNumber ? medicineInvoice.invoiceNumber : '❓'

  return (
    <>
      <tr>
        <td><i className='bi bi-file-earmark-text-fill'/></td>
        <th scope='row'>#{invoiceNumber}</th>
        <td className='text-primary' style={{ fontWeight: 800 }}>
          {currency && currency.value+' '}
          {parseFloat(medicineInvoice?.totalAmount).toFixed(2).toLocaleString()}
        </td>
        <td className='text-capitalize'>
          <i className='me-1 bi bi-person-circle'/>
          {medicineInvoice?.user
            ? medicineInvoice.user?.name
              ? usernameFiltered(medicineInvoice.user.name)
              : medicineInvoice.user.username
            : '❓'}
        </td>
        <td className='text-end'>
          <Link to={`/member/drugstore/medicine-invoice/${medicineInvoice?.id}/${invoiceNumber}`}>
            <i className='bi bi-eye'/>
          </Link>
        </td>
      </tr>
    </>
  )
}
