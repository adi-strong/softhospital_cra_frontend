import {useState} from "react";
import {
  AppBreadcrumb,
  AppDataTableBorderless,
  AppHeadTitle,
  AppMainError,
  AppTHead
} from "../../components";
import {Button, Card} from "react-bootstrap";
import {useGetInputsQuery} from "./inputApiSlice";
import {usernameFiltered} from "../../components/AppNavbar";
import {useSelector} from "react-redux";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {useGetBoxQuery} from "./boxApiSlice";
import Box from "./Box";
import {AddInput} from "./AddInput";
import {limitStrTo} from "../../services";

// docRef: '', porter: '', reason: '', amount: 1
const InputItem = ({id, currency}) => {
  const { input } = useGetInputsQuery('Input', {
    selectFromResult: ({ data }) => ({ input: data.entities[id] })
  })

  return (
    <>
      <tr>
        <th scope='row'>#{input?.docRef ? input.docRef : '❓'}</th>
        <td className='text-uppercase' title={input?.porter ? input.porter : ''}>
          {input?.porter ? limitStrTo(18, input.porter) : '❓'}</td>
        <td className='text-capitalize' title={input?.reason ? input.reason : ''}>
          {input?.reason ? limitStrTo(18, input.reason) : '❓'}</td>
        <td className='fw-bolder'>{input?.amount
          ? <>{currency && <span className='text-secondary me-1'>{currency.value}</span>}
            {parseFloat(input.amount).toFixed(2).toLocaleString()}</>
          : '❓'}</td>
        <td className='text-capitalize'>
          {input?.user
            ? input.user?.name
              ? usernameFiltered(input.user.name)
              : input.user.username
            : '❓'}
        </td>
        <td colSpan={2}>{input?.createdAt ? input.createdAt : '❓'}</td>
      </tr>
    </>
  )
}

function Entries() {
  const [show, setShow] = useState(false)
  const {data: inputs = [], isLoading, isSuccess, isFetching, isError, refetch} = useGetInputsQuery('Input')
  const {data: boxes = [], isSuccess: isDone} = useGetBoxQuery('Box')
  const { fCurrency } = useSelector(state => state.parameters)

  let content, errors, boxId
  if (isSuccess) content = inputs && inputs.ids.map(id => <InputItem key={id} id={id} currency={fCurrency}/>)
  else if (isError) errors = <AppMainError/>

  if (isDone) boxId = boxes && boxes.entities[boxes.ids[0]]['@id']

  const toggleModal = () => setShow(!show)

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppHeadTitle title='Finances : Entrées' />
      <AppBreadcrumb title='Entrées' />
      <Card className='border-0'>
        <Card.Body>
          <h5 className='card-title mb-3' style={cardTitleStyle}>Liste des entrées</h5>
          <Box/>
          <AppDataTableBorderless
            overview={
              <>
                <div>
                  <Button type='button' onClick={toggleModal}><i className='bi bi-node-plus'/> Nouvelle entrée</Button>
                </div>
              </>
            }
            loader={isLoading}
            thead={<AppTHead loader={isLoading} isFetching={isFetching} onRefresh={onRefresh} items={[
              {label: '#'},
              {label: 'Porteur'},
              {label: 'Motif'},
              {label: 'Montant'},
              {label: <><i className='bi bi-person'/></>},
              {label: 'Date'},
            ]} />}
            tbody={<tbody>{content}</tbody>} />
          {errors && errors}
        </Card.Body>
      </Card>

      <AddInput show={show} boxId={boxId} onHide={toggleModal} />
    </>
  )
}

export default Entries
