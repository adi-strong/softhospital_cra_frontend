import {memo} from "react";
import {Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AppInputField = (
  {
    name,
    value,
    onChange,
    placeholder,
    type = 'text',
    autoComplete = 'off',
    disabled = false,
    required = false,
    autofocus = false,
    error = null,
  }) => {
  return (
    <>
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
    </>
  )
}

AppInputField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autofocus: PropTypes.bool,
}

export default memo(AppInputField)
