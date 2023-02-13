import {useState} from "react";
import {AppBreadcrumb, AppDataTableBorderless, AppHeadTitle, AppMainError, AppTHead} from "../../components";
import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {CovenantItem} from "./CovenantItem";
import {Link} from "react-router-dom";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {totalCovenants, useGetCovenantsQuery} from "./covenantApiSlice";

const Covenants = () => {
  const [keywords, setKeywords] = useState({search: ''})
  const {data: covenants = [], isLoading, isFetching, isSuccess, isError, refetch} = useGetCovenantsQuery('Covenant')

  let content, errors
  if (isError) errors = <AppMainError/>
  else if (isSuccess) content = covenants && covenants.ids.map(id => <CovenantItem key={id} id={id}/>)

  const handleRefresh = async () => await refetch()

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Conventions' />
      <AppBreadcrumb title='Conventions' links={[{label: 'Patients', path: '/patients'}]} />
      <Card className='border-0 top-selling overflow-auto'>
        <Card.Body>
          <AppDataTableBorderless
            loader={isLoading}
            title='Liste des organismes'
            overview={
              <>
                <p>
                  {totalCovenants < 1
                    ? 'Aucun organisme(s) enregistré(s).'
                    : <>Il y a au total <code>{totalCovenants.toLocaleString()}</code> organisme(s) enregistré(s) :</>}
                </p>
                <Col md={6}>
                  <Link
                    to='/member/patients/covenants/add'
                    className='btn btn-primary mb-1 me-1'>
                    <i className='bi bi-plus'/> Enregistrer
                  </Link>
                  <button type="button" className="btn btn-info mb-1" disabled={covenants.length < 1}>
                    <i className='bi bi-printer'/> Impression
                  </button>
                </Col> {/* buttons */}
                <Col md={6}> {/* search */}
                  <form onSubmit={handleSubmit}>
                    <InputGroup>
                      <Form.Control
                        placeholder='Votre recherche ici...'
                        aria-label='Votre recherche ici...'
                        autoComplete='off'
                        disabled={covenants.length < 1}
                        name='search'
                        value={keywords.search}
                        onChange={(e) => handleChange(e, keywords, setKeywords)} />
                      <Button type='submit' variant='secondary' disabled={covenants.length < 1}>
                        <i className='bi bi-search'/>
                      </Button>
                    </InputGroup>
                  </form>
                </Col>
              </>
            }
            thead={<AppTHead isImg onRefresh={handleRefresh} loader={isLoading} isFetching={isFetching} items={[
              {label: '#'},
              {label: 'Dénomination'},
              {label: 'Point focal'},
              {label: 'n° Tél'},
              {label: 'Email'},
              {label: 'Date'},
            ]}/>}
            tbody={<tbody>{content}</tbody>} />

          {errors && errors}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Covenants
