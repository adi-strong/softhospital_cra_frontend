import {memo} from "react";
import {Alert} from "react-bootstrap";

const AppMainError = () => {
  return (
    <>
      <Alert variant='danger'>
        <p>
          Une erreur est survenue. <br/>
          Veuillez soit recharger la page soit vous reconnecter <i className='bi bi-exclamation-triangle-fill'/>
        </p>
      </Alert>
    </>
  )
}

export default memo(AppMainError)
