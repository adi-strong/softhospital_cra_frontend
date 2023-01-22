import {useEffect, useState} from "react";
import {Alert, Button, Col, Form, Row, Spinner} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useEditUserMutation, useGetSingleUserQuery} from "../users/userApiSlice";
import {useDispatch} from "react-redux";
import {logOut} from "../auth/authSlice";
import {api} from "../../app/store";
import toast from "react-hot-toast";
import {onSetCurrency, onSetRate, onSetSecondCurrency} from "../parameters/parametersSlice";

export function FormRowContent({label, body, error = null, className = ''}) {
  return (
    <Row className='mb-3'>
      <Form.Label className='col-md-4 col-lg-3'>{label}</Form.Label>
      <Col md={8} lg={9} className={className}>
        {body}
        {error && <div className='text-danger'>{error}</div>}
      </Col>
    </Row>
  )
}

export const ChangeUserProfilePassword = ({user}) => {
  const [item, setItem] = useState({password: '', repeatPassword: '', profile: null})
  const [validated, setValidated] = useState(false)
  const [counter, setCounter] = useState({seconds: 5})
  const [show, setShow] = useState(false)
  const [repeatPassErr, setRepeatPassErr] = useState(null)
  const [editUser, {isLoading, isSuccess, isError, error}] = useEditUserMutation()
  const {data: singleUser, isSuccess: success} = useGetSingleUserQuery(user)

  let apiErrors = {password: null}
  const canSave = [item.password, item.repeatPassword].every(Boolean) || !isLoading
  const dispatch = useDispatch()

  useEffect(() => {
    if (user) setItem({password: '', repeatPassword: '', id: user.id})
  }, [user])

  useEffect(() => {
    if (success && singleUser && singleUser?.profile) {
      setItem(prevState => {
        return {
          ...prevState,
          profile: {
            id: `/api/personal_image_objects/${singleUser.profile.id}`,
            contentUrl: singleUser.profile.contentUrl}
        }
      })
    }
  }, [success, singleUser])

  async function onSubmit(e) {
    e.preventDefault()
    e.stopPropagation()
    setValidated(false)
    apiErrors = {password: null}
    setRepeatPassErr(null)
    const form = e.currentTarget
    if (canSave || form.checkValidity() === false) {
      if (item.password !== item.repeatPassword) {
        setRepeatPassErr('Mots de passe non identiques.')
      }
      else {
        setValidated(false)
        const data = await editUser({...item, isChangingPassword: true})
        if (!data.error) {
          toast.success('Modification bien efféctuée.', {
            icon: '😊',
            style: {
              background: '#a1a0a0',
              color: '#000',
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

  useEffect(() => {
    let timerID, seconds = 5
    if (isSuccess) {
      setShow(true)
      timerID = setInterval(() => {
        setCounter({seconds: seconds > 0 ? --seconds : 0})
      }, 1000)
      return () => clearInterval(timerID)
    }
  }, [isSuccess])

  useEffect(() => {
    if (counter.seconds <= 0) {
      dispatch(api.util.resetApiState())
      dispatch(onSetRate(null))
      dispatch(onSetCurrency(null))
      dispatch(onSetSecondCurrency(null))
      dispatch(logOut())
    }
  }, [counter.seconds, dispatch])

  return (
    <>
      <Form noValidate onSubmit={onSubmit} validated={validated} className='pt-2'>
        {show &&
          <Alert variant='info' className='text-center'>
            <Alert.Heading>
              Veuillez ne pas quitter cette page <i className='bi bi-exclamation-circle-fill'/>
            </Alert.Heading>
            <p>
              Vous serez redirigé à la page du login dans : <br/>
              <span style={{ fontWeight: 700 }}>{counter.seconds}</span> seconde(s).
            </p>
          </Alert>}
        <FormRowContent
          label='Nouveau mot de passe'
          error={apiErrors.password}
          body={
            <AppInputField
              autofocus
              required
              type='password'
              name='password'
              value={item.password}
              disabled={isLoading}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />
        <FormRowContent
          label='Confirmation du mot de passe'
          error={repeatPassErr}
          body={
            <AppInputField
              type='password'
              name='repeatPassword'
              disabled={isLoading}
              value={item.repeatPassword}
              onChange={(e) => handleChange(e, item, setItem)} />
          } />

        <div className="text-center mb-3">
          <Button type='submit' disabled={isLoading}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Changer le mot de passe'}
          </Button>
        </div>
      </Form>
    </>
  )
}
