import {memo} from "react";
import {Dropdown} from "react-bootstrap";
import PropTypes from "prop-types";

const headingStyle = {
  textTransform: 'uppercase',
  fontSize: 14,
  fontWeight: 600,
  letterSpacing: 1,
  color: '#aab7cf',
  marginBottom: 0,
  padding: 0,
}

const AppDropdownFilerMenu = ({ heading = 'Filtre', items = [], onClick }) => {
  return (
    <>
      <Dropdown as='div' className='filter' children={
        <>
          <Dropdown.Toggle
            as='a'
            href='#'
            bsPrefix=' '
            className='icon'><i className='bi bi-three-dots'/></Dropdown.Toggle>

          <Dropdown.Menu as='ul' className='dropdown-menu-end dropdown-menu-arrow border-0'>
            <Dropdown.Header as='li' className='text-start'><h6 style={headingStyle}>{heading}</h6></Dropdown.Header>
            {items.length > 0 && items.map((item, idx) =>
              <div key={idx}>
                <Dropdown.Item
                  as='a'
                  href={item.action}
                  onClick={() => onClick(item?.name)}>{item.label}</Dropdown.Item>
              </div>)}
          </Dropdown.Menu>
        </>
      } />
    </>
  )
}

AppDropdownFilerMenu.propTypes = {
  heading: PropTypes.string,
  items: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
}

export default memo(AppDropdownFilerMenu)
