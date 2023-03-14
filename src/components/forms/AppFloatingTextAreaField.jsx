import {memo} from "react";
import {FloatingLabel, Form} from "react-bootstrap";

const style = { minHeight: 100 }

const AppFloatingTextAreaField = (
  {
    name,
    label,
    value,
    text,
    onChange,
    placeholder,
    error = null,
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
        style={style}
        required={required}
        autoFocus={autofocus}
        as='textarea'
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        autoComplete={autoComplete}
        placeholder={placeholder} />
      {error && <div className='text-danger'>{error}</div>}
      {text && <Form.Text muted>{text}</Form.Text>}
    </FloatingLabel>
  )
}

export default memo(AppFloatingTextAreaField)
