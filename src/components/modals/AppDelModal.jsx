import {memo} from "react";
import {Button, Modal} from "react-bootstrap";
import PropTypes from "prop-types";

const AppDelModal = (
  {
    show = false,
    onHide,
    onDelete,
    text,
  }) => {
  return (
    <>
      <Modal show={show} onHide={onHide}>
        <Modal.Header className='bg-danger text-light' closeButton>
          <Modal.Title>
            <i className='bi bi-trash3'/> Suppresion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='text-center'>
          <small><code>Cette action est irréversible <i className='bi bi-exclamation-circle-fill'/></code></small>
          {text && text}
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='button'
            variant='light'
            onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button
            type='button'
            variant='danger'
            onClick={onDelete}>
            <i className='bi bi-trash3 me-1'/>
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AppDelModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  text: PropTypes.any,
}

export default memo(AppDelModal)
