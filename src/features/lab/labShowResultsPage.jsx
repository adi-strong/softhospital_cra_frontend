import {memo, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppDataTableBordered, AppDropdownFilerMenu, AppHeadTitle, AppTHead} from "../../components";
import {Card} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useGetSingleLabQuery} from "./labApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowSingleLabPage} from "../../app/config";
import toast from "react-hot-toast";
import {LabVoucherBody, LabVoucherHeader} from "./LabVoucher";
import {useGetExamCategoriesQuery} from "../exams/examCategoryApiSlice";
import {useReactToPrint} from "react-to-print";
import parser from "html-react-parser";

function LabShowResultsPage() {
  const dispatch = useDispatch(), { id } = useParams()
  const {data: categories, isFetching: isFetch, isError: isErr, refetch: refresh} =
    useGetExamCategoriesQuery('ExamCategories')

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/lab'))
  }, [dispatch]) // toggle submenu dropdown

  const {data: lab, isFetching, isSuccess, isError, refetch} = useGetSingleLabQuery(id)
  const { hospital } = useSelector(state => state.parameters)

  if (isError) alert('ERREUR: Erreur lors du chargement de données ❗')
  if (isErr) alert('ERREUR: Erreur lors du chargement des examens ❗')

  const printRef = useRef()
  const handlePrint = useReactToPrint({content: () => printRef.current})

  const onToggleMenus = async name => {
    if (name === 'print') handlePrint()
    else {
      await refresh()
      await refetch()
    }
  }

  const user = useSelector(selectCurrentUser), navigate = useNavigate()
  useEffect(() => {
    if (user && !allowShowSingleLabPage(user?.roles[0])) {
      toast.error('Vous ne disposez pas de droits pour voir cette page.')
      navigate('/member/reception', {replace: true})
    }
  }, [user, navigate])

  return (
    <div className='section dashboard'>
      <AppHeadTitle title='Résultats des analyses du Labo' />
      <AppBreadcrumb title='Résultats des analyses du Labo' links={[
        {path: '/member/treatments/lab', label: 'Laboratoire'}
      ]} />

      <Card className='border-0'>
        <AppDropdownFilerMenu
          onClick={onToggleMenus}
          items={[
            {label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh', action: '#'},
            {label: <><i className='bi bi-printer'/> Impression</>, name: 'print', action: '#'},
          ]}
          heading='Actions' />

        <Card.Body>
          <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-pencil'/> Résultats</h5>
          {isFetching && <BarLoaderSpinner loading={isFetching}/>}
          <div className='container-fluid pt-2' ref={printRef}>
            {isFetching && <BarLoaderSpinner loading={isFetch}/>}
            {!isFetching && isSuccess && lab &&
              <>
                <LabVoucherHeader
                  title='BON DE RÉSULTATS DE LABORATOIRE'
                  hospital={hospital}
                  data={lab}
                  prescriber={lab && lab?.userPrescriber ? lab.userPrescriber : null} />

                <AppDataTableBordered
                  id='file-style'
                  thead={
                  <AppTHead
                    className='text-center'
                    items={[ {label: 'EXAMENS'}, {label: 'RÉSULTATS'}, {label: 'VALEURS NORMALES'} ]} />}
                  tbody={
                  <tbody>
                  {lab?.results && lab.results.length > 0 && lab.results.map((r, idx) =>
                    <tr key={idx} className='text-center'>
                      <td>{r?.exam}</td>
                      <td>{r?.result}</td>
                      <td>{r?.normalValue}</td>
                    </tr>)}
                  </tbody>} />

                <div className='mt-2'>
                  <b className='text-decoration-underline'>Conclusion</b> <br/>
                  {lab && lab?.comment && parser(`${lab.comment}`)} <br/>
                  <b>N.B :</b> <br/>
                  Le {lab && lab?.createdAt && lab.createdAt}
                </div>
                <div className='text-md-end fw-bold'>
                  SIGNATURE <br/>
                  Tél : ...................................
                </div>

                <div className='text-center'>
                  <b className='text-uppercase'>
                    {lab && lab?.userPublisher
                      ? lab.userPublisher?.name
                        ? lab.userPublisher.name
                        : lab.userPublisher.username
                      : ''}
                  </b> <br/>
                  <b>Biologiste médical</b> <br/>
                  <b>CNBM : N°............</b>
                </div>
              </>}
          </div>
        </Card.Body>
      </Card>

      <Card className='border-0'>
        <Card.Body>
          {!isFetching && isSuccess && lab &&
            <>
              <LabVoucherHeader
                hospital={hospital}
                data={lab}
                prescriber={lab && lab?.userPrescriber ? lab.userPrescriber : null} />
              <LabVoucherBody
                data={lab}
                hospital={hospital}
                categories={categories}
                pExams={lab && lab?.labResults ? lab.labResults : null} />
            </>}
        </Card.Body>
      </Card>
    </div>
  )
}

export default memo(LabShowResultsPage)
