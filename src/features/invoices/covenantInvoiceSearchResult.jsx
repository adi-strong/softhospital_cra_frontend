import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {AppMainError} from "../../components";
import {Button} from "react-bootstrap";
import {useMemo, useState} from "react";
import {AddCovenantInvoiceModal} from "./AddCovenantInvoiceModal";

export const CovenantInvoiceSearchResult = ({ data, isResult, onReset, id, isOk, setKey, isLoad, isError, onRefresh }) => {
  let currency
  currency = useMemo(() => {
    if (data && data?.currency) return data.currency
    return null
  }, [data])

  function handleGetMoment(month) {
    let value

    switch (month) {
      case '02':
        value = 'Février'
        break
      case '03':
        value = 'Mars'
        break
      case '04':
        value = 'Avril'
        break
      case '05':
        value = 'Mai'
        break
      case '06':
        value = 'Juin'
        break
      case '07':
        value = 'Juillet'
        break
      case '08':
        value = 'Août'
        break
      case '09':
        value = 'Septembre'
        break
      case '10':
        value = 'Octobre'
        break
      case '11':
        value = 'Novembre'
        break
      case '12':
        value = 'Décembre'
        break
      default:
        value = 'Janvier'
        break
    }

    return value
  }

  const [show, setShow] = useState(false)

  const onShow = () => setShow(!show)

  return (
    <>
      {!isError && isOk && data && isResult &&
        <div className='mt-3'>
          <h6 className='fw-bold'>Résultat :</h6> <hr/>
          <p>
            <i className='me-2 bi bi-x' style={{ cursor: 'pointer' }} onClick={onReset}/>
            Le <b>SOUS TOTAL</b> de toutes les factures pour l'année{' '}
            <b>{data?.year}</b> du mois de <b>{handleGetMoment(data?.month)}</b>
            {' '}s'élève à{' '}
            <span style={{ fontWeight: 900 }}>
              {parseFloat(data?.subTotal).toFixed(2).toLocaleString() + ' '}
              {currency}
            </span>
          </p>
          {!data?.isInvoiceExists && data?.subTotal > 0 &&
            <Button type='button' onClick={onShow}>
              <i className='bi bi-plus'/> Créer la facture
            </Button>}
        </div>}

      {isLoad && <div className='mt-3'><BarLoaderSpinner loading={isLoad}/></div>}
      {isError && <div className='mt-3'><AppMainError/></div>}

      <AddCovenantInvoiceModal show={show} id={id} onHide={onShow} data={data} onRefresh={onRefresh} setKey={setKey}/>
    </>
  )
}
