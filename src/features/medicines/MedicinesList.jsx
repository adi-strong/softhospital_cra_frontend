import {useMemo, useCallback, useState} from "react";
import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useGetMedicinesQuery} from "./medicineApiSlice";
import {MedicineItem} from "./MedicineItem";
import {AddMedicineModal} from "./AddMedicineModal";
import {useSelector} from "react-redux";

const thead = [
  {label: '#'},
  {label: 'Désignation'},
  {label: 'Prix'},
  {label: 'Qté'},
  {label: 'Unité C.'},
  {label: <><i className='bi bi-calendar-event-fill'/> Péremption</>},
  {label: <><i className='bi bi-calendar-event'/> Enregistrement</>},
]

export const MedicinesList = () => {
  const {
    data: medicines = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetMedicinesQuery('Drugstore')
  const { fCurrency } = useSelector(state => state.parameters)
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && medicines)
      return <tbody>{medicines.map(medicine =>
        <MedicineItem key={medicine.id} medicine={medicine} currency={fCurrency}/>)}</tbody>
  }, [isSuccess, medicines, fCurrency])

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
            loader={isLoading}
            title='Liste de produits'
            tbody={content}
            thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead}/>}
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
                <Col md={3} className='mb-2'>
                  <Button type='button' className='w-100' onClick={toggleModal}>
                    <i className='bi bi-plus'/> Ajouter un produit
                  </Button>
                </Col>
              </>
            } />
          {errors && errors}
        </Card.Body>
      </Card>

      <AddMedicineModal onHide={toggleModal} show={show} currency={fCurrency} />
    </>
  )
}
