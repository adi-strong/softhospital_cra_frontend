import {Col, Row} from "react-bootstrap";
import {DashSection1Item1} from "./DashSection1Item1";
import {
  useGetFileStatsQuery,
  useGetPatientsStatsQuery,
  useGetRevenueStatsQuery,
  useLazyGetFileStatsByYearQuery,
  useLazyGetLastMonthFileStatsQuery,
  useLazyGetLastMonthPatientsStatsQuery,
  useLazyGetLastMonthRevenueStatsQuery, useLazyGetPatientsStatsByYearQuery,
  useLazyGetRevenueStatsByYearQuery,
  useLazyGetThisMonthFileStatsQuery,
  useLazyGetThisMonthPatientsStatsQuery,
  useLazyGetThisMonthRevenueStatsQuery
} from "../../statsApiSlice";
import toast from "react-hot-toast";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {DashSection1Item2} from "./DashSection1Item2";
import {DashSection1Item3} from "./DashSection1Item3";

export function DashSection1({ menus, currentDate, id }) {
  const [stats1, setStats1] = useState(null)
  const [check, setCheck] = useState({isThisMonth: false, isLasMonth: false, isThisYear: false})
  const {fCurrency} = useSelector(state => state.parameters)
  const {data: files, isFetching, isSuccess, isError, refetch} = useGetFileStatsQuery({
    year: currentDate?.getFullYear(),
    month: (currentDate?.getMonth() + 1) <= 9 ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)})

  const [getThisMonthFileStats, {
    data: files2,
    isFetching: is1stFetch,
    isError: is1stErr}] = useLazyGetThisMonthFileStatsQuery()

  const [getLastMonthFileStats, {
    data: files3,
    isFetching: is1stFetch2,
    isError: is1stErr2}] = useLazyGetLastMonthFileStatsQuery()

  const [getFileStatsByYear, {
    data: files4,
    isFetching: is1stFetch3,
    isError: is1stErr3}] = useLazyGetFileStatsByYearQuery()

  if (isError) toast.error('Erreur lors du chargment des stats...')
  if (is1stErr) toast.error('Erreur lors du chargment des stats...')
  if (is1stErr2) toast.error('Erreur lors du chargment des stats...')
  if (is1stErr3) toast.error('Erreur lors du chargment des stats...')

  async function onFilesRefresh() {
    setCheck({isThisYear: false, isThisMonth: false, isLasMonth: false})
    await refetch()
  }

  async function handleGetLastMonthFilesStats() {
    await getLastMonthFileStats({
      year: currentDate?.getFullYear(),
      month: currentDate?.getMonth() <= 9 ? `0${currentDate.getMonth()}` : currentDate.getMonth()})
    setCheck({isThisYear: false, isThisMonth: false, isLasMonth: true})
  } // get 1st last month stats

  async function handleGetThisMonthFilesStats() {
    await getThisMonthFileStats({
      year: currentDate?.getFullYear(),
      month: (currentDate?.getMonth() + 1) <= 9 ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)})
    setCheck({isThisYear: false, isThisMonth: true, isLasMonth: false})
  } // get 1st this month stats

  async function handleGetFilesByYearStats() {
    await getFileStatsByYear({
      year: currentDate?.getFullYear()})
    setCheck({isThisYear: true, isThisMonth: false, isLasMonth: false})
  } // get 1st this month stats

  // handle get 1sts data stats
  useEffect(() => {
    if (!check.isLasMonth && !check.isThisMonth && !check.isThisYear && isSuccess && files)
      setStats1(files)
    else if (check.isLasMonth && !check.isThisMonth && !check.isThisYear && isSuccess && files)
      setStats1(files3)
    else if (!check.isLasMonth && check.isThisMonth && !check.isThisYear && isSuccess && files)
      setStats1(files2)
    else if (!check.isLasMonth && !check.isThisMonth && check.isThisYear && isSuccess && files)
      setStats1(files4)
  }, [isSuccess, files, check, files2, files3, files4])
  // End handle get 1sts data stats

  /*
   * *******************************************************************************************************
   * *******************************************************************************************************
   */

  const [stats2, setStats2] = useState(null)
  const [check2, setCheck2] = useState({isThisMonth: false, isLasMonth: false, isThisYear: false})
  const {data: revenue, isFetching: isFetch, isSuccess: isOk, isError: isErr, refetch: refetch2} =
    useGetRevenueStatsQuery({
    year: currentDate?.getFullYear(),
    month: (currentDate?.getMonth() + 1) <= 9 ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)})

  const [getThisMonthRevenueStats, {
    data: revenue2,
    isFetching: isFetch2,
    isError: isErr2}] = useLazyGetThisMonthRevenueStatsQuery()

  const [getLastMonthRevenueStats, {
    data: revenue3,
    isFetching: isFetch3,
    isError: isErr3}] = useLazyGetLastMonthRevenueStatsQuery()

  const [getRevenueStatsByYear, {
    data: revenue4,
    isFetching: isFetch4,
    isError: isErr4}] = useLazyGetRevenueStatsByYearQuery()

  if (isErr) toast.error('Erreur lors du chargment des stats...')
  if (isErr2) toast.error('Erreur lors du chargment des stats...')
  if (isErr3) toast.error('Erreur lors du chargment des stats...')
  if (isErr4) toast.error('Erreur lors du chargment des stats...')

  async function onRevenueRefresh() {
    setCheck2({isThisYear: false, isThisMonth: false, isLasMonth: false})
    await refetch2()
  }

  async function handleGetLastMonthRevenueStats() {
    await getLastMonthRevenueStats({
      year: currentDate?.getFullYear(),
      month: currentDate?.getMonth() <= 9 ? `0${currentDate.getMonth()}` : currentDate.getMonth()})
    setCheck2({isThisYear: false, isThisMonth: false, isLasMonth: true})
  } // get 1st last month stats

  async function handleGetThisMonthRevenueStats() {
    await getThisMonthRevenueStats({
      year: currentDate?.getFullYear(),
      month: (currentDate?.getMonth() + 1) <= 9 ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)})
    setCheck2({isThisYear: false, isThisMonth: true, isLasMonth: false})
  } // get 1st this month stats

  async function handleGetRevenueByYearStats() {
    await getRevenueStatsByYear({
      year: currentDate?.getFullYear()})
    setCheck2({isThisYear: true, isThisMonth: false, isLasMonth: false})
  } // get 1st this month stats

  // handle get 1sts data stats
  useEffect(() => {
    if (!check2.isLasMonth && !check2.isThisMonth && !check2.isThisYear && isOk && revenue)
      setStats2(revenue)
    else if (check2.isLasMonth && !check2.isThisMonth && !check2.isThisYear && isOk && revenue)
      setStats2(revenue3)
    else if (!check2.isLasMonth && check2.isThisMonth && !check2.isThisYear && isOk && revenue)
      setStats2(revenue2)
    else if (!check2.isLasMonth && !check2.isThisMonth && check2.isThisYear && isOk && revenue)
      setStats2(revenue4)
  }, [isOk, revenue, check2, revenue2, revenue3, revenue4])
  // End handle get 1sts data stats

  /*
   * *******************************************************************************************************
   * *******************************************************************************************************
   */

  const [stats3, setStats3] = useState(null)
  const [check3, setCheck3] = useState({isThisMonth: false, isLasMonth: false, isThisYear: false})
  const {data: patients, isFetching: isFetch5, isSuccess: isOk2, isError: isErr5, refetch: refetch3} =
    useGetPatientsStatsQuery({
      year: currentDate?.getFullYear(),
      month: (currentDate?.getMonth() + 1) <= 9 ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)})

  const [getThisMonthPatientsStats, {
    data: patients2,
    isFetching: isFetch6,
    isError: isErr6}] = useLazyGetThisMonthPatientsStatsQuery()

  const [getLastMonthPatientsStats, {
    data: patients3,
    isFetching: isFetch7,
    isError: isErr7}] = useLazyGetLastMonthPatientsStatsQuery()

  const [getPatientsStatsByYear, {
    data: patients4,
    isFetching: isFetch8,
    isError: isErr8}] = useLazyGetPatientsStatsByYearQuery()

  if (isErr5) toast.error('Erreur lors du chargment des stats...')
  if (isErr6) toast.error('Erreur lors du chargment des stats...')
  if (isErr7) toast.error('Erreur lors du chargment des stats...')
  if (isErr8) toast.error('Erreur lors du chargment des stats...')

  async function onPatientsRefresh() {
    setCheck3({isThisYear: false, isThisMonth: false, isLasMonth: false})
    await refetch3()
  }

  async function handleGetLastMonthPatientsStats() {
    await getLastMonthPatientsStats({
      year: currentDate?.getFullYear(),
      month: currentDate?.getMonth() <= 9 ? `0${currentDate.getMonth()}` : currentDate.getMonth()})
    setCheck3({isThisYear: false, isThisMonth: false, isLasMonth: true})
  } // get 1st last month stats

  async function handleGetThisMonthPatientsStats() {
    await getThisMonthPatientsStats({
      year: currentDate?.getFullYear(),
      month: (currentDate?.getMonth() + 1) <= 9 ? `0${(currentDate.getMonth() + 1)}` : (currentDate.getMonth() + 1)})
    setCheck3({isThisYear: false, isThisMonth: true, isLasMonth: false})
  } // get 1st this month stats

  async function handleGetPatientsByYearStats() {
    await getPatientsStatsByYear({
      year: currentDate?.getFullYear()})
    setCheck3({isThisYear: true, isThisMonth: false, isLasMonth: false})
  } // get 1st this month stats

  // handle get 1sts data stats
  useEffect(() => {
    if (!check3.isLasMonth && !check3.isThisMonth && !check3.isThisYear && isOk2 && patients)
      setStats3(patients)
    else if (check3.isLasMonth && !check3.isThisMonth && !check3.isThisYear && isOk2 && patients)
      setStats3(patients3)
    else if (!check3.isLasMonth && check3.isThisMonth && !check3.isThisYear && isOk2 && patients)
      setStats3(patients2)
    else if (!check3.isLasMonth && !check3.isThisMonth && check3.isThisYear && isOk2 && patients)
      setStats3(patients4)
  }, [isOk2, patients, check3, patients2, patients3, patients4])
  // End handle get 1sts data stats

  return (
    <>
      <Row>
        <Col xxl={4} md={6}>
          <DashSection1Item1
            menus={menus}
            stats={stats1}
            isFetching={isFetching || is1stFetch || is1stFetch2 || is1stFetch3}
            onGetLasMonthStats={handleGetLastMonthFilesStats}
            onGetThisMonthStats={handleGetThisMonthFilesStats}
            onGetThisYearStats={handleGetFilesByYearStats}
            refetch={onFilesRefresh} />
        </Col>

        <Col xxl={4} md={6}>
          <DashSection1Item2
            currency={fCurrency}
            menus={menus}
            stats={stats2}
            isFetching={isFetch || isFetch2 || isFetch3 || isFetch4}
            onGetLasMonthStats={handleGetLastMonthRevenueStats}
            onGetThisMonthStats={handleGetThisMonthRevenueStats}
            onGetThisYearStats={handleGetRevenueByYearStats}
            refetch={onRevenueRefresh} />
        </Col>

        <Col xxl={4} md={6}>
          <DashSection1Item3
            menus={menus}
            stats={stats3}
            isFetching={isFetch5 || isFetch6 || isFetch7 || isFetch8}
            onGetLasMonthStats={handleGetLastMonthPatientsStats}
            onGetThisMonthStats={handleGetThisMonthPatientsStats}
            onGetThisYearStats={handleGetPatientsByYearStats}
            refetch={onPatientsRefresh} />
        </Col>
      </Row>
    </>
  )
}
