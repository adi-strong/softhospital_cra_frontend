const style = {
  background: '#e7f1fd',
  border: '1px solid #d6e8ff',
  fontWeight: 900,
}

export const OrderPatientInfos = ({ data, order }) => {
  const patient = data ? data : null

  return (
    <>
      {patient &&
        <>
          <div className='w-75 m-auto text-uppercase' style={{ fontSize: '0.7rem' }}>
            <span className='fw-bold'>Nom du patient</span>
            <div style={style} className='p-1 mb-2 fw-bold'>
              {data &&
                <>
                  {data?.name+' '}
                  {data?.lastName && data.lastName+' '}
                  {data?.firstName && data.firstName}
                </>}
            </div>
            <span className='fw-bold'>Médecin</span>
            <div style={style} className='p-1 mb-2 fw-bold'>
              {order && order?.user && order.user?.name
                ? order.user.name
                : order.user.username}
            </div>
          </div>
        </>}
    </>
  )
}
