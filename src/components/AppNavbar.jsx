import {memo, useEffect, useState} from "react";
import {Dropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import profile from '../assets/app/img/default_profile.jpg';
import PropTypes from "prop-types";
import {useDispatch, useSelector} from "react-redux";
import {logOut, selectCurrentUser} from "../features/auth/authSlice";
import toast from "react-hot-toast";
import {api, entrypoint} from "../app/store";
import {resetParameters} from "../features/parameters/parametersSlice";
import {useGetSingleUserQuery} from "../features/users/userApiSlice";
import {allowShowParametersPage, role} from "../app/config";
import {onResetAgentAppointments} from "../features/appointments/agentAppointmentsSlice";

export function usernameFiltered(str: string) {
  if (str) {
    let splitStr
    switch (str) {
      case str.split('-'):
        splitStr = str.split('-')[1]
        break
      case str.split('_'):
        splitStr = str.split('_')[1]
        break
      case str.split('.'):
        splitStr = str.split('.')[1]
        break
      default:
        splitStr = str.split(' ')[1]
        break
    }

    if (splitStr && splitStr.length > 0)
      return str.substring(0, 1)+'. '+str.split(' ')[1]
    else return str
  }
}

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
        dispatch(resetParameters())
        dispatch(logOut())
        dispatch(onResetAgentAppointments())
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
              <span className="d-none d-md-block ps-2 fw-bold text-capitalize">
                {user ? user?.name ? usernameFiltered(user.name) : user.username : '❓'}
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu as='ul' className='dropdown-menu dropdown-menu-end dropdown-menu-arrow profile border-0'>
              <li className="dropdown-header">
                <h6 className='text-uppercase'>
                  {user ? user?.name ? usernameFiltered(user.name) : user.username : '❓'}
                </h6>
                <span className='text-capitalize'>{user && role(user.roles[0])}</span>
              </li>
              {dropdownDivider}
              {profileItems.map((item, idx) =>
                <div key={idx} className='p-0 m-0'>
                  {idx === 1 && user && allowShowParametersPage(user?.roles[0]) &&
                    <li>
                      <Dropdown.Item
                        href={item.path}
                        className="dropdown-item d-flex align-items-center"
                        onClick={(e) => onRedirect(e, item.path)}>
                        <i className={`bi bi-${item.icon}`}/>
                        {item.label}
                      </Dropdown.Item>
                    </li>}
                  {idx !== 1 &&
                    <li>
                      <Dropdown.Item
                        href={item.path}
                        className="dropdown-item d-flex align-items-center"
                        onClick={(e) => onRedirect(e, item.path)}>
                        <i className={`bi bi-${item.icon}`}/>
                        {item.label}
                      </Dropdown.Item>
                    </li>}
                  {idx === 1 && user && allowShowParametersPage(user?.roles[0]) &&
                    idx < profileItems.length - 1 && dropdownDivider}
                  {idx !== 1 &&
                    idx < profileItems.length - 1 && dropdownDivider}
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
