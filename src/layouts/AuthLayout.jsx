import '../assets/app/css/style.css';
import '../assets/app/vendor/quill/quill.snow.css';
import '../assets/app/vendor/quill/quill.bubble.css';
import '../assets/app/vendor/remixicon/remixicon.css';
import '../assets/app/vendor/simple-datatables/style.css';
import {Navigate, Outlet, useLocation} from "react-router-dom";
import {AppHeader, AppSideMenu} from "../components";
import {useDispatch, useSelector} from "react-redux";
import {selectCurrentToken} from "../features/auth/authSlice";
import {useGetParametersQuery} from "../features/parameters/parametersApiSlice";
import {currencies} from "../app/config";
import {useEffect} from "react";
import {
  onSetCurrency,
  onSetFOperation,
  onSetHospital, onSetLOperation,
  onSetRate,
  onSetSecondCurrency
} from "../features/parameters/parametersSlice";

export const cardTitleStyle = {
  padding: '2px 0 1px 0',
}

const AuthLayout = () => {
  const location = useLocation(), dispatch = useDispatch()
  const token = useSelector(selectCurrentToken)
  const {data: parameters, isSuccess} = useGetParametersQuery('Parameters')

  useEffect(() => {
      if (isSuccess) {
        if (parameters) {
          const target = parameters.ids[0]
          if (target) {
            let currency, secondCurrency
            dispatch(onSetHospital(parameters.entities[target]?.hospital
              ? parameters.entities[target].hospital
              : null))
            dispatch(onSetFOperation(parameters.entities[target]?.fOperation
              ? parameters.entities[target]?.fOperation : null))
            dispatch(onSetLOperation(parameters.entities[target]?.lOperation
              ? parameters.entities[target]?.lOperation : null))
            dispatch(onSetRate(parameters.entities[target]?.rate
              ? parameters.entities[target].rate
              : null))
            for (const key in currencies) {
              if (currencies[key].code === parameters.entities[target].code)
                currency = currencies[key]
            }
            dispatch(onSetCurrency(currency))

            for (const key in currencies) {
              if (currencies[key].code === parameters.entities[target].secondCode)
                secondCurrency = currencies[key]
            }
            dispatch(onSetSecondCurrency(secondCurrency))
          }
        }
      }
      else {
        dispatch(onSetRate(null))
        dispatch(onSetCurrency(null))
        dispatch(onSetCurrency(null))
      }
    }, [isSuccess, parameters, dispatch]) // handle currencies parameters

  return token || localStorage.getItem('authToken') ? (
    <main id='main' className='main'>
      <AppHeader/>
      <AppSideMenu/>
      <Outlet/>
    </main>
  ) : <Navigate to='/login' state={{ from: location }} replace />
}

export default AuthLayout
