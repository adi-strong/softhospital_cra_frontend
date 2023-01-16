import {memo} from "react";
import {Container} from "react-bootstrap";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {selectCurrentToken} from "../../features/auth/authSlice";
import notFoundImg from '../../assets/app/img/not-found.svg';

const App404Error = () => {
  const token = useSelector(selectCurrentToken)

  return (
    <main>
      <Container>
        <section className="section error-404 min-vh-100 d-flex flex-column align-items-center justify-content-center">
          <h1>404</h1>
          <h2>La page que vous recherchez est en construction ou n'existe pas.</h2>
          <Link className='btn' to={token ? '/member/reception' : '/'}>
            {token ? 'Retour à la réception' : 'Retour à l\'accueil'}
          </Link>
          <img src={notFoundImg} className="img-fluid py-5" alt="Page Not Found"/>
        </section>
      </Container>
    </main>
  )
}

export default memo(App404Error)
