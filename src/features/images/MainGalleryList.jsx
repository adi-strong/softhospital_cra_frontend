import {useEffect, useState} from "react";
import {
  imagesPages,
  totalImages,
  useDeleteImageMutation,
  useGetImagesQuery,
  useLazyGetImagesByPaginationQuery
} from "./imageApiSlice";
import {Button, Col, Row, Spinner} from "react-bootstrap";
import {entrypoint} from "../../app/store";
import {limitStrTo} from "../../services";
import {AddImage} from "./AddImage";
import {AppDelModal, AppMainError, AppPaginationComponent} from "../../components";
import toast from "react-hot-toast";
import {ImageGridLoader} from "../../loaders/ImageGridLoader";

export const style = {
  width: '100%',
  height: 320,
}

const ImageItem = ({ image }) => {
  const [show, setShow] = useState(false)
  const [deleteImage, {isLoading}] = useDeleteImageMutation()

  const toggleShow = () => setShow(!show)

  async function onDelete(id) {
    toggleShow()
    try {
      const data = await deleteImage(id)
      if (!data.error) {
        toast.success('Suppression bien efféctuée.', {
          icon: '👌',
          style: {
            background: '#142db7',
            color: '#fff',
          }
        })
      }
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
            <div className='pt-0 &mt-2'>
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
  const [showNew, setShowNew] = useState(false)
  const [contents, setContents] = useState([])
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isPaginated: false,})

  const [paginatedItems, setPaginatedItems] = useState([])

  const handleToggleNewImage = () => setShowNew(!showNew)

  const [getImagesByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetImagesByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getImagesByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  const onRefresh = async () => {
    setCheckItems({isPaginated: false})
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (!checkItems.isPaginated && isSuccess && images) {
      const items = images.ids?.map(id => images?.entities[id])
      setContents(items)
    }
    else if (checkItems.isPaginated && isSuccess && images)
      setContents(paginatedItems)
  }, [ checkItems, isSuccess, images, paginatedItems ])

  return (
    <>
      <p>
        {totalImages > 0
          ? <>Il y a au total <code>{totalImages.toLocaleString()}</code> image(s) :</>
          : `🎈 Aucune image enregistrée pour le moment.`}
      </p>
      <Row className='mb-4'>
        <div className='text-center mb-1'>
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
        </div>
      </Row>
      <Row data-aos='fade-up' data-aos-duration={100} className='pt-2'>
        {!(isError || isFetching2) && isSuccess && contents.length > 0 &&
          contents.map(i => <ImageItem key={i?.id} image={i}/>)}
        {(isError || isError2) && <AppMainError/>}
      </Row> {/* list of data */}


      {isLoading || isFetching2
        ? <div className='text-center'><ImageGridLoader/></div>
        : (
          <>
            {imagesPages > 1 && isSuccess && images &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={imagesPages} />}
          </>)}

      <AddImage onHide={handleToggleNewImage} show={showNew} />
    </>
  )
}
