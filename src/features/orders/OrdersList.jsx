import {useGetOrdersQuery} from "./orderApiSlice";
import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useMemo} from "react";
import {OrderItem} from "./OrderItem";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-person'/> Par</>},
  {label: 'Date de prescription'},
]

export function OrdersList() {
  const {data: orders = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetOrdersQuery('Orders')

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    return (
      <tbody>
      {isSuccess && orders && orders.map(order => <OrderItem key={order?.id} order={order}/>)}
      </tbody>
    )
  }, [isSuccess, orders])

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        thead={<AppTHead loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead} isImg/>}
        title='Liste des prdonnances'
        tbody={content} />
      {errors && errors}
    </>
  )
}
