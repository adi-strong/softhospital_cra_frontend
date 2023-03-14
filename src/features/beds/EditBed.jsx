import {useEffect, useState, useMemo} from "react";
import {useUpdateBedMutation} from "./bedApiSlice";
import {useGetBedroomsQuery, useLazyHandleLoadBedroomsQuery} from "./bedroomApiSlice";
import {Button, InputGroup, Modal, Spinner} from "react-bootstrap";
import toast from "react-hot-toast";
import {BedForm} from "./BedForm";

export const EditBed = ({show, onHide, data, currency}) => {
  const [bed, setBed] = useState({number: '', bedroom: null, cost: 0, price: 0})
  const [updateBed, {isLoading, isError, error}] = useUpdateBedMutation()
  const [handleLoadBedrooms] = useLazyHandleLoadBedroomsQuery()
  const {
    data: bedrooms = [],
    isSuccess,
    isFetching,
    isError: isBedroomsError} = useGetBedroomsQuery('Bedroom')

  useEffect(() => {
    if (data) {
      const category = data?.bedroom
        ? data.bedroom?.category
          ? data.bedroom.category?.name
          : ''
        : ''
      setBed(prevState => {
        return {
          id: data.id,
          number: data.number,
          cost: data?.cost ? data.cost : 0,
          price: data?.price ? data.price : 0,
          bedroom: data?.bedroom
            ? {label: `${data.bedroom.number} (${category})`, value: data.bedroom['@id']}
            : null,
        }
      })
    }
  }, [data])

  let options, apiErrors = {number: null, cost: null, price: null, bedroom: null}
  if (isBedroomsError) alert('Erreur lors du chargement des chambres !!')
  options = useMemo(() => isSuccess && bedrooms ? bedrooms.ids?.map(id => {
    const bedroom = bedrooms.entities[id]
    const category = bedroom?.category ? ` (${bedroom.category?.name})` : ''
    return {
      label: bedroom.number+category,
      value: bedroom['@id'],
    }
  }) : [], [isSuccess, bedrooms])

  const currencySymbol1 = <InputGroup.Text disabled className='fw-bold'>{currency && currency.value}</InputGroup.Text>
  const currencySymbol2 = <InputGroup.Text disabled className='fw-bold'>{currency && currency.currency}</InputGroup.Text>

  const onSelectBedroom = event => setBed({...bed, bedroom: event})

  const onReset = () => setBed({number: '', bedroom: null, cost: 0, price: 0, description: ''})

  const onLoadBedrooms = async keyword => {
    try {
      const lazyData = await handleLoadBedrooms(keyword).unwrap()
      if (lazyData && lazyData.length > 0) {
        return lazyData
      }
    }
    catch (e) { toast.error(e.message) }
  }

  async function onSubmit() {
    apiErrors = {number: null, cost: null, price: null, bedroom: null}
    try {
      const formData = await updateBed({...bed, bedroom: bed.bedroom ? bed.bedroom.value : null})
      if (!formData.error) {
        toast.success('Modification bien efféctuée.')
        onReset()
        onHide()
      }
    }
    catch (e) { toast.error(e.message) }
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton className='bg-primary text-light'>
          <Modal.Title><i className='bi bi-pencil'/> Modification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <BedForm
            currency={currency}
            currencySymbol1={currencySymbol1}
            currencySymbol2={currencySymbol2}
            bed={bed}
            setBed={setBed}
            onReset={onReset}
            apiErrors={apiErrors}
            options={options}
            onLoadBedrooms={onLoadBedrooms}
            isLoading={isLoading}
            isFetching={isFetching}
            data={data}
            onSelectBedroom={onSelectBedroom} />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={isLoading} type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button disabled={isLoading} type='button' onClick={onSubmit}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Modifier'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
