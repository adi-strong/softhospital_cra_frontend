import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useGetPrescriptionsQuery} from "./prescriptionApiSlice";
import {useMemo} from "react";
import {PrescriptionItem} from "./PrescriptionItem";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-person'/> Par</>},
  {label: 'Date de prescription'},
]

export function PrescriptionsList() {
  const {data: prescriptions = [], isLoading, isFetching, isSuccess, isError, refetch} =
    useGetPrescriptionsQuery('Prescription')

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    return (
      <tbody>
      {isSuccess && prescriptions && prescriptions.map(
        prescription => <PrescriptionItem key={prescription?.id} prescription={prescription}/>
      )}
      </tbody>
    )
  }, [isSuccess, prescriptions])

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        thead={<AppTHead loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead} isImg/>}
        tbody={content} />
      {errors && errors}
    </>
  )
}
