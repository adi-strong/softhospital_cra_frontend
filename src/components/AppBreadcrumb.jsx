import {memo} from "react";
import PropTypes from "prop-types";
import {Link} from "react-router-dom";

const linksStyle = {
  color: '#899bbd',
  transition: '3.0s',
  fontSize: 14,
}

const style = {
  fontSize: 14,
  color: '#51678f',
}

const AppBreadcrumb = ({title, links = []}) => {
  return (
    <div className='pagetitle'>
      <h1>{title ? title : 'Réception (Fiches)'}</h1>
      <nav>
        <ol className='breadcrumb'>
          {title &&
            <li className='breadcrumb-item' style={style}>
              <Link to='/member/reception' className='text-decoration-none p-0 m-0' style={linksStyle}>Réception</Link>
            </li>}
          {links && links.map((link, idx) =>
            <li key={idx} className='breadcrumb-item' style={style}>
              <Link
                to={link.path} className='breadcrumb-item active pt-1 text-decoration-none'
                style={linksStyle}>{link.label}</Link>
            </li>)}
          <li className='breadcrumb-item active' style={style}>{title}</li>
        </ol>
      </nav>
    </div>
  )
}

AppBreadcrumb.propTypes = {
  title: PropTypes.string,
  links: PropTypes.array,
}

export default memo(AppBreadcrumb)
