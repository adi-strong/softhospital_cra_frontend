import {memo, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {Button, Card, Col, Form, InputGroup, Row, Tab, Tabs} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useNavigate, useParams} from "react-router-dom";
import {useGetSingleCovenantQuery} from "../covenants/covenantApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AppDropdownFilerMenu, AppMainError} from "../../components";
import {entrypoint} from "../../app/store";
import {CovenantSingleInvoicesList} from "./CovenantSingleInvoicesList";
import {handleChange} from "../../services/handleFormsFieldsServices";
import {CovenantInvoiceSearchResult} from "./covenantInvoiceSearchResult";
import {useLazyGetSearchCovenantsInvoiceQuery} from "./covenantInvoiceApiSlice";
import {useReactToPrint} from "react-to-print";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowSingleCovenantPage} from "../../app/config";
import toast from "react-hot-toast";

const tabs = [
  {label: 'Liste de factures', key: 'list'},
  {label: 'Recherche', key: 'search'},
]

const date = new Date()
const year = date.getFullYear()
const month = (date.getMonth() + 1) <= 9 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)

const options = [
  {label: 'Janvier', value: '01'},
  {label: 'Février', value: '02'},
  {label: 'Mars', value: '03'},
  {label: 'Avril', value: '04'},
  {label: 'Mai', value: '05'},
  {label: 'Juin', value: '06'},
  {label: 'Juillet', value: '07'},
  {label: 'Août', value: '08'},
  {label: 'Septembre', value: '09'},
  {label: 'Octobre', value: '10'},
  {label: 'Novembre', value: '11'},
  {label: 'Décembre', value: '12'},
]

const SingleCovenantInvoice = () => {
  const dispatch = useDispatch(), {id} = useParams(), printRef = useRef()

  const {data: covenant, isFetching, isSuccess, isError, refetch} = useGetSingleCovenantQuery(id)

  const [key, setKey] = useState('list')
  const [search, setSearch] = useState({ year, month })
  const [isResult, setIsResult] = useState(false)
  const [getSearchCovenantsInvoice,
    {data: invoice, isFetching: isLoad, isSuccess: isOk, isError: error}] = useLazyGetSearchCovenantsInvoiceQuery()

  function handleMonthChange({target}) {
    let value = options[0]
    for (const key in options) {
      if (target.value === options[key].value)
        value = options[key].value
    }
    setSearch({...search, month: value})
  }

  async function handleSearch(e) {
    e.preventDefault()
    const sData = await getSearchCovenantsInvoice({ year: search.year, month: search.month, covenantId: id })
    if (!sData.error) setIsResult(true)
  }

  const handleReset = () => setIsResult(false)

  const onRefresh = async () => await refetch()

  const handlePrint = useReactToPrint({content: () => printRef.current})

  const onClick = name => {
    if (name === 'print') handlePrint()
    else onRefresh()
  }

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/finance/invoices'))
  }, [dispatch])

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowSingleCovenantPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <div className='section dashboard'>
      <Card className='border-0'>
        <AppDropdownFilerMenu
          onClick={onClick}
          heading='Actions'
          items={[
            {label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh', action: '#'},
            {label: <><i className='bi bi-printer'/> Impression</>, name: 'print', action: '#'},
          ]} />

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-folder2-open'/> Dossiers</h5>

          <div className='text-end'>
            <Tabs activeKey={key} onSelect={(k) => setKey(k)}>
              {tabs && tabs.map((tab, idx) =>
                <Tab key={idx} eventKey={tab.key} title={tab.label} />)}
            </Tabs>
          </div>

          <div className='container-fluid' ref={printRef}>
            <h5 className='card-title mt-3' style={cardTitleStyle}>
              Facture <br/>
              {isSuccess && covenant &&
                <i style={{ fontWeight: 900 }} className='text-uppercase'>{covenant?.denomination}</i>}
            </h5>
            {!(isError || isFetching) && isSuccess && covenant &&
              <>
                <Row>
                  <Col>
                    <address>
                      {covenant?.address && <>{covenant.address} <br/></>}
                      {covenant?.tel && <>{covenant.tel} <br/></>}
                      {covenant?.email && <>{covenant.email} <br/></>}
                    </address>
                  </Col>
                  <Col className='text-end'>
                    {covenant?.logo &&
                      <img
                        src={entrypoint+covenant.logo?.contentUrl}
                        width={120}
                        height={120}
                        alt='' />}
                  </Col>
                </Row>

                {key === 'list' && <CovenantSingleInvoicesList id={id}/>}
                {key === 'search' &&
                  <>
                    <Form onSubmit={handleSearch} className='w-50 m-auto d-flex justify-content-around'>
                      <InputGroup>
                        <InputGroup.Text>Année</InputGroup.Text>
                        <Form.Control
                          className='text-end'
                          name='year'
                          value={search.year}
                          onChange={(e) => handleChange(e, search, setSearch)}
                          disabled={false} />

                        <Form.Select
                          aria-label="Default select example"
                          value={search.month}
                          onChange={handleMonthChange}>
                          {options && options.map((item, idx) =>
                            <option key={idx} value={item.value}>{item.label}</option>)}
                        </Form.Select>
                        <Button type='submit'>
                          <i className='bi bi-search'/>
                        </Button>
                      </InputGroup>
                    </Form>

                    <CovenantInvoiceSearchResult
                      id={id}
                      isResult={isResult}
                      onReset={handleReset}
                      setResult={setIsResult}
                      setKey={setKey}
                      onRefresh={onRefresh}
                      isLoad={isLoad}
                      isOk={isOk}
                      data={invoice}
                      isError={error}/>
                  </>}
              </>}
          </div>
          {isFetching && <BarLoaderSpinner loading={isFetching}/>}
          {isError && <AppMainError/>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(SingleCovenantInvoice)
