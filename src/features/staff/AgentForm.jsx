
import {Button, Col, Form, Row, Spinner} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {AppSelectOptions} from "../../components";
import {handleChange, onSelectAsyncOption} from "../../services/handleFormsFieldsServices";
import AppInputField from "../../components/forms/AppInputField";

export const AgentForm = (
  {
    validated = false,
    onSubmit,
    agent,
    setAgent,
    office,
    setOffice,
    offices,
    apiErrors,
    onSelectDepartment,
    setService,
    services,
    service,
    onReset,
    departments,
    department,
    departmentLoading = false,
    loading = false,
    isLoading = false,
    servicesLoading = false,
    servicesFetching = false,
    agentId,
  }) => {
  return (
    <>
      <Form noValidate onSubmit={onSubmit} validated={validated}>
        <h5 className="card-title" style={cardTitleStyle}>Formulaire d'enregistrement</h5>
        <Row>
          <Col md={5}>
            <div className="mb-3">
              <Form.Label htmlFor='office'>Fonction <i className='text-danger'>*</i></Form.Label>
              <AppSelectOptions
                name='office'
                disabled={loading || isLoading}
                onChange={(e) => onSelectAsyncOption(e, setOffice)}
                options={offices}
                value={office}
                error={apiErrors.office}
                className='text-uppercase'
                placeholder='-- Fonction --' />
            </div>

            <div className="mb-3">
              <Form.Label htmlFor='department'>Département</Form.Label>
              <AppSelectOptions
                name='department'
                disabled={loading || departmentLoading}
                onChange={(e) => onSelectDepartment(e)}
                options={departments}
                value={department}
                className='text-uppercase'
                placeholder='-- Département --' />
            </div>

            <div className="mb-3">
              <Form.Label htmlFor='service'>Service</Form.Label>
              <AppSelectOptions
                name='service'
                disabled={loading || servicesLoading || servicesFetching}
                onChange={(e) => onSelectAsyncOption(e, setService)}
                options={services}
                value={service}
                className='text-uppercase'
                placeholder='-- Service --' />
            </div>
          </Col>
          <Col md={7}>
            <AppInputField
              required
              error={apiErrors.name}
              label={<>Nom de l'agent <i className='text-danger'>*</i></>}
              name='name'
              value={agent.name}
              onChange={(e) => handleChange(e, agent, setAgent)}
              disabled={loading} />
            <AppInputField
              label='Postnom'
              name='lastName'
              value={agent.lastName}
              error={apiErrors.lastName}
              onChange={(e) => handleChange(e, agent, setAgent)}
              disabled={loading} />
            <AppInputField
              label='Prénom'
              name='firstName'
              value={agent.firstName}
              error={apiErrors.firstName}
              onChange={(e) => handleChange(e, agent, setAgent)}
              disabled={loading} />

            <div className="inline-radio mb-3">
              <Form.Label className='me-3'>Sexe :</Form.Label>
              <Form.Check
                inline
                type='radio'
                label='Homme'
                name='sex'
                value={agent.sex === 'H'}
                checked={agent.sex === 'H'}
                onChange={() => setAgent({...agent, sex: 'H'})}
                id='inline-radio-1'>
              </Form.Check>
              <Form.Check
                inline
                type='radio'
                label='Femme'
                name='sex'
                value={agent.sex === 'F'}
                checked={agent.sex === 'F'}
                onChange={() => setAgent({...agent, sex: 'F'})}
                id='inline-radio-2'>
              </Form.Check>
              {apiErrors.sex && <div className='text-danger'>{apiErrors.sex}</div>}
            </div>

            <AppInputField
              required
              label={<>n° Téléphone <i className='text-danger'>*</i></>}
              name='phone'
              value={agent.phone}
              error={apiErrors.phone}
              onChange={(e) => handleChange(e, agent, setAgent)}
              disabled={loading} />
            <AppInputField
              type='email'
              label='Email'
              name='email'
              value={agent.email}
              error={apiErrors.email}
              onChange={(e) => handleChange(e, agent, setAgent)}
              disabled={loading} />
          </Col>
        </Row>

        <div className="text-center">
          {!agentId &&
            <Button type='button' variant='secondary' onClick={onReset} className='me-1' disabled={loading}>
              <i className='bi bi-arrow-clockwise'/> Effacer
            </Button>}
          <Button type='submit' disabled={loading}>
            {loading
              ? <>Veuillez patienter <Spinner animation='border' size='sm'/></>
              : agentId ? 'Modifier' : 'Enregistrer'}
          </Button>
        </div>
      </Form>
    </>
  )
}
