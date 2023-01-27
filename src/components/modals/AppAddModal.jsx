import PropTypes from "prop-types";
import {Button, Modal, Spinner} from "react-bootstrap";
import {memo} from "react";

function AppAddModal({show = false, loader = false, onHide, onAdd, children, title}) {
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>{title ? title : 'Enregistrement'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children && children}</Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' disabled={loader} onClick={onHide}>
            <i className='bi bi-x'/> Fermer
          </Button>
          <Button type='button' disabled={loader} onClick={onAdd}>
            {loader ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AppAddModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  loader: PropTypes.bool,
  title: PropTypes.string.isRequired,
  onAdd: PropTypes.func.isRequired,
}

export default memo(AppAddModal)
