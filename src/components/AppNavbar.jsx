import {memo, useEffect, useState} from "react";
import {Dropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import profile from '../assets/app/img/default_profile.jpg';
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {logOut, selectCurrentUser} from "../features/auth/authSlice";
import toast from "react-hot-toast";
import {api, entrypoint} from "../app/store";
import {onSetCurrency, onSetHospital, onSetRate, onSetSecondCurrency} from "../features/parameters/parametersSlice";
import {useGetSingleUserQuery} from "../features/users/userApiSlice";

const dropdownDivider = <li><hr className="dropdown-divider"/></li>
const profileItems = [
  {label: 'Mon profil', path: '/profile', icon: 'person'},
  {label: 'Paramètres', path: '/parameters', icon: 'gear'},
  {label: "Besoins d'aide ?", path: '/help', icon: 'question-circle'},
  {label: 'Déconnexion', path: '/logout', icon: 'box-arrow-right'},
]

const AppNavbar = ({onToggleSearch}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector(selectCurrentUser)
  const {data: singleUser, isSuccess} = useGetSingleUserQuery(user)
  const [file, setFile] = useState(null)

  useEffect(() => {
    if (isSuccess && singleUser && singleUser?.profile) {
      setFile(`${entrypoint}${singleUser.profile.contentUrl}`)
    }
  }, [isSuccess, singleUser])

  function onRedirect(event, path: string) {
    event.preventDefault()
    switch (path) {
      case '/profile':
        navigate(path)
        break
      case '/parameters':
        navigate(path)
        break
      case '/help':
        navigate(path)
        break
      default:
        toast('À bientôt.', {
          icon: '👏',
          style: {
            background: '#537ff5',
            color: '#fff',
          }
        })
        dispatch(api.util.resetApiState())
        dispatch(onSetRate(null))
        dispatch(onSetHospital(null))
        dispatch(onSetCurrency(null))
        dispatch(onSetSecondCurrency(null))
        dispatch(logOut())
        break
    }
  }

  return (
    <nav className='header-nav ms-auto'>
      <ul className='d-flex align-items-center'>
        <li className="nav-item d-block d-lg-none" onClick={onToggleSearch}>
          <span className='nav-link nav-icon search-bar-toggle'>
            <i className="bi bi-search"/>
          </span>
        </li>

        <Dropdown as='li' className='nav-item pe-3' children={
          <>
            <Dropdown.Toggle
              id='profile'
              as='a'
              className='nav-link nav-profile d-flex align-items-center pe-0'
              style={{ cursor: 'pointer' }}>
              {/*<i className='bi bi-person'/>*/}
              <img src={file ? file : profile} alt="Profile" className="rounded-circle" width={30} height={30} />
              <span className="d-none d-md-block ps-2 fw-bold text-capitalize">{user ? user.username : '❓'}</span>
            </Dropdown.Toggle>
            <Dropdown.Menu as='ul' className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile border-0'>
              <li className="dropdown-header">
                <h6 className='text-uppercase'>{user ? user.username : '❓'}</h6>
                <span className='text-uppercase'>Ceo</span>
              </li>
              {dropdownDivider}
              {profileItems.map((item, idx) =>
                <div key={idx} className='p-0 m-0'>
                  <li>
                    <Dropdown.Item
                      href={item.path}
                      className="dropdown-item d-flex align-items-center"
                      onClick={(e) => onRedirect(e, item.path)}>
                      <i className={`bi bi-${item.icon}`}/>
                      {item.label}
                    </Dropdown.Item>
                  </li>
                  {idx < profileItems.length - 1 && dropdownDivider}
                </div>)}
            </Dropdown.Menu>
          </>
        }/>
      </ul>
    </nav>
  )
}

AppNavbar.propTypes = {onToggleSearch: PropTypes.func.isRequired}

export default memo(AppNavbar)
