import {AppBreadcrumb, AppDataTableBorderless, AppHeadTitle, AppTHead} from "../../components";
import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {PatientItem} from "./PatientItem";
import img1 from '../../assets/app/img/messages-1.jpg';
import img2 from '../../assets/app/img/profile-img.jpg';
import img3 from '../../assets/app/img/messages-2.jpg';
import {Link} from "react-router-dom";
import {useState} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";

export const patients = [
  {id: 4, name: 'Mbuyi', firstName: 'Bernice', sex: 'F', maritalStatus: 'single', profile: img3},
  {id: 3, name: 'Akondjaka', firstName: 'Romeo', age: 29, sex: 'M', maritalStatus: 'married', profile: img2},
  {id: 2, name: 'Lifwa', firstName: 'Adivin', age: 28, sex: 'M'},
  {id: 1, name: 'Christelle', sex: 'F', maritalStatus: 'single', profile: img1},
]

function Patients() {
  const [keywords, setKeywords] = useState({search: ''})

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  function handleRefresh() {
  } // handle refresh list of patients (data)

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Patients' />
      <AppBreadcrumb title='Patients'/>
      <Card className='top-selling border-0'>
        <Card.Body>
          <AppDataTableBorderless
            title='Liste des patients'
            overview={
              <>
                <p>
                  {patients.length < 1
                    ? 'Aucun(e) patient(e) enregistré(e).'
                    : <>Il y a actuellement <code>{patients.length.toLocaleString()}</code> patient(s) enregistrés :</>}
                </p>
                <Col md={6}>
                  <Link
                    to='/member/patients/add'
                    title='Enregistrer un(e) patient(e)'
                    className='btn btn-primary mb-1 me-1'>
                    <i className='bi bi-plus'/> Ajouter
                  </Link>
                  <button type="button" className="btn btn-info mb-1" disabled={patients.length < 1}>
                    <i className='bi bi-printer'/> Impression
                  </button>
                </Col> {/* add new patient and printing's launch button */}
                <Col className='text-md-end'>
                  <form onSubmit={handleSubmit}>
                    <InputGroup>
                      <Form.Control
                        placeholder='Votre recherche ici...'
                        aria-label='Votre recherche ici...'
                        autoComplete='off'
                        disabled={patients.length < 1}
                        name='search'
                        value={keywords.search}
                        onChange={(e) => handleChange(e, keywords, setKeywords)} />
                      <Button type='submit' variant='secondary' disabled={patients.length < 1}>
                        <i className='bi bi-search'/>
                      </Button>
                    </InputGroup>
                  </form>
                </Col> {/* search form for patients */}
              </>
            }
            thead={<AppTHead isImg img={<i className='bi bi-image'/>} onRefresh={handleRefresh} items={[
              {label: '#'},
              {label: 'Nom'},
              {label: 'Âge'},
              {label: 'Sexe'},
              {label: 'Etat-civil'},
              {label: <i className='bi bi-question-circle'/>},
            ]} />}
            tbody={
              <tbody>
              {patients && patients.map(patient => <PatientItem key={patient.id} patient={patient}/>)}
              </tbody>
            } />
        </Card.Body>
      </Card>
    </div>
  )
}

export default Patients
