import {memo} from "react";
import PropTypes from "prop-types";
import {Form, FormGroup, InputGroup} from "react-bootstrap";

function AppInputGroupField(
  {
    label,
    className,
    type = 'text',
    required = false,
    autoFocus = false,
    disabled = false,
    autoComplete = 'off',
    name,
    value,
    onChange,
    error = null,
    isTextBefore = false,
    textBefore,
    isTextAfter = false,
    textAfter,
  }) {
  return (
    <FormGroup className={className+' mb-3'}>
      {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
      <InputGroup>
        {isTextBefore && <InputGroup.Text>{textBefore}</InputGroup.Text>}
        <Form.Control
          id={name}
          autoFocus={autoFocus}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          type={type}
          name={name}
          value={value}
          onChange={onChange} />
        {isTextAfter && <InputGroup.Text>{textAfter}</InputGroup.Text>}
      </InputGroup>
      {error && <div className='text-danger'>{error}</div>}
    </FormGroup>
  )
}

AppInputGroupField.propTypes = {
  label: PropTypes.any,
  className: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  autoFocus: PropTypes.bool,
  disabled: PropTypes.bool,
  autoComplete: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.any,
  isTextBefore: PropTypes.bool,
  textBefore: PropTypes.any,
  isTextAfter: PropTypes.bool,
  textAfter: PropTypes.any,
}

export default memo(AppInputGroupField)
