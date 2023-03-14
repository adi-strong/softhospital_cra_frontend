import {useMemo, useCallback, useState} from "react";
import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {useGetProvidersQuery} from "./providerApiSlice";
import {ProviderItem} from "./ProviderItem";
import {Button, Col, Form, InputGroup} from "react-bootstrap";
import {AddProviderModal} from "./AddProviderModal";

const thead = [
  {label: '#'},
  {label: 'Désignation'},
  {label: 'P. Focal'},
  {label: 'n° Tél.'},
  {label: 'Email'},
  {label: <><i className='bi bi-person'/></>},
  {label: <><i className='bi bi-calendar-event'/> Date</>},
]

export const ProvidersList = () => {
  const {
    data: providers = [],
    isLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetProvidersQuery('Providers')
  const [search, setSearch] = useState('')
  const [show, setShow] = useState(false)

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && providers)
      return <tbody>{providers.map(provider =>
        <ProviderItem key={provider.id} provider={provider} />)}</tbody>
  }, [isSuccess, providers])

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
        loader={isLoading}
        title='Liste des fournisseurs de produits'
        tbody={content}
        thead={<AppTHead loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead}/>}
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
                <i className='bi bi-plus'/> Ajouter un fournisseur
              </Button>
            </Col>
          </>
        } />
      {errors && errors}

      <AddProviderModal show={show} onHide={toggleModal} />
    </>
  )
}
