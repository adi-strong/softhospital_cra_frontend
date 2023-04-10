import {useEffect, useState} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {useDispatch, useSelector} from "react-redux";
import {AppBreadcrumb, AppFloatingInputField, AppHeadTitle} from "../../components";
import {Button, Card, Col, Form, Spinner} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {AddImageModal} from "../images/AddImageModal";
import {entrypoint} from "../../app/store";
import {useAddNewCovenantMutation} from "./covenantApiSlice";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowSingleCovenantPage} from "../../app/config";

export const requiredField = <i className='text-danger'>*</i>

const AddCovenant = () => {
  const dispatch = useDispatch(), navigate = useNavigate()
  const [showImage, setShowImage] = useState(false)
  const [addNewCovenant, {isLoading, isError, error}] = useAddNewCovenantMutation()
  const [covenant, setCovenant] = useState({
    denomination: '',
    unitName: '',
    focal: '',
    tel: '',
    email: '',
    address: '',
    logo: null,
    file: null,
  })

  let apiErrors = {denomination: '', unitName: '', focal: '', tel: '', email: '', address: '', logo: null, file: null,}

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/patients'))
  }, [dispatch])

  const toggleImageModal = () => setShowImage(!showImage)

  function onReset() {
    setCovenant({
      denomination: '',
      unitName: '',
      focal: '',
      tel: '',
      email: '',
      address: '',
      logo: null,
      file: null
    })
  } // handle reset state

  const onFileChange = ({target}) => setCovenant({...covenant, file: target.files[0]})

  async function onSubmit(e) {
    e.preventDefault()
    apiErrors = {denomination: '', unitName: '', focal: '', tel: '', email: '', address: '', logo: null, file: null,}
    const formData = new FormData()

    if (covenant.logo) {
      formData.append('logo', covenant.logo?.id ? covenant.logo.id : null)
      formData.append('unitName', covenant.unitName)
      formData.append('tel', covenant.tel)
      formData.append('file', covenant.file)
      formData.append('focal', covenant.focal)
      formData.append('email', covenant.email)
      formData.append('denomination', covenant.denomination)
      formData.append('address', covenant.address)
    }
    else {
      formData.append('unitName', covenant.unitName)
      formData.append('tel', covenant.tel)
      formData.append('file', covenant.file)
      formData.append('focal', covenant.focal)
      formData.append('email', covenant.email)
      formData.append('denomination', covenant.denomination)
      formData.append('address', covenant.address)
    }
    try {
      const data = await addNewCovenant(formData)
      if (!data.error) {
        toast.success('Enregistrement bien efféctué.')
        onReset()
        navigate('/member/patients/covenants')
      }
    }
    catch (e) { toast.error(e.message) }
  } // handle submit (add new covenant)

  if (isError) {
    const { violations } = error.data
    if (violations) {
      violations.forEach(({ propertyPath, message }) => {
        apiErrors[propertyPath] = message;
      });
    }
  }

  const user = useSelector(selectCurrentUser)
  useEffect(() => {
    if (user && !allowShowSingleCovenantPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <>
      <AppHeadTitle title='Enregistrer un organisme' />
      <AppBreadcrumb title='Enregistrer un organisme' links={[{label: 'Conventions', path: '/patients/covenants'}]} />
      <form onSubmit={onSubmit} className='row'>
        <Col md={7}>
          <Card className='border-0'>
            <Card.Body className='pt-4'>
              <AppFloatingInputField
                required
                autofocus
                disabled={isLoading}
                error={apiErrors.denomination}
                label={<>Dénomination {requiredField}</>}
                placeholder='Dénomination'
                name='denomination'
                value={covenant.denomination}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                disabled={isLoading}
                error={apiErrors.unitName}
                maxLength={20}
                text='Ce champs ne peut dépasser 20 caractères.'
                label='Abbréviation'
                placeholder='Abbréviation'
                name='unitName'
                value={covenant.unitName}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                required
                disabled={isLoading}
                error={apiErrors.focal}
                label={<>Point focal {requiredField}</>}
                placeholder='Point focal'
                name='focal'
                value={covenant.focal}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                required
                disabled={isLoading}
                error={apiErrors.tel}
                label={<>n° Tél {requiredField}</>}
                placeholder='n° Tél'
                name='tel'
                value={covenant.tel}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                required
                disabled={isLoading}
                error={apiErrors.email}
                type='email'
                label={<>Email {requiredField}</>}
                placeholder='Email'
                name='email'
                value={covenant.email}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                maxLength={255}
                disabled={isLoading}
                error={apiErrors.address}
                label='Adresse'
                placeholder='Adresse'
                name='address'
                value={covenant.address}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />

              <div className="text-center">
                <Button type='submit' className='me-1 mb-1' disabled={isLoading}>
                  {isLoading ? <>Veillez patienter <Spinner animation='border' size='sm'/></> : 'Enregistrer'}
                </Button>
                <Button type='button' variant='secondary' className='mb-1' onClick={onReset} disabled={isLoading}>
                  Effacer
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col> {/* first container */}
        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>Logo <small><i>(faculatif)</i></small></h5>
              {!covenant.logo && <p>Veuillez insérer l'image du logo en pièce jointe :</p>}
              {apiErrors.logo && <p className='text-danger'>{apiErrors.logo}</p>}

              <figure>
                {covenant.logo &&
                  <img
                    src={entrypoint+covenant.logo.contentUrl}
                    alt="Logo"
                    style={{ width: '100%', height: 150 }}/>}
              </figure>

              <Button type='button' variant='warning' className='w-100' onClick={toggleImageModal} disabled={isLoading}>
                <i className='bi bi-upload me-1'/>
              </Button>
            </Card.Body>
          </Card> {/* logo */}

          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>Contrat <i className='text-danger'>*</i></h5>
              {!covenant.file && <p>Veuillez insérer le fichier PDF du contrat en pièce jointe :</p>}
              {apiErrors.file && <p className='text-danger'>{apiErrors.file}</p>}
              <input
                type='file'
                accept='application/pdf'
                onChange={onFileChange}
                id='file'
                hidden />

              {covenant.file &&
                <h4 className='mb-2 text-warning fw-bold'>
                  <i className='bi bi-file-pdf-fill me-1'/>
                  {covenant.file.name}
                </h4>}

              <Form.Label htmlFor='file' className={`btn btn-light d-block w-100 ${apiErrors.file ? 'text-danger' : ''}`}>
                <i className='bi bi-file-arrow-up'/>
              </Form.Label>
            </Card.Body>
          </Card> {/* contract */}
        </Col> {/* last container */}
      </form>

      <AddImageModal
        show={showImage}
        onHide={toggleImageModal}
        item='logo'
        itemState={covenant}
        setItemState={setCovenant} />
    </>
  )
}

export default AddCovenant
