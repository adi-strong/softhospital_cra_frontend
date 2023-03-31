import {useEffect, useState} from "react";
import {useDispatch} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle, AppMainError} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {useGetSingleCovenantQuery} from "./covenantApiSlice";
import {CovenantOverview} from "./CovenantOverview";
import {SingleContract} from "./SingleContract";
import {CovenantPatientsList} from "./CovenantPatientsList";
import {useGetCovenantPatientsQuery} from "../patients/patientApiSlice";

const SingleCovenant = () => {
  const dispatch = useDispatch(), {id} = useParams()
  const {data: covenant, isLoading, isError, isSuccess, refetch} = useGetSingleCovenantQuery(id)
  const {
    data: patients = [],
    isLoading: isPLoading,
    isFetching,
    isError: isPError,
    refetch: pRefetch,
    isSuccess: isPSuccess,
  } = useGetCovenantPatientsQuery(id)

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/patients'))
  }, [dispatch])

  let errors
  if (isError) errors = <AppMainError/>

  const [search, setSearch] = useState('')
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkPatients, setCheckPatients] = useState({isSearching: false, isPaginated: false,})

  async function onRefresh() {
    setCheckPatients({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await pRefetch()
    await refetch()
  } // refresh patients data

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Organisme' />
      <AppBreadcrumb title={covenant ? covenant?.denomination.toUpperCase() : '--'} links={[
        {label: 'Patients', path: '/patients'},
        {label: 'Conventions', path: '/patients/covenants'},
      ]} />
      <div className="top-selling">
        <Row>
          <Col md={8}>
            <Card className='border-0'>
              <Card.Body>
                <CovenantPatientsList
                  id={id}
                  checkPatients={checkPatients}
                  setCheckPatients={setCheckPatients}
                  search={search}
                  setSearch={setSearch}
                  tempSearch={tempSearch}
                  page={page}
                  setPage={setPage}
                  setTempSearch={setTempSearch}
                  patients={patients}
                  isLoading={isPLoading}
                  isFetching={isFetching}
                  isError={isPError}
                  isSuccess={isPSuccess}
                  onRefresh={onRefresh} />
              </Card.Body>
            </Card>
          </Col> {/* list of patients */}

          <Col md={4}>
            <CovenantOverview
              covenant={covenant}
              isLoading={isLoading}
              isSuccess={isSuccess}
              errors={errors}/> {/* Logo */}

            <SingleContract covenant={covenant} isSuccess={isSuccess} isLoading={isLoading}/> {/* contract */}
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default SingleCovenant
