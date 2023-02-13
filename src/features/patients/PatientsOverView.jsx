import {Button, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {Link} from "react-router-dom";

export function PatientsOverView({patients, totalItems, setSearch, search}) {
  async function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <p>
        {totalItems > 0
          ? <>Il y a au total <code>{totalItems.toLocaleString()}</code> patient(s) enregistré(s) :</>
          : 'Auucun patient enregistré pour le moment 🎈'}
      </p>

      <Col className='mb-2'>
        <Form onSubmit={onSubmit}>
          <InputGroup>
            <Button type='submit' variant='light'><i className='bi bi-search'/></Button>
            <Form.Control
              name='keyword'
              value={search?.keyword}
              onChange={(e) => handleChange(e, search, setSearch)} />
          </InputGroup>
        </Form>
      </Col>

      <Col md={3}>
        <Link to='/member/patients/add' className='btn btn-primary w-100'>
          <i className='bi bi-person-plus'/> Enregistrer un patient
        </Link>
      </Col>
    </>
  )
}
