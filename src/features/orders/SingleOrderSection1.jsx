export const SingleOrderSection1 = ({ order }) => {
  const orders = order?.orders ? order.orders : null

  return (
    <div className='w-75 m-auto'>
      {orders && orders?.map((element, idx) =>
        <div key={idx} className='text-capitalize mb-3 d-flex'>
          <b className='me-4'>{element?.medicine && element.medicine?.label
            ? element.medicine.label
            : element.medicine} :</b>
          <span>{element?.dosage}</span>
        </div>)}
    </div>
  )
}
