import {useState} from "react";
import {totalImages, useDeleteImageMutation, useGetImagesQuery} from "./imageApiSlice";
import {ImageGridLoader} from "../ImageGridLoader";
import {Button, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {entrypoint} from "../../app/store";
import {limitStrTo} from "../../services/str_handlerService";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddImage} from "./AddImage";
import {AppDelModal} from "../../components";
import toast from "react-hot-toast";

export const style = {
  width: '100%',
  height: 320,
}

const ImageItem = ({id}) => {
  const { image } = useGetImagesQuery('Images', {
    selectFromResult: ({ data }) => ({ image: data?.entities[id] })
  })
  const [show, setShow] = useState(false)
  const [deleteImage, {isLoading}] = useDeleteImageMutation()

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

export const MainGalleryList = () => {
  const {data: images = [], refetch, isFetching, isLoading, isError, isSuccess} = useGetImagesQuery('Images', {count: 5})
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  let content
  if (isLoading) content = <ImageGridLoader/>
  else if (isError) content = <div className='text-danger'>🤕 Veuillez vérifier votre connexion.</div>
  else if (isSuccess) {
    content = images && images?.ids.map(id => <ImageItem key={id} id={id}/>)
  }

  const handleToggleNewImage = () => setShowNew(!showNew)

  function onRefresh() { refetch() }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <p>
        {totalImages > 0
          ? <>Il y a au total <code>{totalImages.toLocaleString()}</code> image(s) :</>
          : `🎈 Aucune image enregistrée pour le moment.`}
      </p>
      <Row className='mb-4'>
        <Col md={8} className=' mb-1'>
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
        </Col> {/* search bar */}
        <Col md={4} className='text-md-end mb-1'>
          <Button
            type='button'
            variant='secondary'
            className='me-1'
            onClick={handleToggleNewImage}
            disabled={isFetching || isLoading}>
            <i className='bi bi-plus'/> Enregistrer
          </Button>
          <Button type='button' className='me-1' onClick={onRefresh} disabled={isFetching || isLoading}>
            {isFetching
              ? <Spinner animation='border' size='sm'/>
              : <i className='bi bi-arrow-clockwise'/>}
          </Button>
        </Col>
      </Row>
      <Row data-aos='fade-up' data-aos-duration={100} className='pt-2'>
        {content}
      </Row> {/* list of data */}

      <AddImage onHide={handleToggleNewImage} show={showNew} />
    </>
  )
}
