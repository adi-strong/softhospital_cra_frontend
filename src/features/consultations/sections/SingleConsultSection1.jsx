import {entrypoint} from "../../../app/store";

export const SingleConsultSection1 = ({ consult, hospital }) => {
  return (
    <>
      {hospital && hospital?.logo &&
        <img
          src={entrypoint+hospital.logo?.contentUrl}
          style={{ position: 'absolute', top: 35, left: 30 }}
          width={150}
          height={80}
          alt='Logo' />}
      <div className='w-50 m-auto text-center'>
        <h6 className='fw-bold'>RÉPUBLIQUE DÉMOCRATIQUE DU CONGO</h6>
        <h6 className='fw-bold'>MINISTÈRE DE LA SANTÉ</h6>
        {hospital &&
          <>
            <h3 className='text-uppercase' style={{ fontWeight: 900 }}>{hospital?.denomination}</h3>
            <b>{hospital?.address && hospital.address}</b>
          </>}
      </div>

      <div style={{ borderBottom: '3px solid #000' }} className='mb-4' />

      <div className='w-50 m-auto text-center'>
        <h6 className='fw-bold text-decoration-underline'>
          FICHE DE CONSULTATION n° <span style={{ borderBottom: '2px dotted #000' }}>{consult?.id}</span>
        </h6>
      </div>
    </>
  )
}
