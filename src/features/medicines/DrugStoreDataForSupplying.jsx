import {DrugstoreForm2} from "./DrugstoreForm2";

export function DrugStoreDataForSupplying({ drugstore, setDrugstore, currency, values, setValues, isLoading, isSuccess }) {
  return (
    <>
      <DrugstoreForm2
        isSuccess={isSuccess}
        isLoading={isLoading}
        values={values}
        setValues={setValues}
        drugstore={drugstore}
        setDrugstore={setDrugstore}
        currency={currency}/>
    </>
  )
}
