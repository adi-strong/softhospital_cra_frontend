import {useState} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";
import moment from "moment";
import {Button, ButtonGroup, Col, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddActCategories} from "./AddActCategories";
import {Link} from "react-router-dom";

const categories = [
  {id: 2, name: 'Lorem', createdAt: '2022-12-25 09:18'},
  {id: 1, name: 'Ipsum', createdAt: '2023-01-04 16:26'},
]

const CategoryActItem = ({category}) => {
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
            <Button type='button' variant='light' className='p-0 pe-1 px-1' title='Suppression'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const ActCategoriesList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewCategory = () => setShowNew(!showNew)

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  function onRefresh() {
  }

  return (
    <>
      <AppDataTableStripped
        title='Liste des catégories'
        overview={
          <>
            <p>
              {categories.length < 1
                ? 'Aucun(e) patient(e) enregistré(e).'
                : <>Au total, <code>{categories.length.toLocaleString()}</code> catégorie(s) enregistrée(s) :</>}
            </p>
            <Col md={6}>
              <Button
                type='button'
                title='Enregistrer un acte médical'
                className='mb-1 me-1'
                onClick={handleToggleNewCategory}>
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
          {label: 'Libéllé'},
          {label: "Date d'enregistrement"},
        ]} />}
        tbody={
          <tbody>
          {categories && categories?.map(category => <CategoryActItem key={category.id} category={category}/>)}
          </tbody>
        } />

      <AddActCategories onHide={handleToggleNewCategory} show={showNew} />
    </>
  )
}
