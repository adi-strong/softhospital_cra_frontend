import {memo, useState} from "react";
import {Link} from "react-router-dom";
import logo from '../assets/app/img/logo.png';
import {AppNavbar, AppSearchBar} from "./index";

const body = document.querySelector('body')

const AppHeader = () => {
  const [show, setShow] = useState(true)
  const [search, setSearch] = useState(false)

  const toggleShow = () => setShow(!show)
  const toggleSearch = () => setSearch(!search)

  function toggleSidebar() {
    toggleShow()
    if (show) body.classList = ' toggle-sidebar'
    else body.classList = ' '
  }

  return (
    <header id='header' className='header fixed-top d-flex align-items-center'>
      <div className="d-flex align-items-center justify-content-between">
        <Link to='/member/reception' className="logo d-flex align-items-center text-decoration-none">
          <img src={logo} alt=""/>
          <span className="d-none d-lg-block">SoftHospital</span>
        </Link>
        <i className="bi bi-list toggle-sidebar-btn" onClick={toggleSidebar}/>
      </div>

      <AppSearchBar show={search}/>

      <AppNavbar onToggleSearch={toggleSearch}/>
    </header>
  )
}

export default memo(AppHeader)
