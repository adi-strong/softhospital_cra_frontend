import {AppDataTableBordered, AppTHead} from "../../../components";
import {useMemo} from "react";

const thead = [
  {label: 'Désignation'},
  {label: 'Unité'},
  {label: 'Quantité'},
  {label: 'Prix Unitaire'},
  {label: 'Total'},
]

const theadStyle = {
  background: 'darkblue',
  color: '#fff',
  textAlign: 'center'
}

const Item = ({ item, currency, amount }) => {
  const medicine = item?.medicine ? {
    description: item.medicine?.wording,
    consumptionUnit: item.medicine?.consumptionUnit ? item.medicine.consumptionUnit?.wording : '❓'
  } : null

  return (
    <>
      <tr>
        <td>{medicine.description}</td>
        <td>{medicine.consumptionUnit}</td>
        <td className='fw-bold'>{parseInt(item?.quantity).toLocaleString()}</td>
        <td className='fw-bold'>
          {parseFloat(item?.price).toFixed(2).toLocaleString()+' '}
          {currency && currency.value}
        </td>
        <td style={{ fontWeight: 800 }}>
          {parseFloat(item?.sum).toFixed(2).toLocaleString()+' '}
          {currency && currency.value}
        </td>
      </tr>
    </>
  )
}

const SumItem = ({ invoice, currency }) => {
  return (
    <>
      <tr>
        <td>Sous total</td>
        <td className='text-end fw-bolder' width={200}>
          {parseFloat(invoice?.subTotal).toFixed(2).toLocaleString()+' '}
          {invoice?.currency
            ? invoice.currency
            : currency && currency.value}
        </td>
      </tr>

      <tr>
        <td>Remise</td>
        <td className='text-end'>{invoice?.discount ? <>-{invoice.discount}%</> : '-'}</td>
      </tr>

      <tr>
        <td>Montant Total HT</td>
        <td className='text-end fw-bolder' width={200}>
          {invoice?.discount && parseFloat(invoice?.amount).toFixed(2).toLocaleString()+' '}
          {invoice?.discount && currency && currency?.value}
          {!invoice?.discount && '-'}
        </td>
      </tr>

      <tr>
        <td className='fs-4 fw-bold'>Montant Total TTC</td>
        <td className='fs-4 text-end fw-bold' width={200}>
          {parseFloat(invoice?.totalAmount).toFixed(2).toLocaleString()+' '}
          {invoice?.currency
            ? invoice.currency
            : currency && currency.value}
        </td>
      </tr>
    </>
  )
}

export const PrintingMedicineInvoiceContent = ({ isLoading, invoice, currency }) => {
  let items
   items = useMemo(() => (
     <tbody className='text-center text-capitalize'>
     {invoice && invoice?.medicinesSolds
       ? invoice.medicinesSolds?.map((item, key) => <Item key={key} item={item} currency={currency}/>)
       : []}
     </tbody>
   ), [invoice, currency])

  return (
    <>
      <div className='printing-content'>
        <h6 className='fw-bold mt-3 mb-0'>Objet :</h6>
        <AppDataTableBordered
          isStriped
          loader={isLoading}
          thead={<AppTHead items={thead} style={theadStyle}/>}
          tbody={items} />

        <div className='printing-total-sum float-md-end'>
          <AppDataTableBordered
            isStriped
            loader={isLoading}
            tbody={
              <tbody>
              {!isLoading && invoice &&
                <SumItem
                  currency={currency}
                  invoice={invoice} />}
              </tbody>} />
        </div>
      </div>
    </>
  )
}
