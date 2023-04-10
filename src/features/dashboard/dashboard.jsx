import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {DashSection1} from "./sections/section1/DashSection1";
import {Col, Row} from "react-bootstrap";
import {DashSection3} from "./sections/section3/DashSection3";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useNavigate} from "react-router-dom";
import {allowShowDashPage} from "../../app/config";
import toast from "react-hot-toast";
import {useEffect} from "react";

export const dashPs3Style = {
  fontSize: 28,
  color: '#012970',
  fontWeight: 700,
  margin: 0,
  padding: 0,
}

const dropdownMenuItems = [
  {label: 'Ce mois', name: 'this-month', action: '#'},
  {label: 'Mois passé', name: 'last-month', action: '#'},
  {label: 'Cette année', name: 'this-year', action: '#'},
  {label: 'Actualiser', name: 'refresh', action: '#'}]

const currentDate = new Date()

function Dashboard() {
  const user = useSelector(selectCurrentUser), navigate = useNavigate()

  useEffect(() => {
    if (user && !allowShowDashPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Tableau de bord' />
      <AppBreadcrumb title='Tableau de bord'/>

      <div className='section dashboard'>
        <Row>
          <Col md={8}>
            {/* section 1: fiches traitées, entrées $, nbre patients */}
            <DashSection1 menus={dropdownMenuItems} currentDate={currentDate}/>
            {/* Fin section 1: fiches traitées, entrées $, nbre patients */}
          </Col>

          <Col md={4}>
            <DashSection3/>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Dashboard
