import PatientInfos from "../patients/PatientInfos";

export const SingleLabSection3 = ({ lab }) => {
  return (
    <>
      {lab?.patient && <PatientInfos patient={lab.patient}/>}
    </>
  )
}
