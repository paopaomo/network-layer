import { inRange } from "lodash";
import axios from "axios";

export const STATUS_CODE =  {
    OK: 'ok',
    NETWORK: 'network_error',
    REQUEST_ABORTED: 'request_aborted_error',
    CANCEL: 'cancel_error',
    TIMEOUT: 'timeout_error',
    UNKNOWN: 'unknown_error',
    CONNECTION: 'connection_error',
    CLIENT: 'client_error',
    SERVER: 'server_error'
};

export const getProblemFromStatus = (status) => {
    if(inRange(status, 200, 300)) {
        return null;
    }
    if(inRange(status, 400, 500)) {
        return STATUS_CODE.CLIENT;
    }
    if(inRange(status, 500, 600)) {
        return STATUS_CODE.SERVER;
    }
    return STATUS_CODE.UNKNOWN;
};

export const getProblemFromError = (error) => {
    if(axios.isCancel(error)) {
        return STATUS_CODE.CANCEL;
    }
    switch(error.message) {
        case 'Network Error':
            return STATUS_CODE.NETWORK;
        case 'Request aborted':
            return STATUS_CODE.REQUEST_ABORTED;
        default:
            break;
    }
    switch(error.code) {
        case 'ECONNABORTED':
            return STATUS_CODE.TIMEOUT;
        case 'ENOTFOUND':
        case 'ECONNREFUSED':
        case 'ECONNRESET':
            return STATUS_CODE.CONNECTION;
        default:
            return STATUS_CODE.UNKNOWN;
    }
};
