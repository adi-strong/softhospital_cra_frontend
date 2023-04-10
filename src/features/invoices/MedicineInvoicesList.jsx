import {AppDataTableStripped, AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {
  medicineInvoicesPages,
  useGetMedicineInvoicesQuery,
  useLazyGetMedicineInvoicesByPaginationQuery
} from "./medicineInvoiceApiSlice";
import {useEffect, useState} from "react";
import {MedicineInvoiceItem} from "./MedicineInvoiceItem";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {cardTitleStyle} from "../../layouts/AuthLayout";

const thead = [
  {label: '#'},
  {label: 'Montant'},
  {label: <><i className='bi bi-person'/> Par</>},
]

export const MedicineInvoicesList = ({ currency }) => {
  const {
    data: medicineInvoices = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetMedicineInvoicesQuery('MedicineInvoices')


  const [contents, setContents] = useState([])
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isPaginated: false,})
  const [paginatedItems, setPaginatedItems] = useState([])

  const [getMedicineInvoicesByPagination, {isFetching: isFetching2, isError: isError2}] =
    useLazyGetMedicineInvoicesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isPaginated: true})
    const { data: searchData, isSuccess } = await getMedicineInvoicesByPagination(param)
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
    if (checkItems.isPaginated && isSuccess && medicineInvoices) setContents(paginatedItems)
    else if (!checkItems.isPaginated && isSuccess && medicineInvoices) setContents(medicineInvoices)
  }, [checkItems, isSuccess, medicineInvoices, paginatedItems])

  return (
    <>
      <h5 className='text-end card-title' style={cardTitleStyle}>Ventes</h5>
      <AppDataTableStripped
        loader={isLoading || isFetching2}
        thead={
          <AppTHead
            isImg
            loader={isLoading}
            isFetching={isFetching || isFetching2}
            onRefresh={onRefresh}
            items={thead}
          />}
        tbody={
          <tbody>
            {!(isError || isError2) && isSuccess && contents.length > 0 &&
              contents.map(item => <MedicineInvoiceItem key={item?.id} medicineInvoice={item} currency={currency}/>)}
          </tbody>
        } />

      {isLoading || isFetching || isFetching2
        ? <BarLoaderSpinner loading={isLoading || isFetching || isFetching2}/>
        : (
          <>
            {medicineInvoicesPages > 1 && isSuccess && medicineInvoices &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={medicineInvoicesPages} />}
          </>
        )}

      {(isError || isError2) && <AppMainError/>}
    </>
  )
}
