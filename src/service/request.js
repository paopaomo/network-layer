import axios from 'axios';
import { isUndefined } from 'lodash';
import { STATUS_CODE, getProblemFromStatus, getProblemFromError } from './code';

const token = 'token';
const isProduction = process.env.NODE_ENV === 'production';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 30 * 1000,
    transformRequest: (data, headers) => {
        headers.Authorization = token;
    }
});

if(!isProduction) {
    instance.interceptors.request.use(config => {
        const { method, url, params, data} = config;
        console.log(`%c${method}: %c${url}`, 'color: red', 'color: yellow');
        if(params) {
            console.log(`%cparams: %c${params}`, 'color: orange', 'color: pink');
        }
        if(data) {
            console.log(`%cdata: %c${JSON.stringify(data)}`, 'color: orange', 'color: pink');
        }
        return config;
    });

    instance.interceptors.response.use(response => {
        console.log(`%cresult: ${response.data}`, 'color: lawngreen', 'color: blue');
        return response;
    });
}

const convertResponse = (axiosResponse, mapper) => {
    const isError = axiosResponse instanceof Error || axios.isCancel(axiosResponse);
    const response = isError ? axiosResponse.response : axiosResponse;
    const status = response ? response.status : null;
    const problem = isError ? getProblemFromError(axiosResponse) : getProblemFromStatus(status);
    const originalError = isError ? axiosResponse : null;
    let data = response ? response.data : null;
    if(!isUndefined(mapper)) {
        data = mapper(data);
    }
    return {
        kind: isError ? problem : STATUS_CODE.OK,
        originalError,
        data
    }
};

const request = (config, mapper) => {
    return instance(config)
        .then((axiosResponse) => {
            return convertResponse(axiosResponse, mapper)
        })
        .catch((axiosResponse) => {
            return convertResponse(axiosResponse, mapper)
        })
};

export default request
