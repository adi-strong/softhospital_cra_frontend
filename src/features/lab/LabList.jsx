import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useGetLabItemsQuery} from "./labApiSlice";
import {useMemo} from "react";
import {LabItem} from "./LabItem";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: 'Date de prescription'},
]

export function LabList() {
  const {data: labs = [], isLoading, isFetching, isError, isSuccess, refetch} = useGetLabItemsQuery('Lab')

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => (
    <tbody>
    {isSuccess && labs && labs.map(lab => <LabItem key={lab.id} lab={lab} />)}
    </tbody>
  ), [isSuccess, labs])

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        thead={<AppTHead isImg onRefresh={onRefresh} isFetching={isFetching} items={thead}/>}
        tbody={content} />

      {errors && errors}
    </>
  )
}
