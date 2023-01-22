import {memo} from "react";
import Select from "react-select";
import PropTypes from "prop-types";

const AppChooseField = (
  {
    name,
    onChange,
    value,
    options = [],
    placeholder = '-- Aucun élément sélectionné --',
    isDisabled = false,
    isRtl = false,
    required = false,
    error = null,
  }) => {
  return (
    <>
      <Select
        required={required}
        isClearable
        isRtl={isRtl}
        isDisabled={isDisabled}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        options={options}/>
      {error && <div className="text-danger">{error}</div>}
    </>
  )
}

AppChooseField.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any,
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string,
  isDisabled: PropTypes.bool,
  isRtl: PropTypes.bool,
  required: PropTypes.bool,
}

export default memo(AppChooseField)
