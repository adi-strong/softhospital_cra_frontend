import {useCallback, useMemo, useState} from "react";
import {useGetMedicineSubCategoriesQuery} from "./medicineSubCategoriesApiSlice";
import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {MedicineSubCategoriesItem} from "./MedicineSubCategoriesItem";
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import {AddMedicineSubCategoriesModal} from "./AddMedicineSubCategoriesModal";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";

const thead = [
  {label: 'Désignation'},
  {label: 'Catégorie'},
  {label: <><i className='bi bi-calendar-event'/> Date</>}]

export function MedSubCategoriesList() {
  const {data: subCategories = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetMedicineSubCategoriesQuery('MedicineSubCategories')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && subCategories)
      return <tbody>{subCategories.map((subCategory, key) =>
        <MedicineSubCategoriesItem key={key} subCategory={subCategory}/>)}</tbody>
  }, [isSuccess, subCategories])

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
      <AppDataTableStripped
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
            <Col md={4} className='mb-2'>
              <Button type='button' className='w-100' onClick={toggleModal}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
            </Col>
          </>
        } />
      {isLoading && <BarLoaderSpinner loading={isLoading}/>}
      {errors && errors}

      <AddMedicineSubCategoriesModal onHide={toggleModal} show={show} />
    </>
  )
}
