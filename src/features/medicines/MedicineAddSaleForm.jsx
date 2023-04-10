import {
  drugstorePages, researchDrugstorePages,
  useGetDrugstoreListQuery,
  useLazyGetDrugstoreByPaginationQuery, useLazyGetResearchDrugstoreByPaginationQuery,
  useLazyGetResearchDrugstoreQuery
} from "./drugStoreApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {AppMainError, AppPaginationComponent, AppTHead} from "../../components";
import {useEffect, useState} from "react";
import {Form, Table} from "react-bootstrap";
import {limitStrTo} from "../../services";

const theadItems = [ {label: 'Désignation'}, {label: 'QTÉ'}, {label: 'PU'} ]

const Item = ({ drug, currency, onAddItem }) => {
  return (
    <>
      <tr>
        <th className='text-capitalize' title={drug?.wording}>{limitStrTo(20, drug?.wording)}</th>
        <td className='text-primary text-center'>{drug?.quantity.toLocaleString()}</td>
        <td className='text-primary fw-bold text-end'>
          {parseFloat(drug?.price).toFixed(2).toLocaleString()} {currency && currency?.value}
        </td>
        <td className='text-end' style={{ cursor: 'pointer' }} onClick={() => onAddItem(drug)}>
          <i className='bi bi-plus-circle text-primary'/>
        </td>
      </tr>
    </>
  )
}

export function MedicineAddSaleForm({ items, setItems, currency, loader = false }) {
  const {
    data: drugs = [],
    isFetching: isDrLoad,
    isSuccess: isDrOk,
    isError: isDrError,
    refetch} = useGetDrugstoreListQuery('DrugstoreList')

  const [search, setSearch] = useState('')
  const [contents, setContents] = useState([])
  const [tempSearch, setTempSearch] = useState('')
  const [page, setPage] = useState(1)
  const [checkItems, setCheckItems] = useState({isSearching: false, isPaginated: false,})

  function onAddItem( element ) {
    const values = [...items]
    if (values.length > 0 && values.find(item => item?.wording === element?.wording))
      alert('😊 ce produit a déjà été ajouté ❗')
    else if (element?.quantity < 1) alert("🤕 ce produit n'est plus en stock, veuillez l'approvisionner ❗")
    else if (element?.daysRemainder < 1) alert("😱 ce produit est périmé ❗")
    else {
      values.unshift({...element, qty: 1})
      setItems(values)
    }
  }

  const [paginatedItems, setPaginatedItems] = useState([])
  const [researchPaginatedItems, setResearchPaginatedItems] = useState([])

  const [getDrugstoreByPagination, {isFetching: isFetching2, isError: isError2,}] = useLazyGetDrugstoreByPaginationQuery()
  const [getResearchDrugstore, {isFetching: isFetching3, isError: isError3,}] = useLazyGetResearchDrugstoreQuery()
  const [getResearchDrugstoreByPagination, {
    isFetching: isFetching4,
    isError: isError4,
  }] = useLazyGetResearchDrugstoreByPaginationQuery()

  async function handlePagination(pagination) {
    const param = pagination + 1
    setPage(param)
    setCheckItems({isSearching: false, isPaginated: true})
    const { data: searchData, isSuccess } = await getDrugstoreByPagination(param)
    if (isSuccess && searchData) {
      setPaginatedItems(searchData)
    }
  } // handle main pagination

  async function handlePagination2(pagination) {
    const param = pagination + 1
    const keywords = {page: param, keyword: tempSearch}
    setPage(param)
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchDrugstoreByPagination(keywords)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // 2nd handle main pagination

  async function handleSubmit(e) {
    e.preventDefault()
    setPage(1)
    setTempSearch(search)
    setSearch('')
    setCheckItems({isSearching: true, isPaginated: false})
    const { data: searchData, isSuccess } = await getResearchDrugstore(search)
    if (isSuccess && searchData) {
      setResearchPaginatedItems(searchData)
    }
  } // submit search keywords

  const onRefresh = async () => {
    setCheckItems({isSearching: false, isPaginated: false})
    setSearch('')
    setTempSearch('')
    setPage(1)
    await refetch()
  }

  useEffect(() => {
    if (isDrOk && drugs && !checkItems.isPaginated && !checkItems.isSearching)
      setContents(drugs.filter(w => w?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (isDrOk && drugs && checkItems.isPaginated && !checkItems.isSearching)
      setContents(paginatedItems.filter(w => w?.wording.toLowerCase().includes(search.toLowerCase())))
    else if (isDrOk && drugs && !checkItems.isPaginated && checkItems.isSearching)
      setContents(researchPaginatedItems.filter(w => w?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [isDrOk, drugs, search, checkItems, paginatedItems, researchPaginatedItems])
  // handle get drugs data

  return (
    <>
      <h5 className='card-title text-center' style={cardTitleStyle}><i className='bi bi-capsule'/> Médicaments</h5>

      <Form onSubmit={handleSubmit} className='mb-3'>
        <Form.Control
          placeholder='Rechercher'
          autoComplete='off'
          name='search'
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          disabled={isDrLoad || loader || isFetching3} />
      </Form>

      <Table striped bordered hover style={{ fontSize: '0.7rem' }}>
        <AppTHead onRefresh={onRefresh} items={theadItems} isFetching={isDrLoad} className='text-center'/>
        <tbody>
          {!isDrLoad && contents.length > 0 && contents.map((item, idx) =>
            <Item
              key={idx}
              drug={item}
              onAddItem={onAddItem}
              currency={currency}/>)}
        </tbody>
      </Table>

      {isDrLoad || isFetching2 || isFetching3 || isFetching4
        ? <BarLoaderSpinner loading={isDrLoad || isFetching2 || isFetching3 || isFetching4}/>
        : (
          <>
            {drugstorePages > 1 && isDrOk && drugs
              && !checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination}
                currentPage={page - 1}
                pageCount={drugstorePages} />}

            {researchDrugstorePages > 1 && isDrOk && drugs && checkItems.isSearching &&
              <AppPaginationComponent
                nextLabel=''
                previousLabel=''
                onPaginate={handlePagination2}
                currentPage={page - 1}
                pageCount={researchDrugstorePages} />}
          </>
        )}

      {isDrError && <div className='mb-3'><AppMainError/></div>}
      {isError2 && <div className='mb-3'><AppMainError/></div>}
      {isError3 && <div className='mb-3'><AppMainError/></div>}
      {isError4 && <div className='mb-3'><AppMainError/></div>}
    </>
  )
}
