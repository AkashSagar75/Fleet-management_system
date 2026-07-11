import API from "./axios";
import notificationService from "../Common/notificationService";

 export const getMenus = async (user) => {
  try {
  console.log(user, "user data in getMenus");

     const url = `/menu/getMenus/${user.role_id}/${user.company_type_id}`;
    const res = await API.get(url);
    return res.data;

  } catch (error) {

    notificationService.error("Get menus failed");

    return {
      success: false,
      message: error.response?.data?.message || "Get menus failed"
    };
  }
};

  