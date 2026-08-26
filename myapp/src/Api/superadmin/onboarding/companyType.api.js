
 import API from "../axios"
 
 export const getCompanyTypes = async()=>{
    try {
    const res = await  API.get("/company/companytypes");
        return res.data;
    } catch (error) {
        notificationService.errors(error.message);
    }       

    }