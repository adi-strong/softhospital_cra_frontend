import {memo} from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const AppRichText = ({ value, onChange, onBlur, disabled = false }) => {
  return (
    <>
      <ReactQuill value={value} onChange={onChange} onBlur={onBlur} disabled={disabled} />
    </>
  )
}

export default memo(AppRichText)
