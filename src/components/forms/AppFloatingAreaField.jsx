import {memo} from "react";
import {FloatingLabel, Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AppFloatingAreaField = (
  {
    name,
    label,
    value,
    onChange,
    rows = null,
    placeholder,
    disabled = false,
    required = false,
    autofocus = false,
  }) => {
  return (
    <>
      <FloatingLabel
        controlId={name}
        label={label}
        className='mb-3'>
        <Form.Control
          as='textarea'
          style={{ minHeight: rows }}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autofocus}
          required={required} />
      </FloatingLabel>
    </>
  )
}

AppFloatingAreaField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  autofocus: PropTypes.bool,
}

export default memo(AppFloatingAreaField)
