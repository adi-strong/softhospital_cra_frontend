import {Link} from "react-router-dom";

export const SingleLabSection2 = ({ lab }) => {
  return (
    <>
      <ul id='prescriptions-lab-exams' className='mb-4'>
        {lab?.labResults && lab.labResults?.map((item, idx) =>
          <li key={idx}>
            <i className='bi bi-virus2 me-1'/>
            {item?.exam.wording}
          </li>)}
      </ul>

      {lab?.consultation &&
        <Link
          to={`/member/consultations/${lab.consultation?.id}/${lab.patient.slug}`}
          className='btn btn-success'><i className='bi bi-journal-medical'/> Fiche de consultation</Link>}
    </>
  )
}
