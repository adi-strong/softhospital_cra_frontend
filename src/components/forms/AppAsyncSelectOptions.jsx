import {memo} from "react";
import AsyncSelect from "react-select/async";
import makeAnimated from 'react-select/animated';
import PropTypes from "prop-types";

const animatedComponents = makeAnimated()

const AppAsyncSelectOptions = (
  {
    placeholder,
    className,
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
  value: PropTypes.any.isRequired,
  isMulti: PropTypes.bool,
  closeMenuOnSelect: PropTypes.bool,
}

export default memo(AppAsyncSelectOptions)
