import {memo} from "react";
import {Button, Modal, Spinner} from "react-bootstrap";
import PropTypes from "prop-types";

const AppLgModal = ({show = false, loader = false, onHide, onClick, title, children, className}) => {
  return (
    <>
      <Modal show={show} onHide={onHide} backdrop='static' keyboard={false} size='lg'>
        <Modal.Header closeButton className={className}>
          <Modal.Title>{title && title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{children && children}</Modal.Body>
        <Modal.Footer>
          <Button type='button' variant='light' disabled={loader} onClick={onHide}>
            <i className='bi bi-x'/> Fermer
          </Button>
          {onClick &&
            <Button type='button' disabled={loader} onClick={onClick}>
              {loader ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Valider'}
            </Button>}
        </Modal.Footer>
      </Modal>
    </>
  )
}

AppLgModal.propTypes = {
  loader: PropTypes.bool,
  className: PropTypes.string,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onClick: PropTypes.func,
}

export default memo(AppLgModal)
