import {useState} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";
import {Link} from "react-router-dom";
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddTreatments} from "./AddTreatments";

const treatments = [
  {id: 2, name: 'Malaria', category: 'Paludisme', cost: 5, price: 8},
  {id: 1, name: 'Typhoïde', category: 'Infection', cost: 2, price: 6},
]

const TreatmentItem = ({treatment}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-clipboard-pulse'/></td>
        <th scope='row'>{treatment.id}</th>
        <td className='text-capitalize'>{treatment.name}</td>
        <td className='text-capitalize'>
          <Link to={`#!`} className='text-decoration-none'>
            {treatment.category}
          </Link>
        </td>
        <th scope='row'>
          {treatment.cost.toFixed(2).toLocaleString()}
          <span className='mx-1 text-secondary'>USD</span>
        </th>
        <th scope='row'>
          {treatment.price.toFixed(2).toLocaleString()}
          <span className='mx-1 text-secondary'>USD</span>
        </th>
        <td className='text-md-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' className='p-0 pe-1 px-1' title='Modification'>
              <i className='bi bi-pencil'/>
            </Button>
            <Button size='sm' variant='light' type='button' className='p-0 pe-1 px-1' title='Suppression'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const TreatmentsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewTreatments = () => setShowNew(!showNew)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        title='Liste de traitements'
        overview={
          <>
            <p>
              {treatments.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Il y a au total <code>{treatments.length.toLocaleString()}</code> traitement(s) disponibles(s) :</>}
            </p>
            <Col md={6}>
              <Button
                type='button'
                title='Enregistrer un traitement'
                className='mb-1 me-1'
                onClick={handleToggleNewTreatments}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
              <Button type="button" variant='info' className='mb-1' disabled={treatments.length < 1}>
                <i className='bi bi-printer'/> Impression
              </Button>
            </Col> {/* add new patient and printing's launch button */}
            <Col className='text-md-end'>
              <form onSubmit={handleSubmit}>
                <InputGroup>
                  <Form.Control
                    placeholder='Votre recherche ici...'
                    aria-label='Votre recherche ici...'
                    autoComplete='off'
                    disabled={treatments.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={treatments.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg onRefresh={onRefresh} items={[
          {label: '#'},
          {label: 'Libéllé'},
          {label: 'Catégorie'},
          {label: 'Coût'},
          {label: 'Prix'},
        ]}/>}
        tbody={
          <tbody>
          {treatments && treatments?.map(treatment => <TreatmentItem key={treatment.id} treatment={treatment}/>)}
          </tbody>
        } />

      <AddTreatments onHide={handleToggleNewTreatments} show={showNew} />
    </>
  )
}
