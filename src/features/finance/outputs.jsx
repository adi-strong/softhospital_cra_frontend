import {useState} from "react";
import {
  AppBreadcrumb,
  AppDataTableBorderless,
  AppHeadTitle,
  AppMainError,
  AppTHead
} from "../../components";
import {Badge, Button, Card} from "react-bootstrap";
import {useGetOutputsQuery} from "./outputApiSlice";
import {limitStrTo} from "../../services";
import {usernameFiltered} from "../../components/AppNavbar";
import {useGetBoxQuery} from "./boxApiSlice";
import {useSelector} from "react-redux";
import {AddOutput} from "./AddOutput";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import Box from "./Box";

const OutputItem = ({id, currency}) => {
  const { output } = useGetOutputsQuery('Output', {
    selectFromResult: ({ data }) => ({ output: data.entities[id] })
  })

  return (
    <>
      <tr>
        <th scope='row'>#{output?.docRef ? output.docRef : '❓'}</th>
        <td className='text-uppercase' title={output?.recipient ? output.recipient : ''}>
          {output?.recipient ? limitStrTo(18, output.recipient) : '❓'}</td>
        <td className='text-capitalize' title={output?.reason ? output.reason : ''}>
          {output?.reason ? limitStrTo(18, output.reason) : '❓'}</td>
        <td className='fw-bolder'>{output?.amount
          ? <>{currency && <span className='text-secondary me-1'>{currency.value}</span>}
            {parseFloat(output.amount).toFixed(2).toLocaleString()}</>
          : '❓'}</td>
        <td className='text-uppercase'>
          {output?.category ? <Badge>{output.category.name}</Badge> : '❓'}
        </td>
        <td className='text-capitalize'>
          {output?.user
            ? output.user?.name
              ? usernameFiltered(output.user.name)
              : output.user.username
            : '❓'}
        </td>
        <td colSpan={2}>{output?.createdAt ? output.createdAt : '❓'}</td>
      </tr>
    </>
  )
}

function Outputs() {
  const [show, setShow] = useState(false)
  const {data: outputs = [], isLoading, isSuccess, isFetching, isError, refetch} = useGetOutputsQuery('Output')
  const {data: boxes = [], isSuccess: isDone} = useGetBoxQuery('Box')
  const { fCurrency } = useSelector(state => state.parameters)

  let content, errors, boxId
  if (isSuccess) content = outputs && outputs.ids.map(id => <OutputItem key={id} id={id} currency={fCurrency}/>)
  else if (isError) errors = <AppMainError/>

  if (isDone) boxId = boxes && boxes.entities[boxes.ids[0]]['@id']

  const toggleModal = () => setShow(!show)

  const onRefresh = async () => await refetch()

  return (
    <>
      <AppHeadTitle title='Finances : Sorties' />
      <AppBreadcrumb title='Sorties' />
      <Card className='border-0'>
        <Card.Body>
          <h5 className='card-title mb-3' style={cardTitleStyle}>Liste de sorties</h5>
          <Box/>
          <AppDataTableBorderless
            overview={
              <>
                <div>
                  <Button type='button' onClick={toggleModal}><i className='bi bi-node-plus'/> Nouvelle sortie</Button>
                </div>
              </>
            }
            loader={isLoading}
            thead={<AppTHead onRefresh={onRefresh} loader={isLoading} isFetching={isFetching} items={[
              {label: '#'},
              {label: 'Bénéficiaire'},
              {label: 'Motif'},
              {label: 'Montant'},
              {label: 'Catégorie'},
              {label: <><i className='bi bi-person'/></>},
              {label: 'Date'},
            ]} />}
            tbody={<tbody>{content}</tbody>} />
          {errors && errors}
        </Card.Body>
      </Card>

      <AddOutput show={show} onHide={toggleModal} boxId={boxId} />
    </>
  )
}

export default Outputs
