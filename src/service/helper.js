import { inRange } from "lodash";
import axios from 'axios';
import { STATUS_CODE } from './statusCode';

export const getStatusCodeByHttpStatus = (status) => {
    if(inRange(status, 400, 500)) {
        return STATUS_CODE.CLIENT;
    }
    if(inRange(status, 500, 600)) {
        return STATUS_CODE.SERVER;
    }
    return STATUS_CODE.UNKNOWN;
};

export const getStatusCodeByError = (error) => {
    if(axios.isCancel(error)) {
        return STATUS_CODE.REQUEST_CANCELED;
    }
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
