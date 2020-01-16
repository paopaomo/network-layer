import axios from 'axios';
import { STATUS_CODE } from "./statusCode";
import { getStatusCodeByHttpStatus, getStatusCodeByError } from './helper';

const token = 'token';

const myAxios = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 30 * 1000
});

myAxios.interceptors.request.use(config => {
    config.headers.Authorization = token;
    return config; 
});

const getErrorResponse = (error) => {
    if(error.response) {
        return {
            statusCode: getStatusCodeByHttpStatus(error.response.status),
            data: error.response.data
        }
    }
    return {
        statusCode: getStatusCodeByError(error),
        data: error
    }
};

const request = (config) => {
    return myAxios(config)
        .then((res) => {
            return {
                statusCode: STATUS_CODE.OK,
                data: res.data
            }
        })
        .catch((error) => {
            return getErrorResponse(error)
        })
};

export default request
