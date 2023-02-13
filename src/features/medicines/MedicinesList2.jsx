import {useMemo, useState} from "react";
import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {AppDataTableStripped, AppTHead} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";

const thead = [{label: 'Désignation'}, {label: 'Qté'}, {label: 'P.U.'}]

export const MedicinesList2 = () => {
  const [search, setSearch] = useState({keyword: ''})

  let content, errors
  content = useMemo(() => {
    return <tbody/>
  }, [])

  const onRefresh = async () => {}

  async function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableStripped
            loader={false}
            title={<><i className='bi bi-capsule'/> Produits</>}
            thead={<AppTHead isImg loader={false} isFetching={false} onRefresh={onRefresh} items={thead}/>}
            tbody={content}
            overview={
              <>
                <Col xl={12}>
                  <Form onSubmit={onSubmit}>
                    <InputGroup>
                      <Form.Control
                        placeholder='Votre recherche ici...'
                        className='text-lowercase'
                        name='keyword'
                        value={search.keyword}
                        onChange={(e) => handleChange(e, search, setSearch)} />
                      <Button type='submit' variant='light'>
                        <i className='bi bi-search'/>
                      </Button>
                    </InputGroup>
                  </Form>
                </Col>
              </>
            } />
          {errors && errors}
        </Card.Body>
      </Card>
    </>
  )
}
