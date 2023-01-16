import {Button, Card, Form, InputGroup, Spinner} from "react-bootstrap";
import {useState} from "react";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {Link, useNavigate} from "react-router-dom";
import {useRegisterMutation} from "../auth/authApiSlice";
import toast from "react-hot-toast";
import {AppHeadTitle} from "../../components";

const Register = () => {
  const [user, setUser] = useState({email: '', username: '', password: '', repeatPassword: ''})
  const [register, {isLoading}] = useRegisterMutation()
  const [terms, setTerms] = useState({check: false})
  const [validated, setValidated] = useState(false)
  const [err, setErr] = useState('')

  const isValid = [user.email, user.username, user.password, user.repeatPassword].every(Boolean) && !isLoading
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setValidated(false)
    if (isValid) {
      setValidated(true)
      if (user.password !== user.repeatPassword) setErr('Mots de passe non identiques.')
      else {
        e.stopPropagation()
        try {
          const userData = await register(user)
          toast.success(`Félicitation ${userData.data.username}, opération efféctuée avec succès.`)
          navigate('/login', {replace: true})
        }
        catch (e) { toast.error(e.message) }
      }
    }
    else setValidated(false)
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
          <Form onSubmit={onSubmit} noValidate validated={validated}>
            <Form.Label htmlFor='email'>Votre adresse email</Form.Label>
            <InputGroup className='mb-3'>
              <Form.Control
                autoFocus
                type='email'
                id='email'
                name='email'
                value={user.email}
                disabled={isLoading}
                onChange={(e) => handleChange(e, user, setUser)} />
            </InputGroup>
            <Form.Label htmlFor='username'>Username</Form.Label>
            <InputGroup className='mb-3'>
              <InputGroup.Text>@</InputGroup.Text>
              <Form.Control
                id='username'
                name='username'
                value={user.username}
                disabled={isLoading}
                onChange={(e) => handleChange(e, user, setUser)} />
            </InputGroup>
            <Form.Label htmlFor='password'>Mot de passe</Form.Label>
            <InputGroup className='mb-3'>
              <Form.Control
                type='password'
                id='password'
                name='password'
                value={user.password}
                disabled={isLoading}
                onChange={(e) => handleChange(e, user, setUser)} />
            </InputGroup>
            <Form.Label htmlFor='password'>Confirmation du mot de passe</Form.Label>
            <InputGroup className='mb-3'>
              <Form.Control
                type='password'
                id='repeatPassword'
                name='repeatPassword'
                value={user.repeatPassword}
                disabled={isLoading}
                onChange={(e) => handleChange(e, user, setUser)} />
              <Form.Control.Feedback>Ce champs doit être renseigné.</Form.Control.Feedback>
            </InputGroup>
            {err && <div className='d-block text-danger'>{err}</div>}
            <Form.Check className='mb-3'>
              <Form.Check.Input
                id='check'
                name='check'
                value={terms.check}
                checked={terms.check}
                disabled={isLoading}
                onChange={(e) => handleChange(e, terms, setTerms)} />
              <Form.Check.Label htmlFor='check'>
                Je valide et accèpte les
                <Link to='#!' className='text-decoration-none mx-1'>termes et conditions</Link>.
              </Form.Check.Label>
            </Form.Check>
            <Button type='submit' className='w-100' disabled={isLoading || !terms.check}>
              {isLoading ? <>Traitement en cours <Spinner animation='border' size='sm'/></> : 'Créer'}
            </Button>

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
