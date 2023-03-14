import {useGetAppointmentsQuery, useToggleAppointmentMutation} from "./appointmentApiSlice";
import {AppDataTableBorderless, AppMainError, AppTHead} from "../../components";
import {useCallback, useMemo, useState} from "react";
import {AppointmentItem} from "./AppointmentItem";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AddAppointment} from "./AddAppointment";
import {Button, Col, Form, InputGroup} from "react-bootstrap";

const thead = [
  {label: '#'},
  {label: 'Patient(e)'},
  {label: 'Date & Heure'},
]

export function AppointmentsList() {
  const {data: appointments = [], isLoading, isFetching, isSuccess, isError, refetch} =
    useGetAppointmentsQuery('Appointments')
  const [toggleAppointment] = useToggleAppointmentMutation()
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    return (
      <tbody>
      {isSuccess && appointments && appointments.map(appointment =>
        <AppointmentItem
          key={appointment?.id}
          onToggleAppointment={toggleAppointment}
          appointment={appointment} />
      )}
      </tbody>
    )
  }, [isSuccess, appointments, toggleAppointment])

  const onRefresh = async () => await refetch()

  const toggleModal = () => setShow(!show)

  const handleSearch = useCallback(({ target }) => {
    const value = target.value
    setSearch(value)
  }, [])

  async function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <AppDataTableBorderless
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead}/>}
        tbody={content}
        title='Liste des rendez-vous'
        overview={
          <>
            <Col md={6}>
              <Form onSubmit={onSubmit}>
                <InputGroup>
                  <Button type='submit' variant='light' style={{ border: '1px solid lightgray' }}>
                    <i className='bi bi-search'/>
                  </Button>
                  <Form.Control
                    name='search'
                    placeholder='Rechercher'
                    value={search}
                    onChange={handleSearch} />
                </InputGroup>
              </Form>
            </Col>
            <Col>
              <Button type='button' className='w-100' onClick={toggleModal}>
                <i className='bi bi-plus'/> Fixer un rendez-vous
              </Button>
            </Col>
          </>
      } />
      {isLoading && <BarLoaderSpinner loading={isLoading}/>}
      {errors && errors}

      <AddAppointment
        onHide={toggleModal}
        show={show} />
    </>
  )
}
