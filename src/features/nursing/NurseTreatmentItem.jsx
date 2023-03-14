import {Button, Col} from "react-bootstrap";
import {requiredField} from "../covenants/addCovenant";
import {AppAsyncSelectOptions} from "../../components";

export const NurseTreatmentItem = (
  {
    item,
    onChangeNursingItem,
    onLoadTreatments,
    options,
    onRemoveItem,
    idx,
    loader, items = [] }) => {
  return (
    <>
      <Col md={2}>{item.wording} {requiredField}</Col>
      <Col>
        <AppAsyncSelectOptions
          onChange={(e) => onChangeNursingItem(e, idx)}
          value={item.content}
          loadOptions={onLoadTreatments}
          disabled={loader}
          placeholder='-- Traitement --'
          defaultOptions={options}
          className='text-capitalize' />
      </Col>
      {items.length > 1 && (
        <Col md={2}>
          <Button type='button' variant='light' className='w-100' disabled={loader} onClick={() => onRemoveItem(idx)}>
            <i className='bi bi-x text-danger'/>
          </Button>
        </Col>
      )}
    </>
  )
}
