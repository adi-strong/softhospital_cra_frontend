export const SingleOrderSection1 = ({ order }) => {
  const orders = order?.orders ? order.orders : null

  return (
    <div className='w-75 m-auto'>
      {orders && orders?.map((element, idx) =>
        <div key={idx} className='text-capitalize mb-3 d-flex'>
          <h6 className='fw-bold'>{element?.item}</h6>
          <p className='mx-3'>{element?.value}</p>
        </div>)}
    </div>
  )
}
