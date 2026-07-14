 
import API from "../axios"

 
 export const getVehicleTypes = async (data) => {
  console.log("API Data:", data);

  const res = await API.get("/transport/getVehicleTypes", {
    params: data,
  });

  console.log(res);

  return res.data;
};