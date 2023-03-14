import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useGetMedicineInvoicesQuery} from "./medicineInvoiceApiSlice";
import {useMemo} from "react";
import {MedicineInvoiceItem} from "./MedicineInvoiceItem";

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

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => (
    <tbody>
    {isSuccess && medicineInvoices && medicineInvoices.map(invoice =>
      <MedicineInvoiceItem key={invoice.id} medicineInvoice={invoice} currency={currency}/>)}
    </tbody>), [isSuccess, medicineInvoices, currency])

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        title='Liste de factures des ventes des produits pharmaceutiques'
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead} />}
        tbody={content} />
      {errors && errors}
    </>
  )
}
