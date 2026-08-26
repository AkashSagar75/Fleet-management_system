import API from "../axios"
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