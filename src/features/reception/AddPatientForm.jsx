import {Button, Form, InputGroup, Spinner} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import AppInputField from "../../components/forms/AppInputField";

export const AddPatientForm = ({ loader = false, onSubmit, patient, setPatient, apiErrors, onReset }) => {
  return (
    <>
      <Form onSubmit={onSubmit}>
        <InputGroup className='mb-3'>
          <Form.Control
            required
            autoFocus
            autoComplete='off'
            error={apiErrors?.name}
            name='name'
            value={patient?.name}
            onChange={(e) => handleChange(e, patient, setPatient)}
            disabled={loader}
            placeholder='* Nom du patient' />

          <Form.Control
            autoComplete='off'
            error={apiErrors?.firstName}
            name='firstName'
            value={patient?.firstName}
            onChange={(e) => handleChange(e, patient, setPatient)}
            disabled={loader}
            placeholder='Prénom' />
        </InputGroup>

        <div className='mb-1'>
          <Form.Label className='me-3'>Sexe :</Form.Label>
          <Form.Check
            inline
            type='radio'
            label='Masculin'
            value={patient?.sex}
            onChange={() => setPatient({...patient, sex: 'M'})}
            checked={patient.sex === 'M'}
            id='M'/>

          <Form.Check
            inline
            type='radio'
            label='Féminin'
            value={patient?.sex}
            onChange={() => setPatient({...patient, sex: 'F'})}
            checked={patient.sex === 'F'}
            id='F'/>
        </div>

        <AppInputField
          name='tel'
          value={patient?.tel}
          onChange={(e) => handleChange(e, patient, setPatient)}
          disabled={loader}
          error={apiErrors.tel}
          label='n° Télphone'
          placeholder='n° Téléphone' />

        <div className='text-end'>
          <Button type='button' disabled={loader} onClick={onReset} className='bg-transparent border-0 text-dark'>
            <i className='bi bi-arrow-clockwise'/>
          </Button>
          <Button type='submit' className='mx-1' disabled={loader}>
            <i className='bi bi-person-plus me-1'/>
            {loader ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
          </Button>
        </div>
      </Form>
    </>
  )
}
