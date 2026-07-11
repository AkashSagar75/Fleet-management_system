import { useState } from 'react'
import AppRoutes from './Routes/AppRoutes'
import {ToastContainer } from 'react-toastify';
import  {AuthProvider}  from './Context/role';
 

function App() {
  return (
    <>
     <AuthProvider>
     <AppRoutes />
      <ToastContainer />
     </AuthProvider>
    
     </>
  )
}

export default App
