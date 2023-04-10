import {Button, Card, Form, Spinner} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {entrypoint} from "../../app/store";
import {useState} from "react";
import {useOnPostNewCovenantContractMutation} from "./covenantApiSlice";
import toast from "react-hot-toast";

export function SingleContract({isLoading, isSuccess, covenant, onRefresh,}) {
  const [file, setFile] = useState('')
  const [onPostNewCovenantContract, {isLoading: isLoad}] = useOnPostNewCovenantContractMutation()

  const onFileChange = ({ target }) => setFile(target.files[0])

  const onReset = () => setFile('')

  async function onSubmit() {
    const formData = new FormData()
    formData.append('file', file ? file : null)
    try {
      const submit = await onPostNewCovenantContract({...covenant, file: formData})
      if (!submit?.error) {
        toast.success('Le contrat a bien été renseigné.')
        setFile('')
        onReset()
        onRefresh()
      }
    } catch (e) { }
  }

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <h2><i className='bi bi-filetype-pdf me-3'/> Contrat</h2> <hr className='mt-0'/>
          {isLoading && <BarLoaderSpinner loading={isLoading}/>}
          {isSuccess && covenant &&
            <>
              {!file && covenant?.filePath &&
                <a href={entrypoint+'/media/pdf/'+covenant.filePath} target='_blank' rel='noreferrer'>
                  <i className='bi bi-file-pdf-fill'/> {covenant.filePath}
                </a>}
              {file && <i className='bi text-primary'><i className='bi bi-file-pdf'/> {file?.name}</i>}
              <input
                type='file'
                accept='application/pdf'
                onChange={onFileChange}
                id='file'
                hidden />
              <Form.Label htmlFor='file' className={`btn btn-light d-block w-100`}>
                <i className='bi bi-file-arrow-up'/>
              </Form.Label>
              {file &&
                <div className='text-center'>
                  <Button type='button' variant='info' size='sm' className='w-100 mb-2' disabled={isLoad} onClick={onSubmit}>
                    <i className='bi bi-check me-1'/>
                    {!isLoad ? 'Valider' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
                  </Button>
                  <Button
                    type='button'
                    variant='secondary'
                    size='sm'
                    className='w-100'
                    disabled={isLoad}
                    onClick={onReset}>
                    <i className='bi bi-x'/> Annuler
                  </Button>
                </div>}
            </>}
        </Card.Body>
      </Card>
    </>
  )
}
