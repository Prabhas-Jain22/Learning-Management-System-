import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(sessionStorage.getItem("accessToken")) || "";

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    console.log("Axios Request:", {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });

    return config;
  },
  (err) => Promise.reject(err)
);

axiosInstance.interceptors.response.use(
  (response) => {
    console.log("Axios Response:", response.status, response.data);
    return response;
  },
  (error) => {
    console.error("Axios Error:", error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
