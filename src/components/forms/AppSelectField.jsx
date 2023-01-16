import {memo} from "react";
import {Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AppSelectField = (
  {
    name,
    value,
    onChange,
    options = [],
    disabled = false,
    required = false,
  }) => {
  return (
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
  )
}

AppSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
}

export default memo(AppSelectField)
