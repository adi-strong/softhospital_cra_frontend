import {memo} from "react";
import {Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AppSelectField = (
  {
    name,
    value,
    label,
    error = null,
    onChange,
    className,
    options = [],
    disabled = false,
    required = false,
  }) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && <Form.Label htmlFor={name}>{label}</Form.Label>}
      <Form.Select
        id={name}
        defaultValue={value}
        onChange={onChange}
        disabled={disabled}
        required={required}>
        {options && options.map((option, idx) =>
          <option key={idx} value={option.value}>
            {option.label}
          </option>)}
      </Form.Select>
      {error && <div className='text-danger mt-0'>{error}</div>}
    </div>
  )
}

AppSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  className: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
}

export default memo(AppSelectField)
