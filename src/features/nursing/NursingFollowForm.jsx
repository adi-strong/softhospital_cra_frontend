import {Button, Form, Spinner} from "react-bootstrap";
import {useUpdateNursingMutation} from "./nursingApiSlice";
import {AppRichText} from "../../components";
import toast from "react-hot-toast";

export const NursingFollowForm = ({onLoad, onRefresh, data, setLoader, handleComment, handleBlur, comment, loader = false }) => {
  const [updateNursing, {isLoading}] = useUpdateNursingMutation()

  async function onSubmit(e) {
    e.preventDefault()
    try {
      const submit = await updateNursing({comment, id: data?.id})
      if (!submit.error) {
        setLoader(false)
        toast.success('Opération bien efféctuée.')
        onRefresh()
      }
    } catch (e) { setLoader(false) }
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <div className='mb-3 mx-3 me-3'>
          <AppRichText
            onChange={handleComment}
            onBlur={handleBlur}
            value={comment}
            disabled={loader || onLoad} />
        </div>

        <div className='text-end me-3'>
          <Button type='submit' disabled={isLoading}>
            <i className='bi bi-check me-1'/>
            {!isLoading ? 'Valider' : <>Veuillez patienter <Spinner animation='border' size='sm'/></>}
          </Button>
        </div>
      </Form>
    </>
  )
}
