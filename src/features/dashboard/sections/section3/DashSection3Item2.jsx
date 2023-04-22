import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../../../layouts/AuthLayout";
import {useEffect, useState} from "react";
import {AppDropdownFilerMenu} from "../../../../components";
import {
  useGetLastsActivitiesQuery,
  useLazyGetLastsActivitiesByLastMonthQuery,
  useLazyGetLastsActivitiesByMonthQuery, useLazyGetLastsActivitiesByYearQuery
} from "../../stats2ApiSlice"
import toast from "react-hot-toast";
import BarLoaderSpinner from "../../../../loaders/BarLoaderSpinner";
import moment from "moment";

const date = new Date()
const year = date.getFullYear()
const month = (date.getMonth() + 1) <= 9 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)

const Item = ({ stat, idx }) => {
  return (
    <div className='activity-item d-flex'>
      <div className='activite-label'>
        {stat?.createdAt ? (moment(stat.createdAt).fromNow()).substring(0, 12) : '--'}
      </div>
      <i id={`dot-activity-${idx}`} className='bi bi-circle-fill activity-badge activity-badge align-self-start'/>
      <div className='activity-content'>
        <span className='text-capitalize fw-bold'>{stat?.title}</span> <br/>
        {stat?.description && <span>{stat.description}</span>}
      </div>
    </div>
  )
}

export const DashSection3Item2 = ({ menus }) => {
  const [key, setKey] = useState('Ce mois')
  const [stats, setStats] = useState([])

  const {data, isFetching: isFetch, isSuccess: isOk, isError: isErr, refetch} = useGetLastsActivitiesQuery({ year, month })
  const [getLastsActivitiesByMonth, {isFetching: isFetch2, isError: isErr2}] = useLazyGetLastsActivitiesByMonthQuery()
  const [getLastsActivitiesByLastMonth, {isFetching: isFetch3, isError: isErr3}] = useLazyGetLastsActivitiesByLastMonthQuery()
  const [getLastsActivitiesByYear, {isFetching: isFetch4, isError: isErr4}] = useLazyGetLastsActivitiesByYearQuery()

  useEffect(() => {
    if (isOk && data) setStats(data)
  }, [isOk, data])

  async function onClick(name) {
    switch (name) {
      case 'this-month':
        const statsData = await getLastsActivitiesByMonth({ year, month })
        if (!statsData.error) setStats(statsData.data)
        setKey(menus[0].label)
        break
      case 'last-month':
        const statsData2 = await getLastsActivitiesByLastMonth({ year, month: (month - 1) <= 9 ? `0${(month - 1)}` : (month - 1) })
        if (!statsData2.error) setStats(statsData2.data)
        setKey(menus[1].label)
        break
      case 'this-year':
        const statsData3 = await getLastsActivitiesByYear({ year })
        if (!statsData3.error) setStats(statsData3.data)
        setKey(menus[2].label)
        break
      default:
        await refetch()
        setKey(menus[0].label)
        setStats(data)
        break
    }
  }

  if (isErr) toast.error('ERREUR: Erreur lors du chargement des stats...')
  if (isErr2) toast.error('ERREUR: Erreur lors du chargement des stats...')
  if (isErr3) toast.error('ERREUR: Erreur lors du chargement des stats...')
  if (isErr4) toast.error('ERREUR: Erreur lors du chargement des stats...')

  return (
    <>
      <Card className='border-0'>
        <AppDropdownFilerMenu
          items={menus}
          onClick={onClick} />

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>Activités Récentes <span>| {key}</span></h5>
          <div className='activity'>
            {stats.length > 0 && stats.map((stat, idx) => <Item key={idx} stat={stat} idx={idx}/>)}
          </div>
          {(isFetch || isFetch2 || isFetch3 || isFetch4) &&
            <BarLoaderSpinner loading={isFetch || isFetch2 || isFetch3 || isFetch4}/>}
        </Card.Body>
      </Card>
    </>
  )
}
