import {useState} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {Link} from "react-router-dom";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddActs} from "./AddActs";

const acts = [
  {id: 3, name: 'Rendez-vous simple', category: 'Rendez-vous', price: null},
  {id: 2, name: 'Examen général', category: 'Consultation', price: 0.2},
  {id: 1, name: 'Rencontre', price: null},
]

const ActItem = ({act}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-person-rolodex'/></td>
        <th>{act.id}</th>
        <td>{act.name}</td>
        <td className='fw-bold'>
          {act.price
            ? <>{act.price.toFixed(2).toLocaleString()}<span className='text-secondary mx-1'>USD</span></>
            : '-'}
        </td>
        <td>
          {act?.category ? <Link to={`#!`} className='text-decoration-none'>{act.category}</Link> : '-'}
        </td>
        <td className='text-md-end'>
          <ButtonGroup>
            <Link to={`/tasks/acts/${act.id}`} className='btn btn-sm btn-light p-0 pe-1 px-1' title='Modification'>
              <i className='bi bi-pencil'/>
            </Link>
            <Button size='sm' variant='light' type='button' className='p-0 pe-1 px-1' title='Suppression'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const ActsList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewAct = () => setShowNew(!showNew)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        title='Liste des actes médicaux'
        overview={
          <>
            <p>
              {acts.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Au total, <code>{acts.length.toLocaleString()}</code> acte(s) enregistré(s) :</>}
            </p>
            <Col md={6}>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-1 me-1'
                onClick={handleToggleNewAct}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
              <Button type="button" variant='info' className='mb-1' disabled={acts.length < 1}>
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
                    disabled={acts.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={acts.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead onRefresh={onRefresh} isImg items={[
          {label: '#'},
          {label: "Libéllé"},
          {label: 'Prix'},
          {label: 'Catégorie'},
        ]}/>}
        tbody={
          <tbody>
          {acts && acts?.map(act => <ActItem key={act.id} act={act}/>)}
          </tbody>
        } />

      <AddActs show={showNew} onHide={handleToggleNewAct} />
    </>
  )
}
