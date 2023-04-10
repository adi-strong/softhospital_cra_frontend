import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {Card} from "react-bootstrap";
import {OrdersList} from "./OrdersList";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowOrdersPage} from "../../app/config";
import {useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

function Orders() {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowOrdersPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Ordonances' />
      <AppBreadcrumb title='Ordonnances' />
      <section className="section">
        <Card className='border-0'>
          <Card.Body>
            <OrdersList/>
          </Card.Body>
        </Card>
      </section>
    </>
  )
}

export default Orders
