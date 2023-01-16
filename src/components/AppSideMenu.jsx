import {memo, useCallback, useEffect} from "react";
import {Link, useLocation} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {onInitSidebarMenu, onResetSideMenuItem, onToggleSidebarMenu} from "../features/navigation/navigationSlice";

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

  return (
    <>
      <aside id='sidebar' className='sidebar'>
        <ul id='sidebar-nav' className='sidebar-nav'>
          {menuItems.map((menu, key) =>
            <li key={key} className='nav-item'>
              <Link
                to={menu.path}
                className={`nav-link ${(pathname !== menu.path) ? 'collapsed' : ''}`}
                onClick={onToggleActiveMenu}
                style={pathname === menu.path ? collapsedStyle : {}}>
                <i className={menu.icon}/>
                <span>{menu.label}</span>
              </Link>
            </li>)}

          {dropdownSideMenuItems.map((menu, key) =>
            <li key={key} className='nav-item'>
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
              </Link>
              <ul
                id={menu.path}
                className={`nav-content ${menu.isOpened ? handleToggleSubMenu(menu) : handleToggleSubMenu(menu)}`}
                data-bs-parent='#sidebar-nav'>
                {menu.items.map((item, index) =>
                  <li key={index}>
                    <Link
                      to={item.path}
                      className={`text-decoration-none ${pathname !== item.path ? '' : 'active'}`}
                      style={pathname === item.path ? collapsedStyle : {}}>
                      <i className="bi bi-circle"/><span>{item.label}</span>
                    </Link>
                  </li>)}
              </ul>
            </li>)}
        </ul>
      </aside>
    </>
  )
}

export default memo(AppSideMenu)
