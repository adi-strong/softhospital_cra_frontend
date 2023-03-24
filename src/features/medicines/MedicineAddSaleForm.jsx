import {useGetDrugstoreListQuery} from "./drugStoreApiSlice";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {AppMainError, AppTHead} from "../../components";
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

  const onRefresh = async () => await refetch()

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

  useEffect(() => {
    if (isDrOk && drugs) setContents(drugs.filter(w => w?.wording.toLowerCase().includes(search.toLowerCase())))
  }, [isDrOk, drugs, search])
  // handle get drugs data

  return (
    <>
      <h5 className='card-title text-center' style={cardTitleStyle}><i className='bi bi-capsule'/> Médicaments</h5>

      <Form onSubmit={(e) => { e.preventDefault() }} className='mb-3'>
        <Form.Control
          placeholder='Rechercher'
          autoComplete='off'
          name='search'
          value={search}
          onChange={({ target }) => setSearch(target.value)}
          disabled={isDrLoad || loader} />
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

      {isDrLoad && <BarLoaderSpinner loading={isDrLoad}/>}
      {!isDrLoad && isDrError && <AppMainError/>}
    </>
  )
}
