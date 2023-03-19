import {useMemo, useState, useCallback} from "react";
import {AppDataTableBorderless, AppMainError, AppTHead} from "../../components";
import {useGetInvoicesQuery} from "../invoices/invoiceApiSlice";
import {InvoiceItem} from "../invoices/InvoiceItem";
import {Form} from "react-bootstrap";
import {useSelector} from "react-redux";

export function InvoicesList() {
  const [search, setSearch] = useState('')
  const { fCurrency } = useSelector(state => state.parameters)
  const {data: invoices = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetInvoicesQuery('Invoices')

  const onRefresh = async () => await refetch()

  const handleSearch = useCallback(({ target }) => {
    const value = target.value
    setSearch(value)
  }, [])

  async function onSearching(e) {
    e.preventDefault()
    alert('submitted')
  }

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && invoices) return (
      <tbody>
      {invoices.map(invoice => <InvoiceItem key={invoice.id} invoice={invoice} currency={fCurrency}/>)}
      </tbody>)
  }, [isSuccess, invoices, fCurrency])

  return (
    <>
      <AppDataTableBorderless
        loader={isLoading}
        thead={<AppTHead loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
          {label: '#'},
          {label: 'Patient(e)'},
          {label: <><i className='bi bi-piggy-bank'/> Total</>},
          {label: <><i className='bi bi-cash-coin'/> Payé</>},
          {label: <><i className='bi bi-currency-exchange'/> Reste</>},
          {label: 'Date'},
        ]}/>}
        tbody={content}
        overview={
          <>
            <Form onSubmit={onSearching}>
              <Form.Control
                name='search'
                value={search}
                onChange={handleSearch}
                placeholder='Rechercher' />
            </Form>
          </>
        } />

      {errors && errors}
    </>
  )
}
