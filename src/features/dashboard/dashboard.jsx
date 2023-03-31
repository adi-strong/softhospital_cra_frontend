import {AppBreadcrumb, AppHeadTitle} from "../../components";
import {DashSection1} from "./sections/section1/DashSection1";
import {Col, Row} from "react-bootstrap";

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
  return (
    <>
      <AppHeadTitle title='Tableau de bord' />
      <AppBreadcrumb title='Tableau de bord'/>

      <div className='section dashboard'>
        <Row>
          <Col lg={8}>
            {/* section 1: fiches traitées, entrées $, nbre patients */}
            <DashSection1 menus={dropdownMenuItems} currentDate={currentDate}/>
            {/* Fin section 1: fiches traitées, entrées $, nbre patients */}
          </Col>

          <Col lg={4}>
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Dashboard
