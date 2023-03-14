import {memo} from "react";
import PropTypes from "prop-types";
import {Button, Modal, Spinner} from "react-bootstrap";

const AppEditModal = ({show = false, loader = false, onHide, onEdit, children, title, size = ''}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false} size={size}>
        <Modal.Header className='bg-primary text-light'>
          <Modal.Title>
            <i className='bi bi-pencil-square me-1'/>
            {title ? title : 'Modification'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{children && children}</Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' disabled={loader} onClick={onHide}>
            <i className='bi bi-x'/> Annuler
          </Button>
          <Button type='button' disabled={loader} onClick={onEdit}>
            {loader ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

AppEditModal.propTypes = {
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  loader: PropTypes.bool,
  title: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
}

export default memo(AppEditModal)
