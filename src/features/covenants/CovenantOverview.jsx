import {Card} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import img from "../../assets/app/img/default_logo.png";
import {entrypoint} from "../../app/store";
import {limitStrTo} from "../../services";

export function CovenantOverview(
  {
    isLoading,
    isSuccess,
    covenant,
    errors,
  }) {
  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          {isLoading &&
            <>
              <h2 className='text-center'>Chargement en cours...</h2>
              <BarLoaderSpinner loading={isLoading}/>
            </>}
          {isSuccess && covenant &&
            <>
              <Card.Img variant='top' src={covenant?.logo ? entrypoint+covenant.logo.contentUrl : img} />
              <h2>{limitStrTo(16, covenant.denomination)}</h2> <hr className='mt-0'/>
              <address>
                <i className='bi bi-map me-2'/> {covenant?.address ? covenant.address : '❓'}
              </address>
              <p className='text-capitalize'><i className='bi bi-person me-2'/> {covenant?.focal ? covenant.focal : '❓'}</p>
              <p className='fw-bold'><i className='bi bi-telephone me-2'/> {covenant?.tel ? covenant.tel : '❓'}</p>
              <p className='fw-bold'><i className='bi bi-envelope me-2'/> {covenant?.email ? covenant.email : '❓'}</p>
            </>}
          {errors && errors}
        </Card.Body>
      </Card>
    </>
  )
}
