import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {Link} from "react-router-dom";
import {useMemo} from "react";
import {AgentConsultationItem} from "./AgentConsultationItem";

const thead = [
  {label: '#'},
  {label: 'Fiche'},
  {label: 'Patient(e)'},
  {label: <><i className='bi bi-person'/></>},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export function AgentConsultationsList({ consultations, isSuccess, isLoading, isFetching, onRefresh, isError }) {
  let errors, content
  errors = useMemo(() => {
    if (isError) return <AppMainError/>
  }, [isError])

  content = useMemo(() => {
    if (isSuccess && consultations) return (
      <tbody>{consultations?.map(consult => <AgentConsultationItem key={consult?.id} consult={consult}/>)}</tbody>
    )
  }, [isSuccess, consultations])

  return (
    <>
      <AppDataTableStripped
        loader={isLoading || isFetching}
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
