import API from "./axios";
import notificationService from "../Common/notificationService";

 
export const onboarding1 = async(data)=>{
try {
 const res = await API.post(`/company/onboarding`,data);
return  res.data
} catch (error) {
  notificationService.error(error.response?.data?.message || error.message)
  return {
    success: false,
    message: error.response?.data?.message || error.message,
  };
}
}


export const getrole = async()=>{
try {
  const res = await API.get(`/company/getrole`);
    return  res.data
} catch (error) {
   return {
         success: false,
         message: error.response?.data?.message || error.message
      };
}
}

 export const getCompanyTypes = async()=>{
  try {
    const res = await API.get(`/company/companytypes`); 

    return  res.data
  } catch (error) { 
  
     notificationService.error(error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}
export const verifyPayment = async(data)=>{
  try {
    const res = await API.post(`/payment/verify-payment`, data);
    return res.data;
  } catch (error) {
    notificationService.error(error.message);
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
}

