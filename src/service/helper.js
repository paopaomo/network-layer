import { inRange } from "lodash";
import { STATUS_CODE } from './statusCode'

const getByHttpStatus = (status) => {
    if(inRange(status, 400, 500)) {
        return STATUS_CODE.CLIENT;
    }
    if(inRange(status, 500, 600)) {
        return STATUS_CODE.SERVER;
    }
    return STATUS_CODE.UNKNOWN;
};

const getByError = (error) => {
    switch(error.message) {
        case 'Request aborted':
            return STATUS_CODE.REQUEST_ABORTED;
        case 'Network Error':
            return STATUS_CODE.NETWORK;
        default:
            if(error.code === 'ECONNABORTED') {
                return STATUS_CODE.TIMEOUT;
            }
            return STATUS_CODE.UNKNOWN;
    }
};

export const getErrorStatusCode = (error) => {
    if(error.response) {
        return getByHttpStatus(error.response.status);
    }
    return getByError(error);
};

export const getErrorMessage = (error) => {
    if(error.response) {
        return error.response.data.error ? error.response.data.error.message : '';
    } else {
        return error.message;
    }
};
