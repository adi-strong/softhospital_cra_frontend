import {memo} from "react";
import {FloatingLabel, Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AppFloatingInputField = (
  {
    name,
    label,
    value,
    onChange,
    placeholder,
    text,
    maxLength = undefined,
    type = 'text',
    autoComplete = 'off',
    disabled = false,
    required = false,
    autofocus = false,
  }) => {
  return (
    <FloatingLabel
      controlId={name}
      label={label}
      className='mb-3'>
      <Form.Control
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        maxLength={maxLength}
        placeholder={placeholder}
        autoFocus={autofocus}
        required={required} />
      {text && <Form.Text muted>{text}</Form.Text>}
    </FloatingLabel>
  )
}

AppFloatingInputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  autoComplete: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autofocus: PropTypes.bool,
}

export default memo(AppFloatingInputField)
