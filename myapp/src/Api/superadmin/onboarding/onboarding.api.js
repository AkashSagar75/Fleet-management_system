import API from "../axios"
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
