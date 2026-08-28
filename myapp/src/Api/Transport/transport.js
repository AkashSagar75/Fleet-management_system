 
import notificationService from "../../Common/notificationService";
 
import API from "../axios";

export const CreateUser = async (data) => {
  try {
    // Validate data
    if (!data || Object.keys(data).length === 0) {
      notificationService.error({
        message: "Data is required",
        description: "Please enter the required information.",
      });

      return null;
    }

    // API call
    const response = await API.post("/transport/createUser", data );

    // Success
    notificationService.success({
      message: "Success",
      description:
      response?.data?.message || "User created successfully.",
    });

    return response.data;

  } catch (error) {
    notificationService.error({
      message: "Something went wrong",
      description:
        error?.response?.data?.message ||
        error?.message ||
        "Unable to create user.",
    });

    return null;
  }
};