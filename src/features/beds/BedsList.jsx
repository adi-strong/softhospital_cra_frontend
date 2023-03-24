import {useEffect, useState} from "react";
import {Button, ButtonGroup, Col, Form, Row, Spinner} from "react-bootstrap";
import img1 from '../../assets/app/img/beds/1.jpg';
import img2 from '../../assets/app/img/beds/2.jpg';
import img3 from '../../assets/app/img/beds/3.jpg';
import img4 from '../../assets/app/img/beds/4.jpg';
import img5 from '../../assets/app/img/beds/5.jpg';
import img6 from '../../assets/app/img/beds/6.jpg';
import img7 from '../../assets/app/img/beds/7.jpg';
import {AddBed} from "./AddBed";
import {useDeleteBedMutation, useGetBedsQuery} from "./bedApiSlice";
import {ImageGridLoader} from "../../loaders/ImageGridLoader";
import {AppDelModal, AppMainError} from "../../components";
import {useSelector} from "react-redux";
import {EditBed} from "./EditBed";
import toast from "react-hot-toast";

const elements = [img1, img2, img3, img4, img5, img6, img7]

export const style = {
  width: '100%',
  height: 200.96,
}

const BedItem = ({ bed, currency }) => {
  const randomImg = Math.floor(Math.random() * elements.length)
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteBed, {isLoading}] = useDeleteBedMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  const onDelete = async () => {
    toggleDeleteModal()
    try {
      const formData = await deleteBed(bed)
      if (!formData.error) {
        toast.success('Suppression bien efféctuée.', {icon: '😶'})
      }
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <Col md={6} lg={4}>
        <div className='bed shadow-sm'>
          <img src={elements[randomImg]} className="img-fluid" alt="" style={style}/>
          <div className='bed-content'>
            <h4>{bed.number}</h4>
            <span>{bed?.bedroom ? bed.bedroom.number : '-'}</span>
            <div>
              {bed.description}

              <div>
                <ButtonGroup size='sm'>
                  <Button
                    disabled={isLoading}
                    onClick={toggleEditModal}
                    type='button'
                    variant='light'
                    className='p-0 px-1 pe-1'
                    title='Modification'>
                    <i className='bi bi-pencil text-primary'/>
                  </Button>
                  <Button
                    disabled={isLoading}
                    onClick={toggleDeleteModal}
                    type='button'
                    variant='light'
                    className='p-0 px-1 pe-1'
                    title='Suppression'>
                    <i className='bi bi-trash text-danger'/>
                  </Button>
                </ButtonGroup>
              </div>

              <hr/>

              <p className='mb-0'>
                <b>
                  <i className='bi bi-cash-coin'/> {bed?.price && bed.price}
                </b>
              </p>
              <small>{bed?.createdAt && bed.createdAt}</small>
            </div>
            <p className='mt-3'>
              <mark className={bed?.itHasTaken ? 'danger' : 'success'}>
                <i className={`bi bi-${bed?.itHasTaken ? 'x' : 'check'}-circle text-white me-1`}/>
                {bed?.itHasTaken ? 'Occupé' : 'Disponible'}
              </mark>
            </p>
          </div>
        </div>
      </Col>

      <EditBed data={bed} onHide={toggleEditModal} show={showEdit} currency={currency} />
      <AppDelModal
        show={showDelete}
        onHide={toggleDeleteModal}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer le lit <br/>
            <i className='bi bi-quote me-1'/>
            <span className='fw-bold text-uppercase'>{bed.number}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}

export const BedsList = () => {
  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [showNew, setShowNew] = useState(false)
  const { fCurrency} = useSelector(state => state.parameters)
  const {data: beds = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetBedsQuery('Bed')

  useEffect(() => {
    if (isSuccess && beds) {
      const items = beds.ids?.map(id => { return beds?.entities[id] })
      setContents(items?.filter(n => n?.number.toLowerCase().includes(search.toLowerCase())))
    }
  }, [isSuccess, beds, search])

  const handleToggleNewBed = () => setShowNew(!showNew)

  const onRefresh = async () => {
    setSearch('')
    await refetch()
  }

  return (
    <>
      <Row className='mb-4'>
        <Col md={8} className='mb-1'>
          <form onSubmit={(e) => { e.preventDefault() }}>
            <Form.Control
              placeholder='Votre recherche ici...'
              aria-label='Votre recherche ici...'
              autoComplete='off'
              disabled={beds.length < 1 || isLoading || isFetching}
              name='search'
              value={search}
              onChange={({ target }) => setSearch(target.value)} />
          </form>
        </Col> {/* search bar */}
        <Col md={4} className='text-md-end mb-1'>
          <Button type='button' variant='secondary' className='me-1' onClick={handleToggleNewBed}>
            <i className='bi bi-plus'/> Enregistrer
          </Button>
          <Button type='button' className='me-1' disabled={isFetching} onClick={onRefresh}>
            {isFetching ? <Spinner animation='border' size='sm'/> : <i className='bi bi-arrow-clockwise'/>}
          </Button>
        </Col>
      </Row>
      <Row data-aos='fade-up' data-aos-duration={100} className='pt-2'>
        {!isLoading && contents.map(item => <BedItem key={item?.id} bed={item} currency={fCurrency}/>)}
      </Row>

      {isLoading && <ImageGridLoader/>}

      {isError && <AppMainError/>}

      <AddBed onHide={handleToggleNewBed} show={showNew} currency={fCurrency} />
    </>
  )
}
