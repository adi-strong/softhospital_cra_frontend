import {useEffect, useState} from "react";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {useDispatch} from "react-redux";
import {AppBreadcrumb, AppFloatingInputField, AppHeadTitle} from "../../components";
import {Button, Card, Col} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {cardTitleStyle} from "../../layouts/AuthLayout";

const AddCovenant = () => {
  const dispatch = useDispatch()
  const [covenant, setCovenant] = useState({
    denomination: '',
    unitName: '',
    focal: '',
    tel: '',
    email: '',
    address: '',
    contract: '',
    logo: '',
  })

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/patients'))
  }, [dispatch])

  function onReset() {
    setCovenant({
      tel: '',
      address: '',
      focal: '',
      logo: '',
      denomination: '',
      contract: '',
      unitName: ''})
  } // handle reset state

  function onSubmit(e) {
    e.preventDefault()
  } // handle submit (add new covenant)

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
                label='Dénomination'
                placeholder='Dénomination'
                name='denomination'
                value={covenant.denomination}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                required
                label='Point focal'
                placeholder='Point focal'
                name='focal'
                value={covenant.focal}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                required
                label='n° Tél'
                placeholder='n° Tél'
                name='tel'
                value={covenant.tel}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />
              <AppFloatingInputField
                required
                type='email'
                label='Email'
                placeholder='Email'
                name='email'
                value={covenant.email}
                onChange={(e) => handleChange(e, covenant, setCovenant)} />

              <div className="text-center">
                <Button type='submit' className='me-1 mb-1'>
                  Enregistrer
                </Button>
                <Button type='button' variant='secondary' className='mb-1' onClick={onReset}>
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
              <p>Veuillez insérer l'image du logo en pièce jointe :</p>
              <Button type='button' variant='warning' className='w-100'>
                <i className='bi bi-upload me-1'/>
              </Button>
            </Card.Body>
          </Card> {/* logo */}
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}>Contrat <i className='text-danger'>*</i></h5>
              <p>Veuillez insérer le fichier PDF du contrat en pièce jointe :</p>
              <Button type='button' variant='light' className='w-100'>
                <i className='bi bi-file-arrow-up'/>
              </Button>
            </Card.Body>
          </Card> {/* contract */}
        </Col> {/* last container */}
      </form>
    </>
  )
}

export default AddCovenant
