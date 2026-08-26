 import API from "../axios"

 export const getFeatrues = async()=>{
    try {
    const res = await  API.get("/company/getFeatrues");
     console.log("gert featrues data " ,res.data)
     return res.data;
    } catch (error) {
        notificationService.errors(error.message);
    }
 }
  export const getCompanyTypes = async()=>{
    try {
    const res = await  API.get("/company/companytypes");
        return res.data;
    } catch (error) {
        notificationService.errors(error.message);
    }       

    }
        