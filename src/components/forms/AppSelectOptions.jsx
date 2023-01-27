import {memo} from "react";
import Select from "react-select";
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated()

const AppSelectOptions = (
  {
    placeholder,
    className,
    error = null,
    disabled = false,
    isMulti = false,
    closeMenuOnSelect = true,
    options = [],
    onChange,
    value,
    name,
  }) => {
  return (
    <>
      <Select
        id={name}
        placeholder={placeholder}
        components={animatedComponents}
        className={className}
        isDisabled={disabled}
        isMulti={isMulti}
        options={options}
        onChange={onChange}
        value={value}
        closeMenuOnSelect={closeMenuOnSelect}
        isClearable />
      {error && <span className='text-danger'>{error}</span>}
    </>
  )
}

export default memo(AppSelectOptions)
