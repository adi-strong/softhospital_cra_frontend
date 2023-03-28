import {useMemo} from "react";

const style = {
  background: '#e7f1fd',
  border: '1px solid #d6e8ff'
}

export const OrderPatientInfos = ({ data, order }) => {
  const patient = data ? data : null
  let user
  user = useMemo(() => order?.user
    ? order?.user.name
      ? order.user.name
      : order.user?.username
        ? order.user.username : ''
    : null, [order])

  return (
    <>
      {patient &&
        <>
          <div className='w-75 m-auto text-uppercase' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>Nom du patient</span>
            <div style={style} className='p-1 mb-2 fw-bold'>
              {patient?.name+' '}
              {patient?.lastName && patient.lastName+' '}
              {patient?.firstName && patient.firstName}
            </div>
            <span className='fw-bold'>Médecin</span>
            <div style={style} className='p-1 mb-2 fw-bold'>
              {user && user}
            </div>
          </div>
        </>}
    </>
  )
}
