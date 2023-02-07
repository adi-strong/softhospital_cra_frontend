import {useEffect, useState} from "react";
import {useCallback} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {PatientForm} from "./PatientForm";
import {Button, Card, Col, Row} from "react-bootstrap";
import img from "../../assets/app/img/default_profile.jpg";

const style = {
  fontSize: 24,
  fontWeight: 700,
  color: 'rgb(44, 56, 78)',
  margin: '10px 0 0'
}

const AddPatient = () => {
  const dispatch = useDispatch()
  const [patient, setPatient] = useState({
    wording: '',
    lastName: '',
    firstName: '',
    sex: 'none',
    birthDate: '',
    birthPlace: '',
    maritalStatus: 'none',
    tel: '',
    email: '',
    father: '',
    mother: '',
    address: '',
  }) // patient's local state

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/patients'))
  }, [dispatch]) // toggle dropdown patients menu

  const currentYear = new Date().getFullYear()
  const birthYear = patient.birthDate ? parseInt(patient.birthDate.split('-')[0]) : currentYear
  const age = currentYear - birthYear

  const handleChangeAge = useCallback((e) => {
    handleChange(e, patient, setPatient)
  }, [patient]) // handle change birthDate and patient's age

  function handleReset() {
    setPatient({
      address: '',
      birthDate: '',
      tel: '',
      birthPlace: '',
      father: '',
      firstName: '',
      lastName: '',
      maritalStatus: 'none',
      sex: 'none',
      mother: '',
      name: '',
    })
  } // handle reset fields

  function onSubmit(e) {
    e.preventDefault()
  } // on submit

  return (
    <>
      <AppHeadTitle title='Enregistrement du patient' />
      <AppBreadcrumb title='Enregistrement du patient' links={[{label: 'Patients', path: '/patients'}]} />
      <Row className='section'>
        <Col md={4}>
          <Card className='border-0'>
            <Card.Body className='profile-card pt-4 d-flex flex-column align-items-center'>
              <Col>
                <img src={img} width={120} height={120} className='rounded-circle' alt=''/>
                <h5 style={style}>Profil Image</h5>
                <div className="pt-2 px-4">
                  <Button type='button' variant='primary' className='btn-sm me-1' title='Nouveau profil'>
                    <i className="bi bi-upload"/>
                  </Button>
                  <Button type='button' variant='danger' className="btn-sm" title='Supprimer le profil'>
                    <i className='bi bi-trash'/>
                  </Button>
                </div>
              </Col>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <Card className='border-0'>
            <Card.Body>
              <PatientForm
                labelBtn='Enregistrer'
                labelResetBtn='Effacer'
                handleReset={handleReset}
                age={age}
                handleChangeAge={handleChangeAge}
                setPatient={setPatient}
                patient={patient}
                onSubmit={onSubmit} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
}

export default AddPatient
