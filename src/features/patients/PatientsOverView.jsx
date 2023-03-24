import {Col, Form} from "react-bootstrap";
import {Link} from "react-router-dom";

export function PatientsOverView(
  {
    totalItems,
    researchTotalItems = 0,
    isResearch = false,
    onDeepSearch,
    setSearch,
    search,
    searchLoader = false,
    tempSearch,
  }) {
  const handleSearch = ({ target }) => {
    const value = target?.value
    setSearch(value)
  }

  return (
    <>
      <p>
        {!isResearch && totalItems > 0
          && <>Il y a au total <code>{totalItems.toLocaleString()}</code> patient(s) enregistré(s) :</>}
        {!isResearch && totalItems < 1 && 'Auucun patient enregistré pour le moment 🎈'}
        {isResearch && researchTotalItems > 0
          && (
            <>
              Au total <code className='me-1'>{researchTotalItems.toLocaleString()}</code>
              patient(s) trouvés suite à votre recherche ⏩ <b>"{tempSearch}"</b>
            </>
          )}
        {isResearch && researchTotalItems < 1 && 'Auucun patient trouvé suite à votre recherche 🎈'}
      </p>

      <Col md={3}>
        <Link to='/member/patients/add' className='btn btn-primary w-100'>
          <i className='bi bi-person-plus'/> Enregistrer un patient
        </Link>
      </Col>

      <Col className='mb-2'>
        <Form onSubmit={onDeepSearch}>
          <Form.Control
            disabled={searchLoader}
            autoComplete='off'
            name='search'
            value={search}
            onChange={handleSearch} />
        </Form>
      </Col>
    </>
  )
}
