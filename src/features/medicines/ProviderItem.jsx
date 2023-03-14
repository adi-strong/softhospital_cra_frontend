import {Button, ButtonGroup} from "react-bootstrap";
import {usernameFiltered} from "../../components/AppNavbar";
import {useState} from "react";
import {useDeleteProviderMutation} from "./providerApiSlice";
import {AppDelModal} from "../../components";
import toast from "react-hot-toast";
import {AddProviderModal} from "./AddProviderModal";

export const ProviderItem = ({provider}) => {
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [deleteProvider, {isLoading}] = useDeleteProviderMutation()

  const toggleEditModal = () => setShowEdit(!showEdit)
  const toggleDeleteModal = () => setShowDelete(!showDelete)

  const onDelete = async () => {
    toggleDeleteModal()
    try {
      const data = await deleteProvider(provider)
      if (!data.error) toast.success('Suppression bien efféctuée.', {icon: '😶'})
    }
    catch (e) { toast.error(e.message) }
  }

  return (
    <>
      <tr>
        <th scope='row'>#{provider?.id}</th>
        <td className='fw-bold text-uppercase'>{provider?.wording}</td>
        <td className='text-capitalize'>{provider?.focal}</td>
        <td className='text-primary'>{provider?.tel}</td>
        <td className='fst-italic text-lowercase'>{provider?.email ? provider.email : '❓'}</td>
        <td className='text-capitalize'>
          {provider?.user
            ? provider.user?.name
              ? usernameFiltered(provider.user.name)
              : provider.user.username
            : '❓'}
        </td>
        <td>{provider?.createdAt ? provider.createdAt : '❓'}</td>
        <td className='text-end'>
          <ButtonGroup size='sm'>
            <Button type='button' variant='light' onClick={toggleEditModal} disabled={isLoading}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
            <Button type='button' variant='danger' onClick={toggleDeleteModal} disabled={isLoading}>
              <i className='bi bi-trash3'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <AddProviderModal show={showEdit} onHide={toggleEditModal} data={provider} />
      <AppDelModal
        onHide={toggleDeleteModal}
        show={showDelete}
        onDelete={onDelete}
        text={
          <p>
            Êtes-vous certain(e) de vouloir supprimer le fournisseur <br/>
            <i className='bi bi-quote me-1'/>
            <span className='fw-bold text-uppercase'>{provider?.wording}</span>
            <i className='bi bi-quote mx-1'/>
          </p>
        } />
    </>
  )
}
