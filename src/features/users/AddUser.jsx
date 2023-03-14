import {useEffect, useState} from "react";
import {AppAddModal, AppSSelectField} from "../../components";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {Row} from "react-bootstrap";
import {useAddNewUserMutation} from "./userApiSlice";
import toast from "react-hot-toast";

export const rolesOptions = [
  {label: 'Administrateur', value: 'ROLE_ADMIN'},
  {label: 'Docteur', value: 'ROLE_DOCTOR'},
  {label: 'Médecin', value: 'ROLE_MEDIC'},
  {label: 'Caissier(e)', value: 'ROLE_CASHIER'},
  {label: 'Pharmacien(ne)', value: 'ROLE_DRUGGIST'},
  {label: 'Laborantin', value: 'ROLE_LAB'},
  {label: 'Réceptioniste', value: 'ROLE_RECEPTIONIST'},
]

export const AddUser = ({show = false, onHide, data}) => {
  const [addNewUser, {isLoading, isError, error}] = useAddNewUserMutation()
  const [user, setUser] = useState({
    username: '',
    name: '',
    password: '',
    repeatPass: '',
    tel: '',
    email: '',
    role: 'ROLE_RECEPTIONIST'})
  const [agent] = useState(data ? data : null)
  const [repeatPass, setRepeatPass] = useState(null)
  let apiErrors = {username: null, name: null, password: null, tel: '', email: null}

  const canSave = [user.username, user.password, user.tel].every(Boolean)

  useEffect(() => {
    if (data) {
      const firstName = data?.firstName ? data.firstName : ''
      const name = data.name+' '+firstName
      const email = data?.email ? data.email : ''

      setUser(prevState => {
        return {...prevState, name, tel: data.phone, email}
      })
    }
  }, [data])

  async function onSubmit() {
    apiErrors = {username: null, name: null, password: null, repeatPass: null, tel: '', email: null}
    setRepeatPass(null)
    if (canSave) {
      if (user.password !== user.repeatPass) setRepeatPass('Mots de passe non identiques.')
      else {
        try {
          const userData = await addNewUser({...user, agentId: agent ? agent.id : null, roles: [user.role]})
          if (!userData.error) {
            toast.success('Création bien efféctuée.')
            onHide()
          }
        } catch (e) { toast.error(e.message) }
      }
    }
    else alert('Données fournies invalides !')
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
      <AppAddModal
        loader={isLoading}
        show={show}
        onHide={onHide}
        onAdd={onSubmit}
        title='Ajouter un utilisateur'>
        <Row>
          <AppInputField
            autofocus
            disabled={isLoading}
            error={apiErrors.name}
            label='Nom complet'
            name='name'
            className='col-md-6'
            value={user.name}
            onChange={(e) => handleChange(e, user, setUser)} />
          <AppInputField
            required
            disabled={isLoading}
            error={apiErrors.username}
            className='col-md-6'
            label={<><i className='bi bi-person-circle'/> Username <i className='text-danger'>*</i></>}
            placeholder="Nom d'utilisateur"
            name='username'
            value={user.username}
            onChange={(e) => handleChange(e, user, setUser)} />
        </Row>

        <AppInputField
          required
          disabled={isLoading}
          error={apiErrors.password}
          type='password'
          label={<><i className='bi bi-lock-fill'/> Mot de passe <i className='text-danger'>*</i></>}
          name='password'
          value={user.password}
          onChange={(e) => handleChange(e, user, setUser)} />
        <AppInputField
          disabled={isLoading}
          error={repeatPass}
          type='password'
          label='Confirmation du mot de passe'
          name='repeatPass'
          value={user.repeatPass}
          onChange={(e) => handleChange(e, user, setUser)} />

        <AppSSelectField
          name='role'
          value={user.role}
          onChange={(e) => setUser({...user, role: e.target.value})}
          disabled={isLoading}
          label='Rôle / Droits'
          options={rolesOptions} />

        <Row>
          <AppInputField
            required
            disabled={isLoading}
            error={apiErrors.tel}
            className='col-md-6'
            label={<><i className='bi bi-telephone-fill'/> n° Téléphone <i className='text-danger'>*</i></>}
            name='tel'
            value={user.tel}
            onChange={(e) => handleChange(e, user, setUser)} />
          <AppInputField
            disabled={isLoading}
            error={apiErrors.email}
            type='email'
            className='col-md-6'
            label='Email'
            name='email'
            value={user.email}
            onChange={(e) => handleChange(e, user, setUser)} />
        </Row>
      </AppAddModal>
    </>
  )
}
