// import { env } from "../../../../config/env.service.js";

// export const ErrorResponse = ({
//   status = 400,
//   message = "something went wrong",
//   extra = undefined,
// } = {}) => {
//   throw new Error(message, {cause: { status, extra } });
// };

// export const BadRequestException = ({
//   message = "Bad Request Exception",
//   extra = undefined,
// } = {}) => {
//   return ErrorResponse({ status: 400, message, extra });
// };

// export const notFoundException = ({
//   message = "Not Found Exception",
//   extra = undefined,
// } = {}) => {
//   return ErrorResponse({ status: 404, message, extra });
// };

// export const ConflictException = ({
//   message = "Conflict Exception",
//   extra = undefined,
// } = {}) => {
//   return ErrorResponse({ status: 409, message, extra });
// };
// export const UnauthorizedException = ({
//   message = "Unauthorized Exception",
//   extra = undefined,
// } = {}) => {
//   return ErrorResponse({ status: 401, message, extra });
// };
// export const ForbiddenException = ({
//   message = "Forbidden Exception",
//   extra = undefined,
// } = {}) => {
//   return ErrorResponse({ status: 403, message, extra });
// };

// export const globalErrorHandler = (error, req, res, next) => {
//   const status = error.status
//     ? error.status
//     : error.cause
//       ? error.cause.status
//       : 500;
//   const mood = env.mood == "dev";
//   const defaultMessage = "something went wrong";
//   const displayErrorMessage = error.message || defaultMessage;
//   const extra = error.extra || {};
//   res.status(status).json({
//     status,
//     stack: mood ? error.stack : null,
//     errorMessage: mood ? displayErrorMessage : defaultMessage,
//   });
// };

import { env } from "../../../../config/env.service.js"

export const ErrorResponse = ({ status = 400, message = "Something went wrong", extra = undefined } = {}) => {
    throw new Error(message, { cause: { status, extra } })
}

export const BadRequestException = ({ message = "BadRequestException", extra = undefined } = {}) => {
    return ErrorResponse({
        status: 400,
        message,
        extra
    })
}

export const NotFoundException = ({ message = "NotFoundException", extra = undefined } = {}) => {
    return ErrorResponse({
        status: 404,
        message,
        extra
    }
    )
}

export const ConflictException = ({ message = "ConflictException", extra = undefined } = {}) => {
    return ErrorResponse({
        status: 409,
        message,
        extra
    })
}

export const UnauthorizedException = ({ message = "UnauthorizedException", extra = undefined } = {}) => {
    return ErrorResponse({
        status: 401,
        message,
        extra
    })
}

export const ForbiddenException = ({ message = "ForbiddenException", extra = undefined } = {}) => {
    return ErrorResponse({
        status: 403,
        message,
        extra
    })
}

export const globalErrorHandler = (error, req, res, next) => {
    const status = error.status ? error.status : error.cause ? error.cause.status : 500;
    const mood = env.mood == 'dev'
    const deafultMessage = 'Something went wrong'
    const displayErrorMessage = error.message || deafultMessage
    // const extra = error.cause.extra || {};
    res.status(status).json({
        status,
        stack: mood ? error.stack : null,
        errorMessage: mood ? displayErrorMessage : deafultMessage,
        // extra: extra ? extra : null
    });
}