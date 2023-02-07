import {memo} from "react";
import AsyncSelect from "react-select/async";
import makeAnimated from 'react-select/animated';
import PropTypes from "prop-types";

const animatedComponents = makeAnimated()

const AppAsyncSelectOptions = (
  {
    label,
    placeholder,
    className,
    error = null,
    disabled = false,
    isMulti = false,
    closeMenuOnSelect = true,
    defaultOptions = [],
    onChange,
    loadOptions,
    value,
  }) => {
  return (
    <>
      {label && <div className='mb-2'>{label}</div>}
      <AsyncSelect
        placeholder={placeholder}
        components={animatedComponents}
        className={className}
        isDisabled={disabled}
        defaultOptions={defaultOptions}
        onChange={onChange}
        loadOptions={loadOptions}
        value={value}
        isMulti={isMulti}
        closeMenuOnSelect={closeMenuOnSelect}
        isClearable />
      {error && <div className='text-danger'>{error}</div>}
    </>
  )
}

AppAsyncSelectOptions.propTypes = {
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  defaultOptions: PropTypes.array,
  onChange: PropTypes.func.isRequired,
  loadOptions: PropTypes.func.isRequired,
  value: PropTypes.any,
  isMulti: PropTypes.bool,
  closeMenuOnSelect: PropTypes.bool,
}

export default memo(AppAsyncSelectOptions)
