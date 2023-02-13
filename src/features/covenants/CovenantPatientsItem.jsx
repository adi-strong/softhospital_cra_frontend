import {useState} from "react";
import {useDeletePatientMutation} from "../patients/patientApiSlice";
import {entrypoint} from "../../app/store";
import toast from "react-hot-toast";
import img from "../../assets/app/img/default_profile.jpg";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {AppDelModal} from "../../components";

export const CovenantPatientsItem = ({patient, onRefresh}) => {
  const [show, setShow] = useState(false)
  const [deletePatient, {isLoading}] = useDeletePatientMutation()

  const sex = patient?.sex
    ? patient.sex !== 'none' && patient.sex === 'M'
      ? 'Masculin'
      : patient.sex !== 'none' && patient.sex === 'F' && 'Féminin'
    : null

  const maritalStatus = patient?.maritalStatus
    ? patient.maritalStatus !== 'none' && patient.maritalStatus === 'single'
      ? 'Célibataire'
      : patient.maritalStatus !== 'none' && patient.maritalStatus === 'married' && 'Marié(e)'
    : null

  const profile = patient?.profile
    ? entrypoint+patient.profile.contentUrl
    : null

  const toggleModal = () => setShow(!show)

  async function onDelete() {
    toggleModal()
    try {
      const data = await deletePatient(patient)
      if (!data.error) {
        toast.success('Suppression bien efféctuée.', {icon: '😶'})
        onRefresh()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <th scope='row'>
          <img
            src={profile ? profile : img}
            width={40}
            height={40}
            alt='' />
        </th>
        <td className='fw-bold'>#{patient.id}</td>
        <td className='text-capitalize fw-bold text-primary'>
          <Link to={`/member/patients/${patient.id}/${patient.slug}`} className='text-decoration-none'>
            {patient?.firstName && patient.firstName+' '}
            <span className='text-uppercase'>{patient?.name}</span>
          </Link>
        </td>
        <td className='text-capitalize'>{sex ? sex : '❓'}</td>
        <td className='text-capitalize'>{maritalStatus ? maritalStatus : '❓'}</td>
        <td>{patient?.createdAt ? patient.createdAt : '❓'}</td>
        <td>
          <Button type='button' variant='danger' size='sm' onClick={toggleModal} className='w-100' disabled={isLoading}>
            <i className='bi bi-trash'/>
          </Button>
        </td>
      </tr>

      <AppDelModal
        onHide={toggleModal}
        show={show}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer{' '}
            {patient?.sex === 'M' && 'le patient'}
            {patient?.sex === 'F' && 'la patiente'} <br/>
            <i className='bi bi-quote me-1'/>
            <span className='text-uppercase fw-bold'>{patient?.name}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}
