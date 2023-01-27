import {memo} from "react";
import {cardTitleStyle} from "../../layouts/AuthLayout";
import {Row, Table} from "react-bootstrap";
import PropTypes from "prop-types";
import {RepeatableTableRows} from "../../loaders";

const AppDataTableContents = (
  {
    title,
    thead,
    tbody,
    overview,
    isStriped = false,
    isBorderless = false,
    isHover = false,
    loader = false,
  }) => {
  return (
    <>
      <h5 className="card-title" style={cardTitleStyle}>{title}</h5>
      <Row className='mb-3'>{overview && overview}</Row>
      <Table striped={isStriped} borderless={isBorderless} hover={isHover} responsive>
        {thead}
        {!loader && tbody}
      </Table>
      {loader && <RepeatableTableRows/>}
    </>
  )
}

AppDataTableContents.propTypes = {
  title: PropTypes.any,
  thead: PropTypes.any,
  tbody: PropTypes.any,
  overview: PropTypes.any,
  isStriped: PropTypes.bool,
  isBorderless: PropTypes.bool,
  isHover: PropTypes.bool,
}

export default memo(AppDataTableContents)
