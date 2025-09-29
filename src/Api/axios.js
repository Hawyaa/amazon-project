import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "https://amazon-api-deploy-1-vd6j.onrender.com/",
});

export default axiosInstance;