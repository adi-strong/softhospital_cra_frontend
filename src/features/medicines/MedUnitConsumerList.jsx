import {useState, useCallback, useMemo} from "react";
import {useGetConsumptionUnitsQuery} from "./consumptionUnitApiSlice";
import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {ConsumptionUnitItem} from "./ConsumptionUnitItem";
import {AddConsumptionUnitsModal} from "./AddConsumptionUnitsModal";

const thead = [{label: 'Désignation'}, {label: <><i className='bi bi-calendar-event'/> Date</>}]

export function MedUnitConsumerList() {
  const {
    data: cUnits = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetConsumptionUnitsQuery('ConsumptionUnits')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && cUnits)
      return <tbody>{cUnits.map(cUnit =>
        <ConsumptionUnitItem key={cUnit.id} cUnit={cUnit}/>)}</tbody>
  }, [isSuccess, cUnits])

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

      <AddConsumptionUnitsModal show={show} onHide={toggleModal} />
    </>
  )
}
