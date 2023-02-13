import {Link} from "react-router-dom";
import {Button, ButtonGroup} from "react-bootstrap";
import {useGetCovenantsQuery} from "./covenantApiSlice";
import img from '../../assets/app/img/default_covenant_img.png';
import {entrypoint} from "../../app/store";
import {useState} from "react";
import {EditCovenant} from "./EditCovenant";

export const CovenantItem = ({id}) => {
  const [show, setShow] = useState(false)
  const { covenant } = useGetCovenantsQuery('Covenant', {
    selectFromResult: ({ data }) => ({ covenant: data.entities[id] })
  })

  const toggleModal = () => setShow(!show)

  return (
    <>
      <tr>
        <th scope='row'>
          <img
            src={covenant?.logo ? entrypoint+covenant.logo.contentUrl : img}
            alt=''
            width={40}
            height={40}/>
        </th>
        <td className='fw-bold'>#{covenant.id.toLocaleString()}</td>
        <td className='text-capitalize'>
          <Link to={`/member/patients/covenants/${covenant.id}/${covenant.slug}`} className='text-decoration-none fw-bold'>
            {covenant.denomination+' '}
            {covenant?.unitName && <span className='text-uppercase'>({covenant.unitName})</span>}
          </Link>
        </td>
        <td className='text-capitalize'>{covenant?.focal ? covenant.focal : '❓'}</td>
        <td className='text-secondary'>{covenant?.tel ? covenant.tel : '❓'}</td>
        <td className='text-secondary'>{covenant?.email ? covenant.email : '❓'}</td>
        <td>{covenant?.createdAt ? covenant.createdAt : '❓'}</td>
        <td className='text-md-end'>
          <ButtonGroup size='sm'>
            <Button type='button' title='Modifier' variant='light' onClick={toggleModal}>
              <i className='bi bi-pencil-square text-primary'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>

      <EditCovenant show={show} onHide={toggleModal} data={covenant} />
    </>
  )
}
