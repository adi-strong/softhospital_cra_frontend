export const SingleConsultSection3 = ({ hospital }) => {
  return (
    <div className='w-100 m-auto mt-4' style={{ borderTop: '2px solid #000', position: 'relative', bottom: 0 }}>
      {hospital &&
        <div className='mx-3 d-flex justify-content-between'>
          <div className='mb-2 mt-2'>
            <h6 className='text-decoration-underline fw-bold'>Adresse :</h6>
            <address>
              {hospital?.address && hospital.address}
            </address>
          </div>

          <div className='mb-2 mt-2'>
            <h6 className='text-decoration-underline fw-bold'>Contacts :</h6>
            <div>Mobile : {hospital?.tel && hospital.tel}</div>
            <div>
              Mail : <span className='text-primary text-decoration-underline text-lowercase'>
              {hospital?.email && hospital.email}</span>
            </div>
          </div>
        </div>}
    </div>
  )
}
