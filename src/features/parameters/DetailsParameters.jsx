import {RowContent} from "../patients/PatientOverviewTab";

export function DetailsParameters({user, hospital, fCurrency, sCurrency, rate}) {
  return (
    <>
      <h5 className="card-title">Hôpital</h5>
      <RowContent
        label='Dénomination'
        body={hospital ? hospital.denomination : '❓'} />
      <RowContent
        label='Abbréviation'
        body={
          hospital
            ? hospital?.unitName
              ? hospital.unitName
              : '❓'
            : '❓'
        } />
      <RowContent
        label='n° Téléphone'
        body={
          hospital
            ? hospital?.tel
              ? hospital.tel
              : '❓'
            : '❓'
        } />
      <RowContent
        label='Email'
        className='text-lowercase text-primary'
        body={
          hospital
            ? hospital?.email
              ? hospital.email
              : '❓'
            : '❓'
        } />

      <h5 className="card-title mb-0">Devise</h5>
      <div>
        {fCurrency &&
          <ul>
            <li>{fCurrency.currency}</li>
            <li>{fCurrency.label}</li>
            {sCurrency &&
              <>
                <li>{sCurrency.currency}</li>
                <li>{sCurrency.label}</li>
              </>}
          </ul>}
      </div>

      <h5 className="card-title">
        Taux :
        <small className='mx-1' style={{ fontWeight: 800 }}>
          {rate && sCurrency &&
            <>
              {parseFloat(rate).toFixed(2).toLocaleString()} {sCurrency.currency}
            </>}
          {!rate && '❓'}
        </small>
      </h5>
    </>
  )
}
