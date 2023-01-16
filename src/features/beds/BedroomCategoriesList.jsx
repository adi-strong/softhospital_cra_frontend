import {useState} from "react";
import {AppDataTableStripped, AppTHead} from "../../components";
import {Button, ButtonGroup, Form, InputGroup} from "react-bootstrap";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {AddBedroomCategories} from "./AddBedroomCategories";

const categories = [
  {id: 3, name: 'Normale'},
  {id: 2, name: 'Standard'},
  {id: 1, name: 'VIP'},
]

const BedroomCategoryItem = ({category}) => {
  return (
    <>
      <tr>
        <td><i className='bi bi-tag'/></td>
        <td className='text-capitalize'>{category.name}</td>
        <td className='text-md-end'>
          <ButtonGroup>
            <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Modifier'>
              <i className='bi bi-pencil'/>
            </Button>
            <Button type='button' variant='light' className='p-0 px-1 pe-1' title='Supprimer'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}

export const BedroomCategoriesList = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const [showNew, setShowNew] = useState(false)

  const handleToggleNewBedroomCategory = () => setShowNew(!showNew)

  function onRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <>
      <AppDataTableStripped
        title={<><i className='bi bi-tags'/> Catégories de chambres</>}
        overview={
          <>
            <p>
              {categories.length < 1
                ? 'Aucun(e) catégorie enregistrée.'
                : <>Il y a au total <code>{categories.length.toLocaleString()}</code> catégorie(s) enregistré(s) :</>}
            </p>
            <div className='text-md-end'>
              <Button
                type='button'
                variant='secondary'
                title='Enregistrer les catégories'
                className='mb-1 me-1'
                onClick={handleToggleNewBedroomCategory}>
                <i className='bi bi-plus'/> Enregistrer
              </Button>
            </div> {/* add new patient and printing's launch button */}
            <div className='text-md-end'>
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
            </div> {/* search form for patients */}
          </>
        }
        thead={<AppTHead isImg onRefresh={onRefresh} items={[{label: 'Libellé'},]}/>}
        tbody={
          <tbody>
          {categories && categories?.map(category => <BedroomCategoryItem key={category.id} category={category}/>)}
          </tbody>
        } />

      <AddBedroomCategories onHide={handleToggleNewBedroomCategory} show={showNew} />
    </>
  )
}
