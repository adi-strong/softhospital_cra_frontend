import {useState} from "react";
import {useGetExpenseCategoriesQuery} from "./expenseCategoryApiSlice";
import {ExpenseCategoriesItem} from "./ExpenseCategoriesItem";
import {AppDataTableStripped, AppMainError, AppTHead} from "../../components";
import {AddExpenseCategories} from "./AddExpenseCategories";
import {Button} from "react-bootstrap";
import BarLoaderSpinner from "../../loaders/BarLoaderSpinner";
import toast from "react-hot-toast";

export function ExpenseCategoriesList() {
  const [show, setShow] = useState(false)
  const {data: categories = [], isLoading, isFetching, isSuccess, isError, refetch} =
    useGetExpenseCategoriesQuery('ExpenseCategories')

  const onDelete = async (category, func, onHide) => {
    onHide()
    try {
      const formData = await func(category)
      if (!formData) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  let content, errors
  if (isSuccess) content = !isLoading && categories && categories.ids.map(id =>
    <ExpenseCategoriesItem key={id} id={id} onDelete={onDelete}/>)
  else if (isError) errors = <AppMainError/>

  const toggleModal = () => setShow(!show)

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppDataTableStripped
        overview={
          <div>
            <Button type='button' onClick={toggleModal}>
              <i className='bi bi-bookmark-plus'/> Ajouter une catégorie
            </Button>
          </div>
        }
        title='Catégories des dépenses'
        tbody={<tbody>{content}</tbody>}
        thead={<AppTHead isImg loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
          {label: 'Catégorie'} ]}/>} />

      {isLoading && <BarLoaderSpinner loading={isLoading}/>}

      {errors && errors}

      <AddExpenseCategories show={show} setShow={setShow} onHide={toggleModal} />
    </>
  )
}
