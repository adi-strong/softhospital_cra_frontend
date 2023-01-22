import PropTypes from "prop-types";
import {useState} from "react";
import {Button, Col, Modal, Row, Spinner} from "react-bootstrap";
import ImageUploading from 'react-images-uploading';
import {useAddNewImageMutation} from "./imageApiSlice";
import toast from "react-hot-toast";

export const style = {
  width: '100%',
  height: 120,
}

export const AddImage = ({onHide, show = false}) => {
  const [images, setImages] = useState([])
  const [addNewImage, {isLoading}] = useAddNewImageMutation()
  const maxNumber = 69

  function onChange(imageList, addUpdateIndex) {
    setImages(imageList)
  }

  async function onSubmit(e) {
    e.preventDefault()
    let files = [...images]
    if (images && images.length > 0) {
      for (const key in images) {
        const formData = new FormData()
        formData.append('file', images[key].file)
        const data = await addNewImage(formData)
        if (!data.error) {
          files = files.filter(file => file.file !== images[key].file)
          setImages(files)
          toast.success('Enregistreement bien efféctué.')
        }
        else {
          const violations = data.error.data.violations
          if (violations) {
            violations.forEach(({propertyPath, message}) => {
              toast.error(`${propertyPath}: ${message}`, {
                style: {
                  background: 'red',
                  color: '#fff',
                }
              })
            })
          }
        }
      }
    } else alert('Veuillez insérer une ou plusieurs images !')
  }

  return (
    <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter une image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ImageUploading
          multiple
          value={images}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url">
          {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
              errors,
            }) => (
            // write your building UI
            <div>
              <Button
                disabled={isLoading}
                type='button'
                variant='dark'
                className='d-block w-100 mb-3'
                onClick={onImageUpload}
                style={isDragging
                  ? { color: 'red', height: 150 } : { height: 150 }}
                {...dragProps}>
                <i className='bi bi-upload me-1'/>
                Cliquer / Glissez
                <i className='bi bi-dash mx-1 me-1'/>
                déposer
                <i className='bi bi-file-image mx-1'/>
              </Button>
              <Row style={{ border: 'dashed 2px solid black' }}>
                {imageList.map((image, index) => (
                  <Col key={index} md={4} className="image-item mb-3">
                    <img src={image['data_url']} style={style} alt='' />
                    <div className="text-center mt-1">
                      <Button
                        disabled={isLoading}
                        type='button'
                        variant='light'
                        size='sm'
                        onClick={() => onImageUpdate(index)} className='mb-1 me-1'>
                        <i className='bi bi-pencil-square text-primary'/>
                      </Button>
                      <Button
                        disabled={isLoading}
                        type='button'
                        variant='light'
                        size='sm'
                        onClick={() => onImageRemove(index)} className='mb-1'>
                        <i className='bi bi-trash3 text-danger'/>
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
              {errors &&
                <div className='text-danger'>
                  {errors.maxNumber && <span>Number of selected images exceed maxNumber</span>}
                  {errors.acceptType && <span>Your selected file type is not allow</span>}
                  {errors.maxFileSize && <span>Selected file size exceed maxFileSize</span>}
                  {errors.resolution && <span>Selected file is not match your desired resolution</span>}
                </div>}
              <Button
                disabled={isLoading}
                type='button'
                variant='secondary'
                className='d-block w-100 mt-2'
                onClick={onImageRemoveAll}>
                <i className='bi bi-trash'/> Tout supprimer
              </Button>
            </div>
          )}
        </ImageUploading>
      </Modal.Body>
      <Modal.Footer>
        <Button disabled={isLoading} type='button' variant='light' onClick={onHide}>
          <i className='bi bi-x'/> Fermer
        </Button>
        <Button disabled={isLoading} type='button' onClick={onSubmit}>
          {isLoading
            ? <>
              Veuillez patienter s'il vous plaît <Spinner animation='border' size='sm'/>
            </>
            : 'Ajouter'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

AddImage.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
