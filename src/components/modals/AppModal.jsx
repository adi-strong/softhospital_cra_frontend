import {memo} from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";

const AppModal = ({show, onHide, className, title, onClick, disabled, children, size = 'lg'}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} size={size}>
        <Modal.Header closeButton className={className}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children && children}</Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' onClick={onHide} disabled={disabled}>
            <i className='bi bi-x'/> Fermer
          </Button>
          {onClick &&
            <Button type='button' onClick={onClick} disabled={disabled}>
              {disabled ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
            </Button>}
        </Modal.Footer>
      </Modal>
    </>
  )
}

AppModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  className: PropTypes.string,
  title: PropTypes.any,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  size: PropTypes.any,
}

export default memo(AppModal)
