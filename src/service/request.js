import axios from 'axios';
import { isUndefined } from 'lodash';
import { STATUS_CODE, getProblemFromStatus, getProblemFromError } from './code';

const token = 'token';

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_URL,
    timeout: 30 * 1000,
    transformRequest: (data, headers) => {
        headers.Authorization = token;
    }
});

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
