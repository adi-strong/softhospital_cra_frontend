import {memo, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu} from "../navigation/navigationSlice";
import {AppBreadcrumb, AppHeadTitle, AppMainError} from "../../components";
import {LabForm} from "./LabForm";
import {useParams} from "react-router-dom";
import {useGetSingleLabQuery} from "./labApiSlice";
import {selectCurrentUser} from "../auth/authSlice";
import {useGetExamCategoriesQuery} from "../exams/examCategoryApiSlice";

function LabEditResultsPage() {
  const dispatch = useDispatch(), { id } = useParams()
  const {data: lab, isLoading, isFetching, isSuccess, isError, refetch} = useGetSingleLabQuery(id)
  const {data: categories, isFetching: isFetch, isError: isErr, refetch: refresh} =
    useGetExamCategoriesQuery('ExamCategories')

  useEffect(() => {
    dispatch(onInitSidebarMenu('/member/treatments/lab'))
  }, [dispatch]) // toggle submenu dropdown

  let errors
  if (isError) errors = <AppMainError/>
  if (isErr) errors = <AppMainError/>

  const onRefetch = async () => {
    await refresh()
    await refetch()
  }

  const user = useSelector(selectCurrentUser)

  return (
    <>
      <AppHeadTitle title='Laboratoire | Publication de résultats' />
      <AppBreadcrumb title='Laboratoire | Publication de résultats' links={[
        {path: '/member/treatments/lab', label: 'Laboratoire'}
      ]} />

      <LabForm
        user={user}
        loader={isLoading}
        isSuccess={isSuccess}
        isFetching={isFetching}
        data={lab}
        allCategories={categories}
        categoryLoader={isFetch}
        onRefetch={onRefetch}/>
      {errors && errors}
    </>
  )
}

export default memo(LabEditResultsPage)
