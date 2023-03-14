import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useMemo} from "react";
import {Link} from "react-router-dom";
import {useGetConsultationsQuery} from "./consultationApiSlice";
import {ConsultationItem} from "./ConsultationItem";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-person'/></>},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export const ConsultationsList = () => {
  const {
    data: consultations = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetConsultationsQuery('Consultations')


  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => (
    <tbody>
    {isSuccess && consultations && consultations.map(consult =>
      <ConsultationItem key={consult.id} consult={consult}/>)}
    </tbody>
  ), [isSuccess, consultations])

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        loader={isLoading}
        title='Liste des consultations'
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead} />}
        tbody={content}
        overview={
          <div className='mt-2'>
            <Link to='/member/treatments/consultations/add' className='btn btn-primary'>
              <i className='bi bi-plus me-1'/>
              Nouvelle consultation
            </Link>
          </div>
        } />

      {errors && errors}
    </>
  )
}
