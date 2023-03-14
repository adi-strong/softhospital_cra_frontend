import {RowContent} from "../patients/PatientOverviewTab";
import img from '../../assets/app/img/beds/3.jpg';

export const BedDetails = ({ bed }) => {
  const data = bed ? bed.data : null
  const bedroom = data?.bedroom ? data.bedroom?.number : null
  const category = data?.bedroom
    ? data.bedroom?.category
      ? data.bedroom.category?.name?.toUpperCase()
      : null
    : null

  return (
    <>
      <RowContent
        className='mt-3'
        label={<img src={img} className='img-fluid mt-3 mb-2' alt='' />}
        body={bed &&
          <>
            <i className='bi bi-sort-numeric-down-alt'/> <span className='fw-bold'>{bed?.label}</span> <br/>
            <span className='text-primary'>Chambre : {bedroom ? bedroom : '-'}</span> <br/>
            <span className='text-secondary'>
              <i className='bi bi-tag'/> Catégorie : {category ? category : '-'}
            </span>
          </>} />
    </>
  )
}
