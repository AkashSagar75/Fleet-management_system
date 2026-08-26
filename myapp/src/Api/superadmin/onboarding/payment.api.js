import API from "../axios"
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