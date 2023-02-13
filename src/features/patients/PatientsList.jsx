import {totalPatients, useGetPatientsQuery} from "./patientApiSlice";
import {useMemo, useState} from "react";
import {AppDataTableBorderless, AppMainError, AppTHead} from "../../components";
import {PatientItem} from "./PatientItem";
import {PatientsOverView} from "./PatientsOverView";

const tHead = [
  {label: '#'},
  {label: 'Nom'},
  {label: 'Sexe'},
  {label: 'Âge'},
  {label: 'État-civil'},
  {label: <><i className='bi bi-question-circle'/></>},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export function PatientsList() {
  const [search, setSearch] = useState({keyword: ''})
  const {data: patients = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetPatientsQuery('Patient')

  const onRefresh = async () => await refetch()

  let content, error
  if (isError) error = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && patients) return (
      <tbody>
      {patients.map(patient => <PatientItem key={patient.id} patient={patient}/>)}
      </tbody>)
  }, [isSuccess, patients])

  return (
    <>
      <AppDataTableBorderless
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={tHead}/>}
        loader={isLoading}
        tbody={content}
        title='Liste des patients'
        overview={
          <PatientsOverView totalItems={totalPatients} patients={patients} search={search} setSearch={setSearch}/>
        } />
      {error && error}
    </>
  )
}
