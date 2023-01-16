import {useState} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";

const files = [
  {id: 3, name: 'Consultation prénatale'},
  {id: 2, name: 'Elèctro-phoreuse'},
  {id: 1, name: 'Badaboum'},
]

const FileItem = ({file}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-file-medical'/></td>
        <th scope='row'>{file.id}</th>
        <td className='text-capitalize'>{file.name}</td>
        <td className='text-end'>
          <ButtonGroup>
            <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Modifier'>
              <i className='bi bi-pencil'/>
            </Button>
            <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Supprimer'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const FilesList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  // const [show, setShow] = useState(false)

  // const onToggleShow = () => setShow(!show)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        title='Liste de types des fiches'
        overview={
          <>
            <p>
              {files.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Il y a au total <code>{files.length.toLocaleString()}</code> types de fiches(s) enregistré(s) :</>}
            </p>
            <Col className='text-md-end'>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={files.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={files.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg onRefresh={onRefresh} items={[{label: '#'}, {label: 'Libellé'}]}/>}
        tbody={
          <tbody>
          {files && files?.map(file => <FileItem key={file.id} file={file}/>)}
          </tbody>
        } />
    </>
  )
}
