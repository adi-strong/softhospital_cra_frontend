import {useState} from "react";
import {AppBreadcrumb, AppDataTableBorderless, AppHeadTitle, AppTHead} from "../../components";
import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {CovenantItem} from "./CovenantItem";
import {Link} from "react-router-dom";
import {handleChange} from "../../services/handleFormsFieldsServices";

const covenants = [
  {
    id: 2,
    denomination: 'Back office pro',
    unitName: 'BOP',
    focal: 'Marthe kambanji',
    email: 'bop@contact.com',
    tels: [{num: '0843210565'}],
    createdAt: '2022-12-31 23:36:02'},
  {
    id: 1,
    denomination: 'Vodacom',
    focal: 'Martin fayulu',
    email: 'contact@vodacom.cc',
    tels: [{num: '0904651464'}],
    createdAt: '2022-10-20 18:06:48'},
]

const Covenants = () => {
  const [keywords, setKeywords] = useState({search: ''})

  function handleRefresh() {
  }

  function handleSubmit(e) {
    e.preventDefault()
  } // submit search keywords

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Conventions' />
      <AppBreadcrumb title='Conventions' links={[{label: 'Patients', path: '/patients'}]} />
      <div className="recent-sales">
        <Card className='border-0'>
          <Card.Body>
            <AppDataTableBorderless
              title='Liste des organismes'
              overview={
                <>
                  <p>
                    {covenants.length < 1
                      ? 'Aucun organisme(s) enregistré(s).'
                      : <>Il y a au total <code>{covenants.length.toLocaleString()}</code> organisme(s) enregistré(s) :</>}
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
              thead={<AppTHead onRefresh={handleRefresh} items={[
                {label: '#'},
                {label: 'Dénomination'},
                {label: 'Point focal'},
                {label: 'n° Tél'},
                {label: 'Email'},
              ]}/>}
              tbody={
                <tbody>
                {covenants && covenants?.map(covenant => <CovenantItem key={covenant.id} covenant={covenant}/>)}
                </tbody>
              } />
          </Card.Body>
        </Card>
      </div>
    </div>
  )
}

export default Covenants
