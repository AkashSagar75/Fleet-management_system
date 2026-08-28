import { useState } from 'react'
import AppRoutes from './Routes/AppRoutes'
import {ToastContainer } from 'react-toastify';
import  {AuthProvider}  from './Context/role';
import { Provider } from "react-redux";
import {store} from './Redux/store/store.js'

 

function App() {
  
  return (
    <>
    <Provider store={store}>
<AuthProvider>
     <AppRoutes />
      <ToastContainer />
     </AuthProvider>
    </Provider>
     
    
     </>
  )
}

export default App
