import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_DOMAIN}`,
    headers: {
        'Content-Type': 'application/json',
    }
})

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = Cookies.get('access-token');
        if (accessToken) {
            config.headers.Authorization = `${accessToken}`
        }
        return config;
    },
    (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 403 && !originalRequest._retry) {

            originalRequest._retry = true;
            const { accessToken, refreshToken } = await refreshAccessToken();
            if (accessToken && refreshToken) {
                Cookies.set("access-token", accessToken);
                Cookies.set("refresh-token", refreshToken)
                return axiosInstance(originalRequest)
            }

        }
        return Promise.reject(error);
    }
);

export default axiosInstance;

const refreshAccessToken = async () => {
    try {

        const refreshToken = Cookies.get('refresh-token');
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_DOMAIN}/api/auth/refresh-token`,
            { refreshToken });

        console.log("refreshed access token is: ", response.data?.refreshToken);


        return {
            accessToken: response.data?.accessToken,
            refreshToken: response.data?.refreshToken
        };

    } catch (error) {
        return { accessToken: null, refreshToken: null };
    }
}