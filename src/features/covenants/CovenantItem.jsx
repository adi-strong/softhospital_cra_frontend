import {Link} from "react-router-dom";
import {Button, ButtonGroup} from "react-bootstrap";

export const CovenantItem = ({covenant}) => {
  return (
    <>
      <tr>
        <th scope='row'>#{covenant.id.toLocaleString()}</th>
        <td className='text-capitalize'>
          <Link to={`/patients/covenants/${covenant.id}`} className='text-decoration-none'>
            {covenant.denomination+' '}
            {covenant?.unitName && <span className='text-uppercase'>({covenant.unitName})</span>}
          </Link>
        </td>
        <td className='text-capitalize'>{covenant.focal}</td>
        <td className='text-secondary'>{covenant.tels[0].num}</td>
        <td className='text-secondary'>{covenant.email}</td>
        <td className='text-md-end'>
          <ButtonGroup>
            <Link to={`/patients/covenants/edit/${covenant.id}`} title='Modifier' className='btn btn-light p-0 pe-1 px-1 m-0'>
              <i className='bi bi-pencil text-primary'/>
            </Link>
            <Button type='button' title='Suppression' variant='light' className='p-0 pe-1 px-1 m-0'>
              <i className='bi bi-trash text-danger'/>
            </Button>
          </ButtonGroup>
        </td>
      </tr>
    </>
  )
}
