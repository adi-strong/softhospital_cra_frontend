import {useState} from "react";
import {Button, InputGroup, Modal, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";
import {useAddNewBedMutation} from "./bedApiSlice";
import {useGetBedroomsQuery, useLazyHandleLoadBedroomsQuery} from "./bedroomApiSlice";
import toast from "react-hot-toast";
import {BedForm} from "./BedForm";

export const AddBed = ({onHide, show = false, currency}) => {
  const [bed, setBed] = useState({number: '', bedroom: null, cost: 0, price: 0})
  const [addNewBed, {isLoading, isError, error}] = useAddNewBedMutation()
  const [handleLoadBedrooms] = useLazyHandleLoadBedroomsQuery()
  const {
    data: bedrooms = [],
    isSuccess,
    isFetching,
    isError: isBedroomsError} = useGetBedroomsQuery('Bedroom')

  let options, apiErrors = {number: null, cost: null, price: null, bedroom: null}
  if (isBedroomsError) alert('Erreur lors du chargement des chambres !!')
  else if (isSuccess) options = bedrooms && bedrooms.ids.map(id => {
    return {
      label: bedrooms.entities[id].number,
      value: bedrooms.entities[id]['@id'],
    }
  })

  const currencySymbol1 = <InputGroup.Text disabled className='fw-bold'>{currency && currency.value}</InputGroup.Text>
  const currencySymbol2 = <InputGroup.Text disabled className='fw-bold'>{currency && currency.currency}</InputGroup.Text>

  const onSelectBedroom = event => setBed({...bed, bedroom: event})

  const onReset = () => setBed({number: '', bedroom: null, cost: 0, price: 0})

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
      const formData = await addNewBed({...bed, bedroom: bed.bedroom ? bed.bedroom.value : null})
      if (!formData.error) {
        toast.success('Enregistrement bien efféctuée.')
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
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un lit</Modal.Title>
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
            onSelectBedroom={onSelectBedroom} />
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={isLoading} type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button disabled={isLoading} type='button' onClick={onSubmit}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AddBed.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
