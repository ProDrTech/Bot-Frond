import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://asadmaxmud.up.railway.app/api/v1/'
});

export default axiosInstance;