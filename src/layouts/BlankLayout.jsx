import '../assets/app/css/style.css';
import '../assets/app/vendor/quill/quill.snow.css';
import '../assets/app/vendor/quill/quill.bubble.css';
import '../assets/app/vendor/remixicon/remixicon.css';
import '../assets/app/vendor/simple-datatables/style.css';
import logo from '../assets/app/img/logo.png';
import {Link, Outlet} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";

const style = {
  fontSize: 26,
  fontWeight: 700,
  color: '#012970',
  fontFamily: 'Nunito, sans-serif',
  position: 'relative',
  top: 5,
}

export const BlankLayout = () => {
  return (
    <main>
      <Container>
        <section className='section register min-vh-100 d-flex flex-column align-items-center justify-content-center py-4'>
          <Container>
            <Row className='justify-content-center'>
              <Col lg={4} md={6} className='d-flex flex-column align-items-center justify-content-center'>
                <div className="d-flex justify-content-center py-4">
                  <Link to='/member/dashboard' className='text-decoration-none'>
                    <img src={logo} alt='' width={24.5} height={26} className='me-2'/>
                    <span style={style}>softHospital</span>
                  </Link>
                </div>
                <Outlet/>
              </Col>
            </Row>
          </Container>
        </section>
      </Container>
    </main>
  )
}
