 
import notificationService from "../../Common/notificationService";
import API from "../axios"

 
 export const getVehicleTypes = async (data) => {
 

  const res = await API.get("/transport/getVehicleTypes", {
    params: data,
  });
 return res.data;
};

export const curdvehicle = async (data) =>{
  try {
     const res = await API.post("/transport/vehicleTypeAction",  data);
      return res;
      notificationService.success(res.message);
  } catch (error) {
      
    
  }

}