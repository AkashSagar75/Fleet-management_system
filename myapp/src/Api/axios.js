 import axios from "axios";

import notificationService
from "../Common/notificationService";


// MAIN API
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8087",
});


// ================================
// REQUEST INTERCEPTOR
// ================================
API.interceptors.request.use(

  (config) => {

    const token =
      sessionStorage.getItem("accessToken");

    if (token) {

      config.headers.Authorization =
        `Bearer ${token}`;
    }

    return config;
  },

  (error) => {

    return Promise.reject(error);
  }
);



// ================================
// RESPONSE INTERCEPTOR
// ================================
API.interceptors.response.use(

  (response) => response,

  async (error) => {

    const originalRequest = error.config;


    // =====================================
    // ACCESS TOKEN EXPIRE
    // =====================================
    if (
      error.response?.status === 403 &&
      !originalRequest._retry
    ) {

      originalRequest._retry = true;

      const refreshToken =
        localStorage.getItem("refreshToken");


      // REFRESH TOKEN NOT FOUND
      if (!refreshToken) {

        sessionStorage.clear();
        localStorage.clear();

        window.location.href = "/";

        return Promise.reject(error);
      }


      try {

        // REFRESH TOKEN API
        const res = await axios.post(
           `${import.meta.env.VITE_API_URL}/auth/refreshToken`,
          {
            refreshToken,
          }
        );


        // SAVE NEW TOKENS
        sessionStorage.setItem(
          "accessToken",
          res.data.accessToken
        );

        localStorage.setItem(
          "refreshToken",
          res.data.refreshToken
        );


        // UPDATE HEADER
        originalRequest.headers.Authorization =
          `Bearer ${res.data.accessToken}`;


        // RECALL FAILED API
        return API(originalRequest);

      } catch (refreshError) {

        // TOKEN EXPIRE
        notificationService.error(
          "Session Expired Please Login Again"
        );

        sessionStorage.clear();
        localStorage.clear();

        window.location.href = "/";

        return Promise.reject(refreshError);
      }
    }


    // =====================================
    // OTHER ERRORS
    // =====================================
    if (error.response) {

      notificationService.error(
        error.response.data.message ||
        "Something went wrong"
      );

    } else {

      notificationService.error(
        "Network Error"
      );
    }


    return Promise.reject(error);
  }
);

export default API;