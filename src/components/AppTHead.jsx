import {memo} from "react";
import PropTypes from "prop-types";
import {Spinner} from "react-bootstrap";

const AppTHead = ({img, onRefresh, style = {}, className, isImg = false, items = [], loader = false, isFetching = false}) => {
  return (
    <thead style={style}>
    <tr className={className}>
      {isImg && <th scope='col'>{img}</th>}
      {items && items?.map((item, idx) =>
        <th key={idx} scope='col'>
          {item.label}
        </th>)}
      {onRefresh &&
        <th scope='col' className='text-md-end'>
          <button type='button' className='btn border-0 m-0 p-0' disabled={isFetching || loader} onClick={onRefresh}>
            {isFetching
              ? <><Spinner animation='border' size='sm' className='text-primary'/></>
              : <><i className='bi bi-arrow-clockwise text-primary'/></>}
          </button>
        </th>}
    </tr>
    </thead>
  )
}

AppTHead.propTypes = {
  img: PropTypes.any,
  isImg: PropTypes.bool,
  loader: PropTypes.bool,
  isFetching: PropTypes.bool,
  items: PropTypes.array.isRequired,
  onRefresh: PropTypes.func,
}

export default memo(AppTHead)
