import {entrypoint} from "../../app/store";
import img from '../../assets/app/img/default_profile.jpg';
import {Link} from "react-router-dom";

export const InvoiceItem = ({ invoice, currency }) => {
  const patient = invoice?.patient
  const profile = patient
    ? patient?.profile
      ? entrypoint+patient.profile?.contentUrl
      : img
    : img

  const totalSum = parseFloat(invoice?.totalAmount).toFixed(2).toLocaleString()
  const paid = parseFloat(invoice?.paid).toFixed(2).toLocaleString()
  const leftover = parseFloat(invoice?.leftover).toFixed(2).toLocaleString()

  const releasedAt = invoice?.releasedAt ? invoice.releasedAt : '❓'

  return (
    <tr>
      <th>#{invoice?.id}</th>
      <td>
        {!patient && '❓'}
        {patient && (
          <Link to={`/member/patients/${patient?.id}/${patient?.slug}`} className='text-decoration-none fw-bold'>
            <img width={30} height={30} src={profile} className='rounded-circle me-1' alt='Profile'/>
            {patient?.firstName && <span className='text-capitalize me-1'>{patient.firstName}</span>}
            <span className='text-uppercase'>{patient.name}</span>
          </Link>
        )}
      </td>
      <td className='fw-bold'>
        <i className='text-secondary'>{currency && currency.value}</i>
        <span className='me-1 mx-1'>{totalSum}</span>
        <i className='text-secondary'>{currency && currency.currency}</i>
      </td>
      <td className='text-success' style={{ fontWeight: 800 }}>
        <i className='text-secondary'>{currency && currency.value}</i>
        <span className='me-1 mx-1'>{paid}</span>
        <i className='text-secondary'>{currency && currency.currency}</i>
      </td>
      <td className={`text-${leftover < 1 ? 'dark' : 'danger'}`} style={{ fontWeight: 800 }}>
        {leftover < 1
          ? '-'
          : <>
            <i className='text-secondary me-1'>{currency && currency.value}</i>
            {leftover}
            <i className='text-secondary mx-1'>{currency && currency.currency}</i>
          </>}
      </td>
      <td>{releasedAt}</td>
      <td className='text-end'>
        <Link to={`/member/finance/invoices/${invoice?.id}/view`} className='btn btn-light btn-sm'>
          <i className='bi bi-eye-fill'/>
        </Link>
      </td>
    </tr>
  )
}
