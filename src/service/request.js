import { isUndefined } from 'lodash';
import axios from 'axios';
import instance from "./instance";
import { STATUS_CODE, getProblemFromStatus, getProblemFromError } from './code';

const convertResponse = (instanceResponse, mapper) => {
    const isError = instanceResponse instanceof Error || axios.isCancel(instanceResponse);
    const response = isError ? instanceResponse.response : instanceResponse;
    const status = response ? response.status : null;
    const problem = isError ? getProblemFromError(instanceResponse) : getProblemFromStatus(status);
    const originalError = isError ? instanceResponse : null;
    let data = response ? response.data : null;
    if(!isUndefined(mapper)) {
        data = mapper(data);
    }
    return {
        kind: isError ? problem : STATUS_CODE.OK,
        originalError,
        data,
        errorMessage: '',
    }
};

const request = (config, mapper) => {
    return instance(config)
        .then((instanceResponse) => {
            return convertResponse(instanceResponse, mapper)
        })
        .catch((instanceResponse) => {
            return convertResponse(instanceResponse, mapper)
        })
};

export default request
