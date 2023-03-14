import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useCallback, useMemo, useState} from "react";
import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {useGetMedicineCategoriesQuery} from "./medicineCategoriesApiSlice";
import {MedicineCategoriesItem} from "./MedicineCategoriesItem";
import {AddMedicineCategoriesModal} from "./AddMedicineCategoriesModal";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [{label: 'Désignation'}, {label: <><i className='bi bi-calendar-event'/> Date</>}]

export const MedicineCategoriesList = () => {
  const {
    data: categories = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetMedicineCategoriesQuery('MedicineCategories')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && categories)
      return <tbody>{categories.map(category =>
        <MedicineCategoriesItem key={category.id} category={category}/>)}</tbody>
  }, [isSuccess, categories])

  const handleSearch = useCallback(({target}) => {
    setSearch(target.value)
  }, []) // handle onkeyup search

  const toggleModal = () => setShow(!show)

  const handleSubmitSearch = async (e) => {
    e.preventDefault()
  } // handle submit search

  const onRefresh = async () => await refetch()

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableStripped
            title='Liste de catégories des produits'
            thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead}/>}
            tbody={content}
            overview={
              <>
                <Col className='mb-2'>
                  <Form onSubmit={handleSubmitSearch}>
                    <InputGroup>
                      <Button type='submit' variant='light'>
                        <i className='bi bi-search'/>
                      </Button>
                      <Form.Control
                        name='search'
                        value={search}
                        onChange={handleSearch} />
                    </InputGroup>
                  </Form>
                </Col>
                <Col md={5} className='mb-2'>
                  <Button type='button' className='w-100' onClick={toggleModal}>
                    <i className='bi bi-plus'/> Ajouter une catégorie
                  </Button>
                </Col>
              </>
            } />
          {isLoading && <BarLoaderSpinner loading={isLoading}/>}
          {errors && errors}
        </Card.Body>
      </Card>

      <AddMedicineCategoriesModal show={show} onHide={toggleModal} />
    </>
  )
}
