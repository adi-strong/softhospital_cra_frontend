import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {useSelector} from "react-redux";
import {MedicineSaleForm} from "./MedicineSaleForm";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowDrugsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

const MedicinesInvoicing = () => {
  const { fCurrency } = useSelector(state => state.parameters)

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowDrugsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

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
