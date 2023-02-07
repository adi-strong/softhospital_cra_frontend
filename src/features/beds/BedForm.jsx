import {AppAsyncSelectOptions} from "../../components";
import {Button, Col, Form, InputGroup, Row} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import AppInputField from "../../components/forms/AppInputField";

export const BedForm = (
  {
    apiErrors,
    options,
    bed,
    setBed,
    isFetching = false,
    isLoading = false,
    onSelectBedroom,
    onLoadBedrooms,
    currency,
    currencySymbol1,
    currencySymbol2,
    onReset,
    data,
  }) => {
  return (
    <>
      <div className="mb-3">
        <AppAsyncSelectOptions
          error={apiErrors.bedroom}
          label='Chambre'
          defaultOptions={options}
          value={bed.bedroom}
          disabled={isFetching || isLoading}
          onChange={onSelectBedroom}
          loadOptions={onLoadBedrooms}
          placeholder='Chambre'
          className='text-uppercase'/>
      </div>

      <Row>
        <Col md={6} className='mb-3'>
          <Form.Label htmlFor='cost'>Coût <i className='text-danger'>*</i></Form.Label>
          <InputGroup>
            {currency && currencySymbol1}
            <Form.Control
              required
              autoFocus
              disabled={isLoading}
              id='cost'
              type='number'
              name='cost'
              value={bed.cost}
              onChange={(e) => handleChange(e, bed, setBed)} />
            {currency && currencySymbol2}
          </InputGroup>
          {apiErrors.cost && <div className='text-danger'>{apiErrors.cost}</div>}
        </Col>
        <Col md={6} className='mb-3'>
          <Form.Label htmlFor='price'>Prix <i className='text-danger'>*</i></Form.Label>
          <InputGroup>
            {currency && currencySymbol1}
            <Form.Control
              required
              disabled={isLoading}
              id='price'
              type='number'
              name='price'
              value={bed.price}
              onChange={(e) => handleChange(e, bed, setBed)} />
            {currency && currencySymbol2}
          </InputGroup>
          {apiErrors.price && <div className='text-danger'>{apiErrors.price}</div>}
        </Col>
      </Row>

      <AppInputField
        required
        error={apiErrors.number}
        disabled={isLoading}
        label={<>Lit <i className='text-danger'>*</i></>}
        name='number'
        value={bed.number}
        placeholder='n°, Etiquette, etc.'
        onChange={(e) => handleChange(e, bed, setBed)} />

      {!data &&
        <Button type='reset' variant='light' className='w-100' onClick={onReset}>
          <i className='bi bi-trash3'/>
        </Button>}
    </>
  )
}
