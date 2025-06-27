import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'https://asadmaxmudapi.up.railway.app/api/v1/'
});

export default axiosInstance;