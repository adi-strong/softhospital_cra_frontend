import {useState} from "react";
import {AppEditModal, AppSSelectField} from "../../components";
import {useUpdateUserMutation} from "./userApiSlice";
import toast from "react-hot-toast";
import {Form, Row} from "react-bootstrap";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {rolesOptions} from "./AddUser";

export const EditUser = ({show, onHide, data}) => {
  const [user, setUser] = useState({...data, role: data.roles[0]})
  const [updateUser, {isLoading, isError, error}] = useUpdateUserMutation()
  let apiErrors = {username: null, name: null, tel: '', email: null}

  const canSave = [user.username, user.tel].every(Boolean)

  async function onSubmit() {
    apiErrors = {username: null, name: null, tel: '', email: null}
    if (canSave) {
      try {
        const userData = await updateUser({
          id: user.id,
          username: user.username,
          tel: user.tel,
          email: user?.email ? user.email : null,
          isActive: user.isActive,
          name: user?.name ? user.name : null,
          roles: [user.role]
        })
        if (!userData.error) {
          toast.success('Modification bien efféctuée.')
          onHide()
        }
      } catch (e) { toast.error(e.message) }
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
      <AppEditModal
        show={show}
        onHide={onHide}
        loader={isLoading}
        onEdit={onSubmit}>
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

        <Form.Switch className='d-flex justify-content-around'>
          <Form.Label htmlFor='isActive'>
            <i className='text-danger bi bi-exclamation-triangle-fill'/> Activer / Désactiver l'utilisateur
          </Form.Label>
          <Form.Check
            id='isActive'
            name='isActive'
            value={user.isActive}
            onChange={(e) => handleChange(e, user, setUser)}
            disabled={isLoading}
            type='checkbox'
            checked={user.isActive} />
        </Form.Switch>
      </AppEditModal>
    </>
  )
}
