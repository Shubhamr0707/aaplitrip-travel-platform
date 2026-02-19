import axios from 'axios';
import { getToken } from './services/TokenService';

const setupAxiosInterceptors = () => {
    axios.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );
};

export default setupAxiosInterceptors;
