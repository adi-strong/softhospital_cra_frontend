import {Alert, Button, Card, Form, InputGroup} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useEffect, useState} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useLoginMutation} from "../auth/authApiSlice";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentToken, setCredentials} from "../auth/authSlice";
import {AppHeadTitle} from "../../components";
import {Link, useLocation, useNavigate} from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [user, setUser] = useState({username: '', password: ''})
  const [err, setErr] = useState('')
  const [show, setShow] = useState(false)
  const [login, {isLoading}] = useLoginMutation()

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const token = useSelector(selectCurrentToken)
  const location = useLocation()
  const from = location?.state?.from?.pathname || '/member/reception'

  async function onSubmit(e) {
    e.preventDefault()
    setShow(false)
    setErr('')
    try {
      const userData = await login(user)
      dispatch(setCredentials(userData.data.token))
      setUser({username: '', password: ''})
      toast.success('Bienvenue ❗', {
        icon: '😊',
        style: {
          background: 'green',
          color: '#fff'
        }
      })
      navigate(from, {replace: true})
    }
    catch (e) {
      toast.error(e.message, {
        duration: 5000,
        icon: '⁉ 😮',
        style: {
          background: 'red',
        }
      })
      setShow(true)
      setErr('Identifants non valides.')
    }
  } // handle submit credentials

  useEffect(() => {
    if (token) {
      dispatch(setCredentials(token))
      navigate(from, {replace: true})
    }
  }, [token, dispatch, navigate, from])

  return (
    <>
      <AppHeadTitle title='Authentification' />
      <Card className='border-0'>
        <Card.Body>
          <div className="pt-4 pb-2">
            <h5 className="card-title text-center pb-0 fs-4" style={cardTitleStyle}>Authentification</h5>
            <p className="text-center small">
              Veuillez renseigner votre username ainsi que votre mot de passe pour vous connecter.
            </p>
          </div>
          {show &&
            <Alert variant='danger' className='text-center' onClose={() => setShow(false)} dismissible>
              <Alert.Heading>
                😮 Erreur
              </Alert.Heading>
              <p>
                <i className='bi bi-exclamation-circle'/> {err}
              </p><hr/>
              <p>Veuillez également vous assurer que vous êtes bien connecté ❗</p>
            </Alert>}
          <Form onSubmit={onSubmit}>
            <Form.Label id='username'>Username</Form.Label>
            <InputGroup className='mb-3'>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                autoFocus
                disabled={isLoading}
                id='username'
                name='username'
                value={user.username}
                onChange={(e) => handleChange(e, user, setUser)} />
            </InputGroup>
            <Form.Label id='password'>Mot de passe</Form.Label>
            <InputGroup className='mb-3'>
              <Form.Control
                disabled={isLoading}
                id='password'
                type='password'
                name='password'
                value={user.password}
                onChange={(e) => handleChange(e, user, setUser)} />
            </InputGroup>

            <Button type='submit' className='w-100 mt-2' disabled={isLoading}>Se connecter</Button>

            <p className="small mb-0 mt-3">
              Vous n'avez encore de compte ?
              <Link to='/register' className='mx-1 text-decoration-none'>
                Créer un compte
              </Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default Login
