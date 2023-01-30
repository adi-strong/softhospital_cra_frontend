import {AppDataTableStripped, AppTHead} from "../../components";

export function UnpaidInvoicesList() {
  return (
    <>
      <>
        <AppDataTableStripped
          overview={<p>Il y a au totel <code>0</code> facture(s) non reglée(s) :</p>}
          loader={false}
          thead={<AppTHead isImg loader={false} isFetching={false} onRefresh={() => {}} items={[
            {label: '#'},
            {label: 'Patient(e)'},
            {label: <><i className='bi bi-piggy-bank'/> Total</>},
            {label: <><i className='bi bi-cash-coin'/> Payé</>},
            {label: <><i className='bi bi-currency-exchange'/> Reste</>},
            {label: 'Date'},
          ]}/>} />
      </>
    </>
  )
}
