import {Badge, Card} from "react-bootstrap";
import {cardTitleStyle} from "../../../../layouts/AuthLayout";
import {useGetMostSalesDrugsQuery} from "../../stats2ApiSlice";
import toast from "react-hot-toast";
import {AppDataTableBorderless/*, AppDropdownFilerMenu*/, AppTHead} from "../../../../components";
import {useEffect, useState} from "react";
import {limitStrTo} from "../../../../services";
import {useSelector} from "react-redux";

const date = new Date()
const year = date.getFullYear()
const month = (date.getMonth() + 1) <= 9 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)

const thead = [
  {label: '#'},
  {label: 'Désignation'},
  {label: 'Vente(s)'},
  {label: 'Bénéfice'},
]

const Item = ({ drug, index, currency }) => {
  return (
    <>
      <tr>
        <th style={{ borderBottom: '1px dashed black' }}>#{(index + 1)}</th>
        <td className='text-primary fw-bold text-capitalize' style={{ borderBottom: '1px dashed black' }}>
          <i className='bi bi-capsule me-1'/>
          [{drug?.id}]{' '}
          {limitStrTo(30, drug?.wording)}
        </td>
        <td style={{ borderBottom: '1px dashed black' }} className='fw-bold'>
          <Badge bg='danger'>
            {parseInt(drug?.sales).toLocaleString()}
          </Badge>
        </td>
        <td style={{ borderBottom: '1px dashed black' }} colSpan={2}>
          <Badge bg='primary'>
            {currency && currency?.value}
            {parseFloat(drug?.gain).toFixed(2).toLocaleString()}
          </Badge>
        </td>
      </tr>
    </>
  )
}

export const DashSection2Item2 = ({ menus }) => {
  const {fCurrency} = useSelector(state => state.parameters)
  const {data, isFetching, isSuccess, isError} = useGetMostSalesDrugsQuery({ year, month })
  if (isError) toast.error('ERREUR: Erreur lors du chargement des stats...')

  //const [key, setKey] = useState('Ce mois')
  const [stats, setStats] = useState([])

  /*async function onClick( name ) {
    switch (name) {
      case 'this-month':
        setKey(menus[0].label)
        break
      case 'last-month':
        setKey(menus[1].label)
        break
      case 'this-year':
        setKey(menus[2].label)
        break
      default:
        setKey(menus[0].label)
        break
    }
  }*/

  useEffect(() => {
    if (/*key === 'Ce mois' && */isSuccess) setStats(data)
  }, [/*key, */isSuccess, data])

  return (
    <Card className='border-0'>
      {/*<AppDropdownFilerMenu
        items={menus}
        onClick={onClick}/>*/}

      <Card.Body>
        <h5 className='card-title' style={cardTitleStyle}>
          Liste des 10 médicaments les plus vendus {/*<span>| {key}</span>*/}
        </h5>
        <AppDataTableBorderless
          loader={isFetching}
          thead={<AppTHead items={thead} className='bg-light' />}
          tbody={
            <tbody>
              {!isError && isSuccess && stats.length > 0 &&
                stats.map((m, i) => <Item key={m?.id} index={i} drug={m} currency={fCurrency} />)}
            </tbody>
          } />
      </Card.Body>
    </Card>
  )
}
