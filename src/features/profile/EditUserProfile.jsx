import {useEffect, useState} from "react";
import {RowContent} from "../patients/PatientOverviewTab";
import AppInputField from "../../components/forms/AppInputField";
import {handleChange} from "../../services/handleFormsFieldsServices";
import img from '../../assets/app/img/default_profile.jpg';
import {Button, Form, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {selectCurrentUser} from "../auth/authSlice";
import {useEditUserMutation, useGetSingleUserQuery} from "../users/userApiSlice";
import toast from "react-hot-toast";
import {entrypoint} from "../../app/store";
import {AddPersonalImageModal} from "../images/AddPersonalImageModal";

export function EditUserProfile() {
  const user = useSelector(selectCurrentUser)
  const [item, setItem] = useState({email: '', username: '', tel: '', profile: null})
  const [validated, setValidated] = useState(false)
  const [showNewImage, setShowNewImage] = useState(false)
  const [editUser, {isLoading, isError, error}] = useEditUserMutation()
  const {data: singleUser, isSuccess: success} = useGetSingleUserQuery(user)

  let apiErrors = {tel: null, username: null, email: null}
  const canSave = [item.tel, item.username].every(Boolean) || !isLoading

  useEffect(() => {
    if (user) {
      setItem({
        id: user.id,
        tel: user.tel,
        username: user.username,
        email: user.email ? user.email : '',
      })
    }
  }, [singleUser, success, user])

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

  const handleToggleShowNewImage = () => setShowNewImage(!showNewImage)

  const onRemoveProfile = () => setItem({...item, profile: null})

  async function onSubmit(e) {
    e.preventDefault()
    const form = e.currentTarget
    apiErrors = {tel: null, username: null, email: null}
    if (canSave || form.checkValidity() === false) {
      e.stopPropagation()
      try {
        const data = await editUser(item)
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
      catch (e) {
        toast.error(e.message, {
          style: {
            background: "red",
          }
        })
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
      <Form noValidate onSubmit={onSubmit} validated={validated} className='pt-2'>
        <RowContent
          label='Profil Image'
          body={
            <>
              <img
                src={item?.profile ? `${entrypoint}${item.profile.contentUrl}` : img}
                alt="Profile"
                width={120}
                height={120}/>
              <div className="pt-2">
                <button
                  onClick={handleToggleShowNewImage}
                  type='button'
                  className="btn btn-primary btn-sm me-1 mb-1"
                  title="Upload new profile image">
                  <i className="bi bi-upload"/>
                </button>
                <button
                  onClick={onRemoveProfile}
                  type='button'
                  className="btn btn-danger btn-sm mb-1"
                  title="Remove my profile image">
                  <i className="bi bi-trash"/>
                </button>
              </div>
            </>
          } /> {/* Profile Image */}
        <RowContent
          label='Adresse email'
          error={apiErrors.email}
          body={
            <AppInputField
              autofocus
              type='email'
              name='email'
              value={item.email}
              onChange={(e) => handleChange(e, item, setItem)}
              disabled={isLoading}
              placeholder='Email' />
          } />
        <RowContent
          label='Username'
          error={apiErrors.username}
          body={
            <AppInputField
              required
              name='username'
              value={item.username}
              onChange={(e) => handleChange(e, item, setItem)}
              disabled={isLoading}
              placeholder='Username' />
          } />
        <RowContent
          label='n° Tél'
          error={apiErrors.tel}
          body={
            <AppInputField
              required
              name='tel'
              value={item.tel}
              onChange={(e) => handleChange(e, item, setItem)}
              disabled={isLoading}
              placeholder='n° Tél' />
          } />
        <div className="text-center">
          <Button type='submit' disabled={isLoading}>
            {isLoading ? <>Veuillez patienter <Spinner animation='border' size='sm'/></> : 'Modifier'}
          </Button>
        </div>
      </Form>

      <AddPersonalImageModal
        show={showNewImage}
        onHide={handleToggleShowNewImage}
        item='profile'
        itemState={item}
        setItemState={setItem} />
    </>
  )
}
