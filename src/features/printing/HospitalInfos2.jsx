import {memo} from "react";
import {entrypoint} from "../../app/store";

const HospitalInfos2 = ({ hospital }) => {
  return (
    <>
      {hospital?.logo
        && <img
          src={entrypoint + hospital.logo?.contentUrl}
          className='img-fluid'
          alt='Logo'/>}
    </>
  )
}

export default memo(HospitalInfos2)
