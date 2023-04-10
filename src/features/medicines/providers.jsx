import {Card} from "react-bootstrap";
import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {ProvidersList} from "./ProvidersList";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowDrugsPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

function Providers() {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowDrugsPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Pharmacie | Fournisseurs' />
      <AppBreadcrumb
        title='Fournisseurs des produits'
        links={[{path: '/member/drugstore/medicines', label: 'Liste des produits'}]} />

      <Card className='border-0'>
        <Card.Body>
          <ProvidersList/>
        </Card.Body>
      </Card>
    </>
  )
}

export default Providers
