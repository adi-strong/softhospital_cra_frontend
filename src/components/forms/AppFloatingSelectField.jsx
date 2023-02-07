import {memo} from "react";
import {FloatingLabel, Form} from "react-bootstrap";
import PropTypes from "prop-types";

const AppFloatingSelectField = (
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
    <>
      <FloatingLabel controlId={name} label={label} className={className}>
        <Form.Select
          aria-label={label}
          defaultValue={value}
          onChange={onChange}
          disabled={disabled}
          required={required}>
          <option value='none'>-- Choix de la catégorie de la chambre --</option>
          {options && options.map((option, idx) =>
            <option key={idx} value={option.value} className='text-capitalize'>
              {option.label}
            </option>)}
        </Form.Select>
        {error && <div className='text-danger mt-0'>{error}</div>}
      </FloatingLabel>
    </>
  )
}

AppFloatingSelectField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.any,
  label: PropTypes.any.isRequired,
  className: PropTypes.string,
  options: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
}

export default memo(AppFloatingSelectField)
