import { AWSError } from 'aws-sdk';
import { HttpError } from 'http-errors';
import { getNotFound, getCode, getInternalError, getConflict, API_ERROR, HTTP_STATUS } from '@verdaccio/commons-api';

// class VerdaccioError extends Error {
//   httpCode: number;
//   code: string;
//   constructor(message: string, httpCode: number | string, code: string) {
//     super(message);
//     this.httpCode = httpCode as number;
//     this.code = code;
//   }
// }

export function is404Error(err: HttpError): boolean {
  return err.code === HTTP_STATUS.NOT_FOUND;
}

export function create404Error(): HttpError {
  return getNotFound('no such package available');
}

export function is409Error(err: HttpError): boolean {
  return err.code === HTTP_STATUS.CONFLICT;
}

export function create409Error(): HttpError {
  return getConflict('file already exists');
}

export function is503Error(err: HttpError): boolean {
  return err.code === HTTP_STATUS.SERVICE_UNAVAILABLE;
}

export function create503Error(): HttpError {
  return getCode(HTTP_STATUS.SERVICE_UNAVAILABLE, 'resource temporarily unavailable');
}

export function convertS3Error(err: AWSError): HttpError {
  switch (err.code) {
    case 'NoSuchKey':
    case 'NotFound':
      return getNotFound();
    case 'StreamContentLengthMismatch':
      return getInternalError(API_ERROR.CONTENT_MISMATCH);
    case 'RequestAbortedError':
      return getInternalError('request aborted');
    default:
      return getCode(err.statusCode, err.message);
  }
}
