import {limitStrTo} from "../../services";
import {Button} from "react-bootstrap";

export const MedicineItem2 = ({ medicine, onPushNewItem, isLoading = false }) => {
  return (
    <>
      <tr>
        <td
          className={`text-primary text-capitalize ${isLoading ? 'disabled' : ''}`}
          style={{ fontWeight: 800, cursor: 'pointer' }}
          title={medicine?.wording.toUpperCase()}
          onClick={!isLoading ? () => onPushNewItem(medicine) : () => { }}>
          {limitStrTo(30, medicine?.wording)}
        </td>
        <td style={{ fontWeight: 800 }}>{parseInt(medicine.quantity).toLocaleString()}</td>
        <td className='text-end'>
          <Button
            type='button'
            variant='secondary'
            size='sm'
            disabled={isLoading}
            onClick={!isLoading ? () => onPushNewItem(medicine) : () => { }}>
            <i className='bi bi-plus'/>
          </Button>
        </td>
      </tr>
    </>
  )
}
