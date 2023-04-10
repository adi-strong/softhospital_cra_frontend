import {
  supplyMedicineInvoicesPages,
  useLazyGetSupplyMedicineInvoicesByPaginationQuery,
  useSupplyInvoicesListQuery
} from "./drugStoreApiSlice";
import {useEffect, useState} from "react";
import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {Link} from "react-router-dom";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

export const SupplyInvoicesList = () => {
  const {data, isLoading, isFetching, isSuccess, isError, refetch} = useSupplyInvoicesListQuery('SupplyInvoices')

  const [contents, setContents] = useState([])
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isPaginated: false,})
  const [paginatedItems, setPaginatedItems] = useState([])

  const [getSupplyMedicineInvoicesByPagination, {isFetching: isFetching2, isError: isError2}] =
    useLazyGetSupplyMedicineInvoicesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isPaginated: true})
    const { data: searchData, isSuccess } = await getSupplyMedicineInvoicesByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  const onRefresh = async () => {
    setCheckItems({isPaginated: false})
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (checkItems.isPaginated && isSuccess && data) setContents(paginatedItems)
    else if (!checkItems.isPaginated && isSuccess && data) setContents(data)
  }, [checkItems, isSuccess, data, paginatedItems])

  return (
    <>
      <h5 className='text-end card-title' style={cardTitleStyle}>Facture d'approvisionnements</h5>
      <AppDataTableStripped
        loader={isLoading}
        thead={
        <AppTHead
          loader={isLoading || isFetching2}
          isFetching={isFetching}
          onRefresh={onRefresh}
          items={[
            {label: '#'},
            {label: 'Sous total'},
            {label: 'Total'},
            {label: 'Date'},
          ]} />}
        tbody={
          <tbody>
            {!(isError) && isSuccess && contents.length > 0 &&
              contents.map(invoice =>
                <tr key={invoice?.id}>
                  <th>#{invoice?.document}</th>
                  <td>
                    {invoice?.currency && invoice.currency+' '}
                    {parseFloat(invoice?.subTotal).toFixed(2).toLocaleString()}
                  </td>
                  <td>
                    {invoice?.currency && invoice.currency+' '}
                    {parseFloat(invoice?.total).toFixed(2).toLocaleString()}
                  </td>
                  <td>{invoice?.released ? invoice.released : '-'}</td>
                  <td className='text-end'>
                    <Link
                      to={`/member/drugstore/medicine/supply/invoices/${invoice?.id}/show`}
                      className='text-decoration-none btn btn-light btn-sm'>
                      <i className='bi bi-eye-fill'/>
                    </Link>
                  </td>
                </tr>)}
          </tbody>}
      />

      {isLoading || isFetching || isFetching2
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2}/>
        : (
          <>
            {supplyMedicineInvoicesPages > 1 && isSuccess && data &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={supplyMedicineInvoicesPages} />}
          </>
        )}

      {(isError || isError2) && <AppMainError/>}
    </>
  )
}
