import {memo} from "react";
import {Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AppInputField = (
  {
    name,
    value,
    onChange,
    placeholder,
    className = '',
    type = 'text',
    autoComplete = 'off',
    disabled = false,
    required = false,
    autofocus = false,
    label,
    error = null,
  }) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
      <Form.Control
        id={name}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder}
        autoFocus={autofocus}
        required={required} />
      {error && <div className='text-danger'>{error}</div>}
    </div>
  )
}

AppInputField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  className: PropTypes.string,
  autoComplete: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autofocus: PropTypes.bool,
  label: PropTypes.any,
}

export default memo(AppInputField)
