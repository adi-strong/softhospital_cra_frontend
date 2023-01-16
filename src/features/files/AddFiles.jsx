import {useState} from "react";
import {Button, InputGroup} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import {onAddArrayClick, onArrayChange, onRemoveArrayClick} from "../../services/handleFormsFieldsServices";

export const AddFiles = () => {
  const [files, setFiles] = useState([{name: ''}])

  const onReset = () => setFiles([{name: ''}])

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  return (
    <>
      {files.map((file, idx) =>
        <InputGroup key={idx} className='mb-3' data-aos='fade-in'>
          <AppInputField
            required
            name='name'
            value={file.name}
            onChange={(e) => onArrayChange(e, idx, files, setFiles)}
            placeholder='Libellé' />
          {files.length < 5 &&
            <Button type='button' variant='secondary' onClick={() => onAddArrayClick({name: ''}, files, setFiles)}>
              <i className='bi bi-plus'/>
            </Button>}
          {files.length > 1 &&
            <Button type='button' variant='dark' onClick={() => onRemoveArrayClick(idx, files, setFiles)}>
              <i className='bi bi-dash'/>
            </Button>}
        </InputGroup>)}

      <div className="text-md-center">
        <Button type='button' variant='secondary' onClick={onReset} className='me-1 mb-1'>
          Effacer
        </Button>
        <Button type='button' onClick={onSubmit} className='mb-1'>
          Enregistrer
        </Button>
      </div>
    </>
  )
}
