import {useState} from "react";
import img1 from '../../assets/app/img/bedrooms/1.jpg';
import img2 from '../../assets/app/img/bedrooms/2.jpg';
import img3 from '../../assets/app/img/bedrooms/3.jpg';
import img4 from '../../assets/app/img/bedrooms/4.jpg';
import img5 from '../../assets/app/img/bedrooms/5.jpg';
import img6 from '../../assets/app/img/bedrooms/6.jpg';
import img7 from '../../assets/app/img/bedrooms/7.webp';
import {Button, ButtonGroup, Col, Form, InputGroup, Row, Spinner} from "react-bootstrap";
import {style} from "./BedsList";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddBedroom} from "./AddBedroom";
import {useDeleteBedroomMutation, useGetBedroomsQuery} from "./bedroomApiSlice";
import {AppDelModal, AppMainError} from "../../components";
import {ImageGridLoader} from "../../loaders/ImageGridLoader";
import toast from "react-hot-toast";
import {EditBedroom} from "./EditBedroom";

const elements = [img1, img2, img3, img4, img5, img6, img7]

const BedroomItem = ({id}) => {
  const randomImg = Math.floor(Math.random() * elements.length)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteBedroom, {isLoading}] = useDeleteBedroomMutation()
  const { bedroom } = useGetBedroomsQuery('Bedroom', {
    selectFromResult: ({ data }) => ({ bedroom: data.entities[id] })
  })

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  async function onDelete() {
    toggleDeleteModal()
    try {
      const formData = await deleteBedroom(bedroom)
      if (!formData.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <Col key={bedroom.id} md={6} lg={4}>
        <div className='bed shadow-sm' style={{ height: 352 }}>
          <img src={elements[randomImg]} className="img-fluid" alt="" style={style}/>
          <div className='bed-content'>
            <h4>{bedroom.number}</h4>
            <span>{bedroom?.category ? bedroom.category.name : 'Aucune catégorie attribuée'}</span>
            <div>
              {bedroom.description}

              <div className='mb-2'>
                <ButtonGroup size='sm'>
                  <Button
                    type='button'
                    disabled={isLoading}
                    onClick={toggleEditModal}
                    variant='light'
                    className='p-0 px-1 pe-1'
                    title='Modification'>
                    <i className='bi bi-pencil text-primary'/>
                  </Button>
                  <Button
                    type='button'
                    disabled={isLoading}
                    onClick={toggleDeleteModal}
                    variant='light'
                    className='p-0 px-1 pe-1'
                    title='Suppression'>
                    <i className='bi bi-trash text-danger'/>
                  </Button>
                </ButtonGroup>
              </div>
            </div>
          </div>
        </div>
      </Col>

      <EditBedroom data={bedroom} show={showEdit} onHide={toggleEditModal} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer la chambre <br/>
            <i className='bi bi-quote me-1'/>
            <span className="fw-bold text-uppercase">{bedroom.number}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const BedroomsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)
  const {data: bedrooms = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetBedroomsQuery('Bedroom')

  let content, errors
  if (isError) errors = <AppMainError/>
  else if (isSuccess) content = bedrooms && bedrooms.ids.map(id => <BedroomItem key={id} id={id} />)

  const handleToggleNewBedroom = () => setShowNew(!showNew)

  const onRefresh = async () => await refetch()

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <Row className='mb-4'>
        <Col md={8} className=' mb-1'>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <Button type='submit' variant='light' disabled={bedrooms.length < 1}>
                <i className='bi bi-search'/>
              </Button>
              <Form.Control
                placeholder='Votre recherche ici...'
                aria-label='Votre recherche ici...'
                autoComplete='off'
                disabled={bedrooms.length < 1}
                name='search'
                value={keywords.search}
                onChange={(e) => handleChange(e, keywords, setKeywords)} />
            </InputGroup>
          </form>
        </Col> {/* search bar */}
        <Col md={4} className='text-md-end mb-1'>
          <Button type='button' variant='secondary' className='me-1' onClick={handleToggleNewBedroom}>
            <i className='bi bi-plus'/> Enregistrer
          </Button>
          <Button disabled={isFetching} type='button' className='me-1' onClick={onRefresh}>
            {isFetching ? <Spinner animation='border' size='sm'/> : <i className='bi bi-arrow-clockwise'/>}
          </Button>
        </Col>
      </Row>
      <Row data-aos='fade-up' data-aos-duration={100} className='pt-2'>{content}</Row>

      {isLoading && <ImageGridLoader/>}

      {errors && errors}

      <AddBedroom onHide={handleToggleNewBedroom} show={showNew} />
    </>
  )
}
