import {memo, useCallback, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu, onResetSideMenuItem, onToggleSidebarMenu} from "../features/navigation/navigationSlice";
import {selectCurrentUser} from "../features/auth/authSlice";
import {
  allowShowAppointmentsPage,
  allowShowConsultationsPage,
  allowShowCovenantsPage,
  allowShowDashPage,
  allowShowDrugsPage, allowShowDrugstoreMenus,
  allowShowFilesPage, allowShowFinancesMenus,
  allowShowFinancesPage, allowShowGalleryMenus,
  allowShowGalleryPage,
  allowShowLabPage,
  allowShowNursingPage,
  allowShowOrdersPage,
  allowShowPatientsMenus,
  allowShowPatientsPage, allowShowPersonalMenus,
  allowShowPersonalsPage,
  allowShowPrescriptionsPage,
  allowShowTasksMenus, allowShowTreatmentsMenus,
} from "../app/config";

const collapsedStyle = {
  color: '#4154f1',
}

const menuItems = [
  {label: 'Tableau de bord', icon: 'bi bi-grid', path: '/member/dashboard'},
  {label: 'Réception', icon: 'bi bi-house-door', path: '/member/reception'},
  {label: 'Ordonnances', icon: 'bi bi-file-earmark-text', path: '/member/orders'},
]

const AppSideMenu = () => {
  const {pathname} = useLocation()
  const {dropdownSideMenuItems} = useSelector(state => state.navs)
  const dispatch = useDispatch()

  const onToggleMenu = useCallback(id => {
    dispatch(onToggleSidebarMenu(id))
  }, [dispatch])

  const onToggleActiveMenu = useCallback(() => {
    dispatch(onResetSideMenuItem())
  }, [dispatch])

  function handleToggleSubMenu(menu) {
    const isOpened = menu.isOpened
    let className
    if (isOpened) {
      setTimeout(() => {
        className = 'collapsing'
      }, 1000)
      className = 'show'
    }
    else {
      setTimeout(() => {
        className = 'collapsed'
      }, 1000)
      className = 'collapse'
    }

    return className
  }

  useEffect(() => {
    dispatch(onInitSidebarMenu(pathname))
  }, [dispatch, pathname])

  const user = useSelector(selectCurrentUser)

  return (
    <>
      <aside id='sidebar' className='sidebar'>
        <ul id='sidebar-nav' className='sidebar-nav'>
          {menuItems.map((menu, key) =>
            <li key={key} className='nav-item'>
              {user && key === 0 && allowShowDashPage(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${(pathname !== menu.path) ? 'collapsed' : ''}`}
                  onClick={onToggleActiveMenu}
                  style={pathname === menu.path ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                </Link>}
              {user && key === 2 && allowShowOrdersPage(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${(pathname !== menu.path) ? 'collapsed' : ''}`}
                  onClick={onToggleActiveMenu}
                  style={pathname === menu.path ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                </Link>}
              {user && key !== 2 && key !== 0 &&
                <Link
                  to={menu.path}
                  className={`nav-link ${(pathname !== menu.path) ? 'collapsed' : ''}`}
                  onClick={onToggleActiveMenu}
                  style={pathname === menu.path ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                </Link>}
            </li>)}

          {dropdownSideMenuItems.map((menu, key) =>
            <li key={key} className='nav-item'>
              {key === 0 && user && allowShowPatientsMenus(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${!menu.isOpened ? 'collapsed' : ''}`}
                  data-bs-target={menu.path}
                  aria-expanded={menu.isOpened}
                  onClick={() => onToggleMenu(menu.id)}
                  style={menu.isOpened ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                  <i className={`bi bi-chevron-down ms-auto ${menu.isOpened ? 'transform-180' : ''}`}/>
                </Link>}
              {key === 1 && user && allowShowTasksMenus(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${!menu.isOpened ? 'collapsed' : ''}`}
                  data-bs-target={menu.path}
                  aria-expanded={menu.isOpened}
                  onClick={() => onToggleMenu(menu.id)}
                  style={menu.isOpened ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                  <i className={`bi bi-chevron-down ms-auto ${menu.isOpened ? 'transform-180' : ''}`}/>
                </Link>}
              {key === 2 && user && allowShowTreatmentsMenus(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${!menu.isOpened ? 'collapsed' : ''}`}
                  data-bs-target={menu.path}
                  aria-expanded={menu.isOpened}
                  onClick={() => onToggleMenu(menu.id)}
                  style={menu.isOpened ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                  <i className={`bi bi-chevron-down ms-auto ${menu.isOpened ? 'transform-180' : ''}`}/>
                </Link>}
              {key === 3 && user && allowShowDrugstoreMenus(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${!menu.isOpened ? 'collapsed' : ''}`}
                  data-bs-target={menu.path}
                  aria-expanded={menu.isOpened}
                  onClick={() => onToggleMenu(menu.id)}
                  style={menu.isOpened ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                  <i className={`bi bi-chevron-down ms-auto ${menu.isOpened ? 'transform-180' : ''}`}/>
                </Link>}
              {key === 4 && user && allowShowFinancesMenus(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${!menu.isOpened ? 'collapsed' : ''}`}
                  data-bs-target={menu.path}
                  aria-expanded={menu.isOpened}
                  onClick={() => onToggleMenu(menu.id)}
                  style={menu.isOpened ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                  <i className={`bi bi-chevron-down ms-auto ${menu.isOpened ? 'transform-180' : ''}`}/>
                </Link>}
              {key === 5 && user && allowShowPersonalMenus(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${!menu.isOpened ? 'collapsed' : ''}`}
                  data-bs-target={menu.path}
                  aria-expanded={menu.isOpened}
                  onClick={() => onToggleMenu(menu.id)}
                  style={menu.isOpened ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                  <i className={`bi bi-chevron-down ms-auto ${menu.isOpened ? 'transform-180' : ''}`}/>
                </Link>}
              {key === 6 && user && allowShowGalleryMenus(user?.roles[0]) &&
                <Link
                  to={menu.path}
                  className={`nav-link ${!menu.isOpened ? 'collapsed' : ''}`}
                  data-bs-target={menu.path}
                  aria-expanded={menu.isOpened}
                  onClick={() => onToggleMenu(menu.id)}
                  style={menu.isOpened ? collapsedStyle : {}}>
                  <i className={menu.icon}/>
                  <span>{menu.label}</span>
                  <i className={`bi bi-chevron-down ms-auto ${menu.isOpened ? 'transform-180' : ''}`}/>
                </Link>}
              <ul
                id={menu.path}
                className={`nav-content ${menu.isOpened ? handleToggleSubMenu(menu) : handleToggleSubMenu(menu)}`}
                data-bs-parent='#sidebar-nav'>
                {menu.items.map((item, index) =>
                  <li key={index}>
                    {user && key === 1 && index === 0 && allowShowFilesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 1 && index === 1 && allowShowFilesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 1 && index === 2 && allowShowFilesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 1 && index === 3 && allowShowFilesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 1 && index === 4 && allowShowFilesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}

                    {user && key === 0 && index === 0 && allowShowPatientsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 0 && index === 1 && allowShowCovenantsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}

                    {user && key === 2 && index === 0 && allowShowConsultationsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 2 && index === 1 && allowShowAppointmentsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 2 && index === 2 && allowShowLabPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 2 && index === 3 && allowShowPrescriptionsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 2 && index === 4 && allowShowNursingPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}

                    {user && key === 3 && index === 0 && allowShowDrugsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 3 && index === 1 && allowShowDrugsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 3 && index === 2 && allowShowDrugsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 3 && index === 3 && allowShowDrugsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 3 && index === 4 && allowShowDrugsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 3 && index === 5 && allowShowDrugsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}

                    {user && key === 4 && index === 0 && allowShowFinancesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 4 && index === 1 && allowShowFinancesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 4 && index === 2 && allowShowFinancesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 4 && index === 3 && allowShowFinancesPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}

                    {user && key === 5 && index === 0 && allowShowPersonalsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 5 && index === 1 && allowShowPersonalsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 5 && index === 2 && allowShowPersonalsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 5 && index === 3 && allowShowPersonalsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                    {user && key === 5 && index === 4 && allowShowPersonalsPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}

                    {user && key === 6 && index === 0 && allowShowGalleryPage(user?.roles[0]) &&
                      <Link
                        to={item.path}
                        className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                        style={pathname === item.path ? collapsedStyle : {}}>
                        <i className="bi bi-circle"/><span>{item.label}</span>
                      </Link>}
                  </li>)}
              </ul>
            </li>)}
        </ul>
      </aside>
    </>
  )
}

export default memo(AppSideMenu)
