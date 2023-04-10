import {AppDataTableStripped, AppPaginationComponent, AppTHead} from "../../components";
import {
  covenantInvoicesPages,
  useGetCovenantInvoicesQuery,
  useLazyGetCovenantInvoicesByPaginationQuery
} from "./covenantInvoiceApiSlice";
import {useEffect, useState} from "react";
import {SingleCovenantInvoiceShow} from "./singleCovenantInvoiceShow";

const thead = [
  {label: '#'},
  {label: 'Mois'},
  {label: 'Année'},
  {label: 'Total'},
  {label: 'Payé'},
  {label: 'Reste'},
  {label: 'Date'},
]

export const CovenantSingleInvoicesList = ({ id }) => {
  const {data: invoices, isFetching, isSuccess, isError, refetch} = useGetCovenantInvoicesQuery(id)

  const [contents, setContents] = useState([])
  const [show, setShow] = useState(false)
  const [invoice, setInvoice] = useState(null)
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isPaginated: false,})

  const handleToggle = (invoiceData) => {
    setInvoice(invoiceData)
    setShow(!show)
  }

  const [paginatedItems, setPaginatedItems] = useState([])

  const [getCovenantInvoicesByPagination, {isFetching: isFetching2, isError: isError2}] =
    useLazyGetCovenantInvoicesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isPaginated: true})
    const { data: searchData, isSuccess } = await getCovenantInvoicesByPagination({ id, page: param})
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function onRefresh() {
    setCheckItems({isPaginated: false})
    setPage(1)
    await refetch()
  }

  function handleShowMonth(month) {
    switch (month) {
      case '02':
        return 'Février'
      case '03':
        return 'Mars'
      case '04':
        return 'Avril'
      case '05':
        return 'Mai'
      case '06':
        return 'Juin'
      case '07':
        return 'Juillet'
      case '08':
        return 'Août'
      case '09':
        return 'Septembre'
      case '10':
        return 'Octobre'
      case '11':
        return 'Novembre'
      case '12':
        return 'Décembre'
      default:
        return 'Janvier'
    }
  }

  useEffect(() => {
    if (isSuccess && invoices && !checkItems.isPaginated) setContents(invoices)
    else if (isSuccess && invoices && checkItems.isPaginated) setContents(paginatedItems)
  }, [isSuccess, invoices, checkItems, paginatedItems])

  return (
    <>
      {!show &&
        <AppDataTableStripped
          loader={isFetching || isFetching2}
          thead={
            <AppTHead
              loader={isFetching}
              isFetching={isFetching || isFetching2}
              onRefresh={onRefresh}
              items={thead} />}
          tbody={
            <tbody>
            {!(isError || isError2) && isSuccess && contents.length > 0 &&
              contents.map((invoice, idx) =>
                <tr key={idx}>
                  <th>#{invoice?.id}</th>
                  <td>{invoice?.month && handleShowMonth(invoice.month)}</td>
                  <td>{invoice?.year && invoice.year}</td>
                  <th>
                    {invoice?.currency && invoice.currency+' '}
                    {parseFloat(invoice?.totalAmount).toFixed(2).toLocaleString()}
                  </th>
                  <td>
                    {invoice?.currency && invoice.currency+' '}
                    {parseFloat(invoice?.paid).toFixed(2).toLocaleString()}
                  </td>
                  <td className='text-danger'>
                    {invoice?.currency && invoice.currency+' '}
                    {parseFloat(invoice?.leftover).toFixed(2).toLocaleString()}
                  </td>
                  <td>{invoice?.releasedAt && invoice.releasedAt}</td>
                  <td style={{ cursor: 'pointer' }} className='text-end' onClick={() => handleToggle(invoice)}>
                    <i className='bi bi-eye-fill'/>
                  </td>
                </tr>)}
            </tbody>}
        />}

      {!(show || isFetching2 || isFetching) && covenantInvoicesPages > 1 && invoices &&
        <>
          <AppPaginationComponent
            onPaginate={handlePagination}
            currentPage={page - 1}
            pageCount={covenantInvoicesPages} />
        </>}

      {show &&
        <SingleCovenantInvoiceShow
          onToggle={handleToggle}
          data={invoice}
          setShow={setShow}
          onRefresh={onRefresh}/>}
    </>
  )
}
