import {useEffect, useState} from "react";
import {Alert, Button, Col, Form, InputGroup, Modal, Row, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {totalImages, useDeleteImageMutation, useGetImagesQuery} from "./imageApiSlice";
import toast from "react-hot-toast";
import {entrypoint} from "../../app/store";
import {limitStrTo} from "../../services";
import {AppDelModal} from "../../components";
import {AppClipLoader} from "../../loaders";
import {AddImage} from "./AddImage";
import {handleChange} from "../../services/handleFormsFieldsServices";

const overrideStyle = {
  position: 'relative',
  top: 24,
}

const style = {width: '100%', height: 100, cursor: 'pointer'}

const Item = ({id, selectedTarget, onSelected, setState}) => {
  const { image } = useGetImagesQuery('Images', {
    selectFromResult: ({ data }) => ({ image: data?.entities[id] })
  })
  const [show, setShow] = useState(false)
  const [check, setCheck] = useState(false)
  const [deleteImage, {isLoading}] = useDeleteImageMutation()

  useEffect(() => {
    if (selectedTarget !== id) setCheck(false)
  }, [selectedTarget, id])

  useEffect(() => {
    if (check && image) setState({id: `/api/image_objects/${image.id}`, contentUrl: image.contentUrl})
    else setState(null)
  }, [check, image, setState])

  const toggleShow = () => setShow(!show)

  async function onDelete(id) {
    toggleShow()
    try {
      await deleteImage(id)
      toast.success('Suppression bien efféctuée.', {
        icon: '👌',
        style: {
          background: '#142db7',
          color: '#fff',
        }
      })
    } catch (e) {
      toast.error(e.message, {
        icon: '🤕',
        style: {
          background: 'red',
          color: '#fff'
        }
      })
    }
  }

  return (
    <>
      <Col md={6} lg={4}>
        <div className='text-end px-1'>
          <Form.Check
            id={id}
            onChange={(e) => onSelected(e, id, check, setCheck)}
            name='check'
            value={check}
            checked={check}
            style={overrideStyle}/>
        </div>
        <div className="bed">
          <img src={entrypoint+`${image.contentUrl}`} className="img-fluid" alt="" style={style}/>
          <div className='bed-content'>
            <h4 className='pt-2'>{limitStrTo(20, image.filePath)}</h4>
            <span>{image?.createdAt ? image.createdAt : '-'}</span>
            <div className='pt-0 mt-2'>
              <Button
                style={{ borderRadius: 0 }}
                type='button'
                variant='danger'
                className='w-100'
                onClick={toggleShow}
                disabled={isLoading}
                title='Suppression'>
                {isLoading
                  ? <><Spinner animation='grow' size='sm'/></>
                  : <i className='bi bi-trash3'/>}
              </Button>
            </div>
          </div>
        </div>
      </Col>

      <AppDelModal
        show={show}
        onHide={toggleShow}
        onDelete={() => onDelete(image.id)}
        text={
          <p className='text-center'>
            <img
              src={entrypoint+`${image.contentUrl}`}
              className="img-fluid"
              alt=""
              style={{ width: '100%', height: 100 }}/>
            Êtes-vous certain(e) de vouloir supprimer{' '}
            cette image
            <i className='bi bi-question-diamond mx-1 text-danger'/>
          </p>
        } />
    </>
  )
}

export const AddImageModal = ({show, onHide, item, itemState, setItemState}) => {
  const {data: images = [], isLoading, isSuccess, isError, isFetching, refetch} = useGetImagesQuery('Images')
  const [showNew, setShowNew] = useState(false)
  const [keywords, setKeywords] = useState({search: ''})
  const [selectedTarget, setSelectedTarget] = useState(0)
  const [file, setFile] = useState(null)

  const handleToggleNewImage = () => setShowNew(!showNew)

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  function handleCheckImage(event, id, state, setState) {
    const target = event.target
    const currentId = parseInt(target.id)
    if (id === currentId) {
      setState(target.checked)
      setSelectedTarget(currentId)
    }
  }

  const handleRefresh = async () => await refetch()

  function onChooseFile() {
    if (file) {
      setItemState({...itemState, [item]: file})
      onHide()
    }
  }

  let content
  if (isLoading) content = <AppClipLoader loading={isFetching || isLoading}/>
  else if (isError) content =
    <Alert variant='danger' className='text-center'>
      <i className='bi bi-exclamation-triangle-fill'/>
    </Alert>
  else if (isSuccess && images) content = images?.ids.map(id =>
    <Item
      key={id}
      id={id}
      setState={setFile}
      onSelected={handleCheckImage}
      selectedTarget={selectedTarget}/>)

  return (
    <>
      <Modal show={show} onHide={onHide} size='lg'>
        <Modal.Header closeButton>
          <Modal.Title>Sélection d'une image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className='mb-3'>
            <Col md={8} className='mb-1'>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Button type='submit' variant='light' disabled={images.length < 1 || isFetching || isLoading}>
                    <i className='bi bi-search'/>
                  </Button>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={images.length < 1 || isFetching || isLoading}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                </InputGroup>
              </form>
            </Col>
            <Col md={4} className='text-md-end'>
              <Button
                type='button'
                variant='secondary'
                className='me-1'
                onClick={handleToggleNewImage}
                disabled={isFetching || isLoading}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
              <Button type='button' onClick={handleRefresh} disabled={isLoading || isFetching}>
                {(isFetching || isLoading)
                  ? <Spinner animation='border' size='sm'/>
                  : <i className='bi bi-arrow-clockwise'/>}
              </Button>
            </Col>
          </Row>
          <p>
            {totalImages > 0
              ? <>Il y a au total <code>{totalImages.toLocaleString()}</code> image(s) :</>
              : `🎈 Aucune image enregistrée pour le moment.`}
          </p>
          <Row>{content}</Row>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide} disabled={isLoading || isFetching}>
            <i className='bi bi-x'/> Fermer
          </Button>
          <Button type='button' onClick={onChooseFile} disabled={isLoading || isFetching || !file}>
            Valider
          </Button>
        </Modal.Footer>
      </Modal>

      <AddImage onHide={handleToggleNewImage} show={showNew} />
    </>
  )
}

AddImageModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
}
