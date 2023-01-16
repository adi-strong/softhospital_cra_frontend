import '../assets/app/css/style.css';
import '../assets/app/vendor/quill/quill.snow.css';
import '../assets/app/vendor/quill/quill.bubble.css';
import '../assets/app/vendor/remixicon/remixicon.css';
import '../assets/app/vendor/simple-datatables/style.css';
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {AppHeader, AppSideMenu} from "../components";
import {useDispatch, useSelector} from "react-redux";
import {setup} from "../features/auth/authSlice";
import {useEffect} from "react";

export const cardTitleStyle = {
  padding: '2px 0 1px 0',
}

const AuthLayout = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { token } = useSelector(state => state.auth)

  useEffect(() => {
    const timer = setInterval(() => {
      dispatch(setup())
    }, 10000)
    return () => clearInterval(timer)
  }, [dispatch])

  return token || localStorage.getItem('authToken') ? (
    <main id='main' className='main'>
      <AppHeader/>
      <AppSideMenu/>
      <Outlet/>
    </main>
  ) : <Navigate to='/login' state={{ from: location }} replace />
}

export default AuthLayout
