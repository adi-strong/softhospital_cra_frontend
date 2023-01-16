import {lazy, Suspense} from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import routes from "../routes";
import {BlankLayout} from "../layouts/BlankLayout";
import {AppLazyLoading} from "./AppLazyLoading";
import {App404Error} from "./index";
import Register from "../features/login/register";

const
  Login = lazy(() => import('../features/login/login')),
  Profile = lazy(() => import('../features/profile/profile'))

function AppContent() {
  return (
    <Router>
      <Routes>
        <Route path='/member/' element={<AuthLayout/>}>
          {routes.map((r, idx) =>
            <Route key={idx} path={r.path}>
              {r.outlets.map((o, key) =>
                <Route
                  key={key}
                  index={o.index}
                  path={o.path}
                  element={<Suspense fallback={<AppLazyLoading/>}>{o.element}</Suspense>}/>)}
            </Route>)}
        </Route>
        <Route path='/' element={<BlankLayout/>}>
          <Route index element={<Suspense fallback={<AppLazyLoading/>}><Login/></Suspense>}/>
          <Route path='login' element={<Suspense fallback={<AppLazyLoading/>}><Login/></Suspense>}/>
          <Route path='register' element={<Suspense fallback={<AppLazyLoading/>}><Register/></Suspense>}/>
        </Route>
        <Route path='/' element={<AuthLayout/>}>
          <Route path='profile' element={<Suspense fallback={<AppLazyLoading/>}><Profile/></Suspense>}/>
        </Route>
        <Route path='*' element={<App404Error/>}/>
      </Routes>
    </Router>
  )
}

export default AppContent
