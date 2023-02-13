import {AppDataTableBorderless, AppMainError, AppTHead} from "../../components";
import {useMemo} from "react";
import {CovenantPatientsItem} from "./CovenantPatientsItem";

const thead = [
  {label: '#'},
  {label: 'Nom'},
  {label: 'Sexe'},
  {label: 'État-civl'},
  {label: <><i className='bi bi-calendar-event'/></>},
]

export function CovenantPatientsList({patients, isError, isFetching, isLoading, onRefresh, isSuccess}) {
  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && patients) return <tbody>{patients?.map(patient =>
      <CovenantPatientsItem key={patient.id} patient={patient} onRefresh={onRefresh}/>)}</tbody>
  }, [isSuccess, patients, onRefresh])

  return (
    <>
      <AppDataTableBorderless
        title='Liste des patients'
        loader={isLoading}
        tbody={content}
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} items={thead} onRefresh={onRefresh}/>}/>
      {errors && errors}
    </>
  )
}
