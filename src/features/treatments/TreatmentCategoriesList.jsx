import {useState} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {Link} from "react-router-dom";
import moment from "moment";
import {AddTreatmentCategories} from "./AddTreatmentCategories";

const categories = [
  {id: 2, name: 'Paludisme', createdAt: '2023-01-02 04:10'},
  {id: 1, name: 'Infections', createdAt: '2023-01-05 09:16'},
]

const TreatmentCategoryItem = ({category}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-tags'/></td>
        <th scope='row'>{category.id}</th>
        <td className='text-capitalize'>
          <Link to={`#!`} className='text-decoration-none'>
            {category.name}
          </Link>
        </td>
        <td>{category?.createdAt ? moment(category.createdAt).calendar() : '-'}</td>
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

export const TreatmentCategoriesList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewTreatmentCategories = () => setShowNew(!showNew)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        title='Liste de catégories des traitements'
        overview={
          <>
            <p>
              {categories.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Il y a au total <code>{categories.length.toLocaleString()}</code> catégorie(s) enregistrée(s) :</>}
            </p>
            <Col md={6}>
              <Button
                type='button'
                title='Enregistrer une catégorie'
                className='mb-1 me-1'
                onClick={handleToggleNewTreatmentCategories}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
              <Button type="button" variant='info' className='mb-1' disabled={categories.length < 1}>
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
                    disabled={categories.length < 1}
                    name='search'
                    value={keywords.search}
                    onChange={(e) => handleChange(e, keywords, setKeywords)} />
                  <Button type='submit' variant='light' disabled={categories.length < 1}>
                    <i className='bi bi-search'/>
                  </Button>
                </InputGroup>
              </form>
            </Col> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg onRefresh={onRefresh} items={[
          {label: '#'},
          {label: 'Libellé'},
          {label: "Date d'enregistrement"},
        ]}/>}
        tbody={
          <tbody>
          {categories && categories?.map(category => <TreatmentCategoryItem key={category.id} category={category}/>)}
          </tbody>
        } />

      <AddTreatmentCategories onHide={handleToggleNewTreatmentCategories} show={showNew} />
    </>
  )
}
