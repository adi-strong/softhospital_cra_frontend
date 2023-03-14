import DatePicker from 'react-datepicker'
import PropTypes from "prop-types";
import {memo} from "react";
import {FormLabel} from "react-bootstrap";

const AppDatePicker = (
  {
    label,
    value,
    onChange,
    disabled = false,
  }) => {
  return (
    <>
      {label && <FormLabel>{label}</FormLabel>}
      <DatePicker
        showTimeSelect
        className='form-control text-capitalize'
        disabled={disabled}
        selected={value}
        onChange={onChange}
        locale='fr'
        timeIntervals={15}
        dateFormat='dd MMM yyyy, à HH:mm' />
    </>
  )
}

AppDatePicker.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
}

export default memo(AppDatePicker)
