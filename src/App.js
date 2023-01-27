import React, {useEffect} from 'react';
import AOS from 'aos';
import AppContent from "./components/AppContent";
import {setup} from "./features/auth/authSlice";
import toast, {Toaster, ToastBar} from "react-hot-toast";

function App() {

  useEffect(() => {
    AOS.init({
      animatedClassName: 'aos-animate',
      duration: 1000,
    }) // Init AOSPureCounter
  }, [])

  useEffect(() => { setup() }, [])

  return (
    <>
      <AppContent/>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{}}
        toastOptions={{
          duration: 2000,

          success: {
            theme: {
              primary: 'blue',
              secondary: 'black'
            }
          }
        }}>
        {(t) => (
          <ToastBar toast={t}>
            {({icon, message}) => (
              <>
                {icon}
                {message}
                {t.type !== 'loading' && (
                  <button onClick={() => toast.dismiss(t.id)} className='btn border-0'>
                    <i className='bi bi-x'/>
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </>
  );
}

export default App;
