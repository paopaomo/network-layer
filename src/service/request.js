import axios from 'axios';
import { STATUS_CODE } from "./statusCode";
import { getErrorStatusCode, getErrorMessage } from './helper';

const token = 'token';

const myAxios = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 30 * 1000,
    transformRequest: (data, headers) => {
        headers.Authorization = token;
    }
});

const handleSuccess = (res) => {
    return {
        statusCode: STATUS_CODE.OK,
        data: res.data
    }
};

const handleError = (error) => {
    const isCancelError = axios.isCancel(error);
    if(isCancelError) {
        return {
            statusCode: STATUS_CODE.REQUEST_CANCELED,
            data: { message: error.message }
        }
    } else {
        return {
            statusCode: getErrorStatusCode(error),
            data: { message: getErrorMessage(error) }
        }
    }
};

const request = (config) => {
    return myAxios(config)
        .then(handleSuccess)
        .catch(handleError)
};

export default request
