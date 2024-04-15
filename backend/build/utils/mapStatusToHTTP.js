"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function mapStatusHTTP(status) {
    switch (status) {
        case 'SUCCESSFUL': return 200;
        case 'CREATED': return 201;
        case 'NO_CONTENT': return 204;
        case 'INVALID_REQUEST': return 400;
        case 'UNAUTHORIZED': return 401;
        case 'NOT_FOUND': return 404;
        case 'CONFLICT': return 409;
        case 'INVALID_DATA': return 422;
        case 'INTERNAL_SERVER_ERROR': return 500;
        default: return 500;
    }
}
exports.default = mapStatusHTTP;
