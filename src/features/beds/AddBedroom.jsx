import {useState} from "react";
import {Button, Modal} from "react-bootstrap";
import {AppFloatingInputField} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import PropTypes from "prop-types";

export const AddBedroom = ({onHide, show = false}) => {
  const [bedroom, setBedroom] = useState({wording: '', description: ''})

  function onSubmit(e) {
    e.preventDefault()
    alert('submitted')
  }

  const onReset = () => setBedroom({wording: '', description: ''})

  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une chambre</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AppFloatingInputField
            required
            autofocus
            name='wording'
            value={bedroom.wording}
            onChange={(e) => handleChange(e, bedroom, setBedroom)}
            placeholder='Chambre...'
            label='Chambre...' />
          <AppFloatingInputField
            required
            text="Ce champs ne peut contenir que 53 caractère(s) maximum."
            maxLength={53}
            name='description'
            value={bedroom.description}
            onChange={(e) => handleChange(e, bedroom, setBedroom)}
            placeholder='Petite description de la chambre...'
            label='Petite description de la chambre...' />
          <Button type='reset' variant='light' className='w-100' onClick={onReset}>
            <i className='bi bi-trash3'/>
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button type='button' onClick={onSubmit}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AddBedroom.propTypes = {show: PropTypes.bool, onHide: PropTypes.func.isRequired}
