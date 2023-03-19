import {memo} from "react";
import {cardTitleStyle} from "../../layouts/AuthLayout";

const HospitalInfos = ({ hospital }) => {
  return (
    <>
      {hospital && (
        <>
          <h4 className='card-title text-uppercase fw-bold' style={cardTitleStyle}>
            {hospital?.denomination}
          </h4>
          <p>{hospital?.address ? hospital.address : 'Adresse :'}</p>
          <p>{hospital?.tel ? hospital.tel : 'N° d Téléphone :'}</p>
          <p>{hospital?.email ? hospital.email : 'Adresse E-mail :'}</p>
        </>
      )}
    </>
  )
}

export default memo(HospitalInfos)
