import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useSelector} from "react-redux";
import {MedicineSaleForm} from "./MedicineSaleForm";

const MedicinesInvoicing = () => {
  const { fCurrency } = useSelector(state => state.parameters)

  return (
    <>
      <AppHeadTitle title='Pharmacie | Facturation' />
      <AppBreadcrumb
        title='Facturation produit(s)'
        links={[{path: '/member/drugstore/medicines', label: 'Liste des produits'}]} />

      <MedicineSaleForm currency={fCurrency}/>
    </>
  )
}

export default MedicinesInvoicing
