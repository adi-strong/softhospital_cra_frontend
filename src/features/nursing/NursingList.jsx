import {useGetNursingsQuery} from "./nursingApiSlice";
import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useMemo} from "react";
import {NursingItem} from "./NursingItem";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
]

export function NursingList() {
  const {data: nursings = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetNursingsQuery('Nursing')

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    return (
      <tbody>
      {isSuccess && nursings && nursings.map(nursing =>
        <NursingItem
          key={nursing?.id}
          nursing={nursing}/>
      )}
      </tbody>
    )
  }, [isSuccess, nursings])

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead}/>}
        title='Traitements des patients'
        tbody={content} />
      {errors && errors}
    </>
  )
}

export default NursingList
