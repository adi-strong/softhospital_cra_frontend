import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../../../layouts/AuthLayout";
import {AppDropdownFilerMenu} from "../../../../components";
import {useEffect, useState} from "react";
import {DashSection2Item1} from "./DashSection2Item1";
import BarLoaderSpinner from "../../../../loaders/BarLoaderSpinner";
import {
  useGetStats2ByMonthQuery,
  useLazyGetStats2ByMonth2Query,
  useLazyGetStats2ByYearQuery
} from "../../stats2ApiSlice";
import toast from "react-hot-toast";
import {DashSection2Item2} from "./DashSection2Item2";

const date = new Date()
const year = date.getFullYear()
const month = (date.getMonth() + 1) <= 9 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1

const menus = [
  {label: 'Ce mois', name: 'this-month', action: '#'},
  {label: 'Mois passé', name: 'last-month', action: '#'},
  {label: 'Cette année', name: 'this-year', action: '#'},
]

export const DashSection2 = ( ) => {
  const [key, setKey] = useState('Ce mois')
  const [stats, setStats] = useState([])
  const {data, isLoading, isFetching, isError, isSuccess, refetch} = useGetStats2ByMonthQuery({ year, month })
  if (isError) toast.error('ERREUR: Erreur lors du chargement des stats...')

  const [getStats2ByMonth2, {data: data2, isFetching: isFetch2, isError: isErr}] = useLazyGetStats2ByMonth2Query()
  if (isErr) toast.error('ERREUR: Erreur lors du chargement des stats...')

  const [getStats2ByYear, {data: data3, isFetching: isFetch3, isError: isErr3}] = useLazyGetStats2ByYearQuery()
  if (isErr3) toast.error('ERREUR: Erreur lors du chargement des stats...')

  async function onClick(name) {
    switch (name) {
      case 'this-month':
        await refetch()
        setKey(menus[0].label)
        break
      case 'last-month':
        await getStats2ByMonth2({ year, month: (month - 1) <= 9 ? `0${(month - 1)}` : (month - 1) })
        setKey(menus[1].label)
        break
      case 'this-year':
        await getStats2ByYear({ year })
        setKey(menus[2].label)
        break
      default:
        setKey(menus[0].label)
        break
    }
  } // handle dropdown menu click

  useEffect(() => {
    if (key === 'Ce mois') setStats(data)
    else if (key === 'Mois passé') setStats(data2)
    else if (key === 'Cette année') setStats(data3)
  }, [key, data, data2, data3])

  return (
    <>
      <Card className='border-0'>
        <AppDropdownFilerMenu
          items={menus}
          onClick={onClick} />

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>Rapports <span>| {key}</span></h5>
          <DashSection2Item1 isOk={isSuccess} stats={stats}/>
          {(isLoading || isFetching || isFetch2 || isFetch3) &&
            <BarLoaderSpinner loading={isLoading || isFetching || isFetch2 || isFetch3} />}
        </Card.Body>
      </Card>

      <DashSection2Item2 menus={menus}/>
    </>
  )
}
