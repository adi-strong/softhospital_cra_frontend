import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {MedicinesList} from "./MedicinesList";

const DrugStore = () => {
  return (
    <>
      <AppHeadTitle title='Pharmacie | Produits' />
      <AppBreadcrumb title='Produits pharmaceutiques' />

      <MedicinesList/>
    </>
  )
}

export default DrugStore
