import {AppDataTableStripped, AppTHead} from "../../components";
import {Link} from "react-router-dom";
import {Button, ButtonGroup} from "react-bootstrap";
import moment from "moment";

const consultations = [
  {id: 2, patient: 'Romeo akondjaka', createdAt: '2023-01-07 19:48', isCompleted: false},
  {id: 1, patient: 'Derrick tukayana', createdAt: '2023-01-08 06:01', isCompleted: true},
]

const ConsultationItem = ({consultation}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-file-medical'/></td>
        <th scope='row'>{consultation.id}</th>
        <td className='text-uppercase'>
          <Link to={`#!`} className='text-decoration-none'>
            {consultation.patient}
          </Link>
        </td>
        <td><i className='bi bi-dash'/></td>
        <td><i className='bi bi-x'/></td>
        <td>{consultation?.createdAt ? moment(consultation.createdAt).calendar() : '-'}</td>
        <td className='text-md-end'>
          <ButtonGroup>
            <Link to={`#!`} className='text-decoration-none btn btn-light p-0 pe-1 px-1' title='Modifier'>
              <i className='bi bi-pencil'/>
            </Link>
            <Button type='button' variant='light' className='p-0 pe-1 px-1' title='Supprimer'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const ConsultationsList = () => {
  function onRefresh() {
  }

  return (
    <>
      <AppDataTableStripped
        title='Liste de fiches de consultation'
        overview={
          <>
            <p>
              {consultations.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Il y a au total <code>{consultations.length.toLocaleString()}</code> fiches(s) de consultation :</>}
            </p>
            <p>
              <Link to='/treatments/consultations/add' className={`btn btn-primary mb-1 me-1`}>
                <i className='bi bi bi-plus-circle-dotted'/> Anamnèse &amp; signes vitaux
              </Link>
              <Button type="button" variant='info' className='mb-1' disabled={consultations.length < 1}>
                <i className='bi bi-printer'/> Impression
              </Button>
            </p>
          </>
        }
        thead={<AppTHead isImg onRefresh={onRefresh} items={[
          {label: '#'},
          {label: 'Patient(e)'},
          {label: <i className='bi bi-question-circle'/>},
          {label: <i className='bi bi-check-square'/>},
          {label: "Date d'enregistrement"},
        ]}/>}
        tbody={
          <tbody>
          {consultations && consultations?.map(consultation =>
            <ConsultationItem key={consultation.id} consultation={consultation}/>)}
          </tbody>
        } />
    </>
  )
}
