 
const baseUrl = 'http://localhost:8087/auth';

import API from './axios'
import notificationService from '../Common/notificationService';

 export const userLogin = async (data)=>{
    try {
    const res = await API.post(`/auth/userLogin`, data);
    return res.data;
    } catch (error) { 
    notificationService.error(error.message)
    }
   
 }
 export const getrole = async(id)=>{
    try {
         const res = await API.get(`/auth/getrole/${id}`);
         return res.data;

    } catch (error) {
         console.log(`message, error.message`)
          return {
         success: false,
         message: error.res?.data?.message || "Something went wrong"
      };
        
    }
 }
 export const forgetPassword = async(data)=>{
   try {
      const res = await API.post(`/auth/forgetPassword`,data);
      return res.data;
   } catch (error) {
      console.log("Forget Password Error:", error);
      return {
         success: false,
         message: error.res?.data?.message || "Something went wrong"
      };
   }

 }
 export const verifyOtp = async(data)=>{
   try {
      const res = await API.post(`/auth/verifyOtp/`,data);
      return res.data;
   } catch (error) {
      console.error(`message:error.message`)
       return {
         success: false,
         message: error.res?.data?.message || "Something went wrong"
      };
      
   }

 }
 export const resetPassword = async(data)=>{
    try {
      const res = await API.post('/auth/resetPassword',data);
      return res.data;
    } catch (error) {
       console.error(`message:error.message`)
       return {
         success: false,
         message: error.res?.data?.message || "Something went wrong"
      };
    }
 }

 export const logout = async(data)=>{
   try {
       const res = await API.delete('/auth/logout',
         {
            data: {
        refreshToken: data
    }
         }
       );
       return res.data;
   } catch (error) {
       console.error(`message:error.message`)
       return {
         success: false,
         message: error.res?.data?.message || "Something went wrong"
      };
      
   }

 }