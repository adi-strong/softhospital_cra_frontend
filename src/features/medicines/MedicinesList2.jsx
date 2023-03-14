import {useMemo, useState} from "react";
import {Button, Card, Col, Form, InputGroup} from "react-bootstrap";
import {AppDataTableBorderless, AppMainError, AppTHead} from "../../components";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {useGetDrugstoreListQuery} from "./drugStoreApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {MedicineItem2} from "./MedicineItem2";

const thead = [{label: 'Désignation'}, {label: 'Qté.'}]

export const MedicinesList2 = ({ onPushNewItem, isLoading = false }) => {
  const [search, setSearch] = useState({keyword: ''})
  const {
    data: medicines = [],
    isLoading: isMedicinesLoading,
    isFetching,
    isSuccess,
    isError,
    refetch} = useGetDrugstoreListQuery('DrugstoreList')

  let content, errors
  if (isError) errors = <AppMainError/>
  content = useMemo(() => {
    if (isSuccess && medicines) {
      return (
        <tbody>{medicines.map(medicine =>
          <MedicineItem2
            key={medicine.id}
            medicine={medicine}
            onPushNewItem={onPushNewItem}
            isLoading={isLoading}/>)}</tbody>
      )
    }
  }, [isSuccess, medicines, onPushNewItem, isLoading])

  const onRefresh = async () => await refetch()

  async function onSubmit(e) {
    e.preventDefault()
  }

  return (
    <>
      <Card className='border-0'>
        <Card.Body>
          <AppDataTableBorderless
            title={<><i className='bi bi-capsule'/> Produits</>}
            thead={<AppTHead loader={isMedicinesLoading} isFetching={isFetching} onRefresh={onRefresh} items={thead}/>}
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
                      <Button type='submit' variant='light' disabled={isLoading || isMedicinesLoading || isFetching}>
                        <i className='bi bi-search'/>
                      </Button>
                    </InputGroup>
                  </Form>
                </Col>
              </>
            } />

          {isMedicinesLoading && <BarLoaderSpinner loading={isMedicinesLoading}/>}
          {errors && errors}
        </Card.Body>
      </Card>
    </>
  )
}
