import {cardTitleStyle} from "../../layouts/AuthLayout";

export const Order = ({id, setId}) => {
  const handleReset = () => setId(null)

  return (
    <>
      <h5 className="card-title" style={cardTitleStyle}>Ordonnance n°{id && id}</h5>
      <button type="button" className='btn btn-secondary me-1 mb-1' onClick={handleReset} disabled={!id}>
        <i className='bi bi-x'/> Effacer
      </button>
      <button type="button" className='mb-1 btn btn-info' disabled={!id}>
        <i className='bi bi-printer'/> Impression
      </button>
    </>
  )
}
