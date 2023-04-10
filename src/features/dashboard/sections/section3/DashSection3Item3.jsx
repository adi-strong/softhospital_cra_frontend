import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../../../layouts/AuthLayout";
import {useEffect, useState} from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {AppDropdownFilerMenu} from "../../../../components";
import {useGetBoxStatsQuery, useLazyGetBoxByMonthQuery, useLazyGetBoxByYearQuery} from "../../stats2ApiSlice";
import toast from "react-hot-toast";
import {PuffLoader} from "react-spinners";
import {useGetBoxQuery} from "../../../finance/boxApiSlice";
import {useSelector} from "react-redux";
import {roundANumber} from "../../../invoices/singleInvoice";

ChartJS.register(ArcElement, Tooltip, Legend);

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#566ef5",
};

const date = new Date()
const year = date.getFullYear()
const month = (date.getMonth() + 1) <= 9 ? `0${(date.getMonth() + 1)}` : (date.getMonth() + 1)

export const InBox = ({ fCurrency, boxData, sCurrency }) => {
  return (
    <>
      <Card className='border-0 info-card revenue-card'>
        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}>Caisse</h5>
          <div className="d-flex align-items-center">
            <div className="card-icon rounded-circle d-flex align-items-center justify-content-center">
              <span>{fCurrency && fCurrency?.value}</span>
            </div>
            <div className="ps-3">
              <h6>
                {fCurrency && fCurrency?.value+' '}
                {parseFloat(boxData.inBox).toFixed(2).toLocaleString()}
              </h6>
              {sCurrency &&
                <span className='text-muted small pt-2 ps-1 fw-bold'>
                  {parseFloat(boxData.rate).toFixed(2).toLocaleString()+' '}
                  {sCurrency?.value}
                </span>}
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  )
}

export const DashSection3Item3 = ({ menus }) => {
  const [key, setKey] = useState('Ce mois')
  const [stats, setStats] = useState({
    labels: ['Dépenses', 'Entrées', 'Caisse'],
    datasets: [
      {
        label: '# stats',
        data: [0, 0, 0],
        backgroundColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(75, 192, 192)',
        ],
        borderColor: [
          'rgba(255, 99, 132)',
          'rgba(54, 162, 235)',
          'rgba(75, 192, 192)',
        ],
        borderWidth: 1,
      },
    ],
  })

  const {fCurrency, sCurrency, rate, fOperation} = useSelector(state => state.parameters)
  const {data, isFetching: isFetch, isError: isErr} = useGetBoxStatsQuery({ year, month })
  const [getBoxByMonth, {isFetching: isFetch2, isError: isErr2}] = useLazyGetBoxByMonthQuery()
  const [getBoxByYear, {isFetching: isFetch3, isError: isErr3}] = useLazyGetBoxByYearQuery()

  const {data: box, isSuccess, isLoading, isFetching: isFetch4, isError: isErr4} = useGetBoxQuery()

  useEffect(() => {
    if (!isFetch && data) {
      const statData = [data?.outputs, data?.inputs, data?.difference]
      setStats(prev => {
        return {
          ...prev,
          datasets: [{
            label: prev.datasets[0].label,
            data: statData,
            backgroundColor: prev.datasets[0].backgroundColor,
            borderColor: prev.datasets[0].borderColor,
            borderWidth: prev.datasets[0].borderWidth,
          }]
        }
      })
    }
  }, [isFetch, data])

  const [boxData, setBoxData] = useState({sum: 0, outputSum: 0, inBox: 0, rate: 0})

  useEffect(() => {
    if (isSuccess && box) {
      const id = box.ids[0]
      const item = box?.entities[id]

      let sCurrency_handler = 0
      if (fOperation) {
        switch (fOperation) {
          case '*':
            sCurrency_handler = parseFloat(item?.sum - item?.outputSum) * rate
            break
          case '/':
            sCurrency_handler = parseFloat(item?.sum - item?.outputSum) / rate
            break
          default:
            sCurrency_handler = 0
            break
        }
      }

      setBoxData(prev => {
        return {
          ...prev,
          sum: parseFloat(item?.sum),
          outputSum: parseFloat(item?.outputSum),
          inBox: roundANumber((item?.sum - item?.outputSum), 2),
          rate: roundANumber(sCurrency_handler, 2)
        }
      })
    }
  }, [isSuccess, box, fOperation, rate])

  async function onClick(name) {
    switch (name) {
      case 'this-month':
        const statsQuery = await getBoxByMonth({ year, month })
        if (!statsQuery.error) {
          const statsData = [statsQuery.data?.outputs, statsQuery.data?.inputs, statsQuery.data?.difference]
          setStats(prev => {
            return {
              ...prev,
              datasets: [{
                label: prev.datasets[0].label,
                data: statsData,
                backgroundColor: prev.datasets[0].backgroundColor,
                borderColor: prev.datasets[0].borderColor,
                borderWidth: prev.datasets[0].borderWidth,
              }]
            }
          })
        }
        setKey(menus[0].label)
        break
      case 'last-month':
        const statsQuery2 = await getBoxByMonth({ year, month: (month - 1) <= 9 ? `0${(month - 1)}` : (month - 1) })
        if (!statsQuery2.error) {
          const statsData = [statsQuery2.data?.outputs, statsQuery2.data?.inputs, statsQuery2.data?.difference]
          setStats(prev => {
            return {
              ...prev,
              datasets: [{
                label: prev.datasets[0].label,
                data: statsData,
                backgroundColor: prev.datasets[0].backgroundColor,
                borderColor: prev.datasets[0].borderColor,
                borderWidth: prev.datasets[0].borderWidth,
              }]
            }
          })
        }
        setKey(menus[1].label)
        break
      case 'this-year':
        const statsQuery3 = await getBoxByYear({ year })
        if (!statsQuery3.error) {
          const statsData = [statsQuery3.data?.outputs, statsQuery3.data?.inputs, statsQuery3.data?.difference]
          setStats(prev => {
            return {
              ...prev,
              datasets: [{
                label: prev.datasets[0].label,
                data: statsData,
                backgroundColor: prev.datasets[0].backgroundColor,
                borderColor: prev.datasets[0].borderColor,
                borderWidth: prev.datasets[0].borderWidth,
              }]
            }
          })
        }
        setKey(menus[2].label)
        break
      default:
        setKey(menus[0].label)
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
          <h5 className='card-title' style={cardTitleStyle}>Finances <span>| {key}</span></h5>
          {!(isFetch || isFetch2 || isFetch3 || isFetch4 || isLoading) && <Pie data={stats}/>}
          {(isFetch || isFetch2 || isFetch3 || isFetch4 || isLoading) &&
            <div className='text-center'>
              <PuffLoader
                size={200}
                color='#475fd2'
                cssOverride={override}
                loading={isFetch || isFetch2 || isFetch3 || isFetch4 || isLoading}/>
            </div>}
        </Card.Body>
      </Card>

      <InBox boxData={boxData} fCurrency={fCurrency} sCurrency={sCurrency} />
    </>
  )
}
