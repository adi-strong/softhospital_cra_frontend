import {Button, Card, Form, Spinner, Col} from "react-bootstrap";
import {useState} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {Link, useNavigate} from "react-router-dom";
import {useRegisterMutation} from "../auth/authApiSlice";
import {AppHeadTitle} from "../../components";
import toast from "react-hot-toast";

export const requiredStart = <i className='text-danger'>*</i>

const Register = () => {
  const [user, setUser] = useState({tel: '', username: '', password: '', repeatPassword: ''})
  const [register, {isLoading, isError, error}] = useRegisterMutation()
  const [terms, setTerms] = useState({check: false})
  const [err, setErr] = useState('')
  const [validated, setValidated] = useState(false)

  const canSave = [user.tel, user.username, user.password, user.repeatPassword].every(Boolean) || !isLoading

  let apiErrors = {tel: null, username: null, password: null}
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    setErr('')
    apiErrors = {tel: null, username: null, password: null}
    if (canSave || form.checkValidity() === false) {
      e.stopPropagation()
      if (user.password !== user.repeatPassword) setErr("Mots de passe non identiques.")
      else {
        try {
          const data = await register({...user, email: null})
          if (!data.error) {
            toast.success('Inscription bien efféctuée.')
            navigate('/login', {replace: true})
          }
        }
        catch (e) {
          toast.error(e.message, {
            style: {
              background: "red",
            }
          })
        }
      }
    }
    setValidated(true)
  }

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  return (
    <>
      <AppHeadTitle title='Créer un compte' />
      <Card className='border-0 mb-3'>
        <Card.Body>
          <div className="pt-4 pb-2">
            <h5 className="card-title text-center pb-0 fs-4">Créer un Compte</h5>
            <p className='text-center small'>Veuillez renseigner vos identifiants et vos infos personnelles.</p>
          </div>
          <Form noValidate onSubmit={onSubmit} validated={validated} className='row'>
            <Form.Group as={Col} xl={12} controlId='tel' className='mb-3'>
              <Form.Label>n° Téléphone {requiredStart}</Form.Label>
              <Form.Control
                autoFocus
                required
                name='tel'
                value={user.tel}
                onChange={(e) => handleChange(e, user, setUser)}
                disabled={isLoading} />
              {apiErrors.tel && <div className="text-danger">{apiErrors.tel}</div>}
            </Form.Group>
            <Form.Group as={Col} xl={12} controlId='username' className='mb-3'>
              <Form.Label>Username {requiredStart}</Form.Label>
              <Form.Control
                required
                name='username'
                value={user.username}
                onChange={(e) => handleChange(e, user, setUser)}
                disabled={isLoading} />
              {apiErrors.username && <div className="text-danger">{apiErrors.username}</div>}
            </Form.Group>
            <Form.Group as={Col} xl={12} controlId='password' className='mb-3'>
              <Form.Label>Mot de passe {requiredStart}</Form.Label>
              <Form.Control
                required
                type='password'
                name='password'
                value={user.password}
                onChange={(e) => handleChange(e, user, setUser)}
                disabled={isLoading} />
              {apiErrors.password && <div className="text-danger">{apiErrors.password}</div>}
            </Form.Group>
            <Form.Group as={Col} xl={12} controlId='repeatPassword' className='mb-3'>
              <Form.Label>Confirmer le mot de passe</Form.Label>
              <Form.Control
                type='password'
                name='repeatPassword'
                value={user.repeatPassword}
                onChange={(e) => handleChange(e, user, setUser)}
                disabled={isLoading} />
              {err && <div className='d-block text-danger'>{err}</div>}
            </Form.Group>
            <Col xl={12} className='mb-3'>
              <Form.Check>
                <Form.Check.Input
                  id='check'
                  name='check'
                  value={terms.check}
                  checked={terms.check}
                  disabled={isLoading}
                  className='text-primary'
                  onChange={(e) => handleChange(e, terms, setTerms)} />
                <Form.Check.Label htmlFor='check' className='text-dark'>
                  Je valide et accèpte les
                  <Link to='#!' className='text-decoration-none mx-1'>termes et conditions</Link>.
                </Form.Check.Label>
              </Form.Check>
            </Col>

            <Col xl={12}>
              <Button type='submit' className='w-100' disabled={isLoading || !terms.check}>
                {isLoading ? <>Traitement en cours <Spinner animation='border' size='sm'/></> : 'Créer'}
              </Button>
            </Col>

            <p className="small mb-0 mt-2">Avez-vous déjà un compte ?
              <Link to='/login' className='mx-1 text-decoration-none'>Se connecter</Link>
            </p>
          </Form>
        </Card.Body>
      </Card>
    </>
  )
}

export default Register
