import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {MedicinesList} from "./MedicinesList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowDrugsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

const DrugStore = () => {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowDrugsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Pharmacie | Produits' />
      <AppBreadcrumb title='Produits pharmaceutiques' />

      <MedicinesList/>
    </>
  )
}

export default DrugStore
