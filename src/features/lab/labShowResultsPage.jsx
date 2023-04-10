import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppDropdownFilerMenu, AppHeadTitle} from "../../components";
import {Card, Col, Row} from "react-bootstrap";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useGetSingleLabQuery} from "./labApiSlice";
import {useNavigate, useParams} from "react-router-dom";
import {SingleLabSection1} from "./SingleLabSection1";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import {SingleLabSection2} from "./SingleLabSection2";
import {SingleLabSection3} from "./SingleLabSection3";
import {SingleLabSection4} from "./SingleLabSection4";
import {selectCurrentUser} from "../auth/authSlice";
import {allowShowSingleLabPage} from "../../app/config";
import toast from "react-hot-toast";

function LabShowResultsPage() {
  const dispatch = useDispatch(), { id } = useParams()

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/lab'))
  }, [dispatch]) // toggle submenu dropdown

  const {data: lab, isFetching, isSuccess, isError, refetch} = useGetSingleLabQuery(id)

  if (isError) alert('ERREUR: Erreur lors du chargement de données ❗')

  const onToggleMenus = async name => await refetch()

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

      <Row>
        <Col md={7}>
          <Card className='border-0'>
            <AppDropdownFilerMenu
              onClick={onToggleMenus}
              items={[{label: <><i className='bi bi-arrow-clockwise'/> Actualiser</>, name: 'refresh', action: '#'}]}
              heading='Actions' />

            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-pencil'/> Résultat(s)</h5>
              {!isFetching && isSuccess && lab && <SingleLabSection1 lab={lab} />}
              {isFetching && <BarLoaderSpinner loading={isFetching}/>}
            </Card.Body>
          </Card>

          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-list-check'/> Commentaire(s)</h5>
              {!isFetching && isSuccess && lab && <SingleLabSection4 lab={lab} />}
              {isFetching && <BarLoaderSpinner loading={isFetching}/>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-virus2'/> Examen(s)</h5>
              {!isFetching && isSuccess && lab && <SingleLabSection2 lab={lab} />}
              {isFetching && <BarLoaderSpinner loading={isFetching}/>}
            </Card.Body>
          </Card>

          <Card className='border-0'>
            <Card.Body>
              <h5 className='card-title' style={cardTitleStyle}><i className='bi bi-person'/> Patient(e)</h5>
              {!isFetching && isSuccess && lab && <SingleLabSection3 lab={lab} />}
              {isFetching && <BarLoaderSpinner loading={isFetching}/>}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default memo(LabShowResultsPage)
