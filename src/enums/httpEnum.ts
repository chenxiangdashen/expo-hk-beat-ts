/**
import { RequestEnum } from '@/enums/httpEnum';
 * @description: 请求结果集
 */
export enum ResultEnum {
  SUCCESS = 200,
  SUCCESS_STR = '200',
  TOKEN_ERROR = '401',
  ERROR = -1,
  TIMEOUT = 10042,
  TYPE = 'success',
}

/**
 * @description: 请求方法
 */
export enum RequestEnum {
  GET = 'GET',
  POST = 'POST',
  PATCH = 'PATCH',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

/**
 * @description:  常用的contentTyp类型
 */
export enum ContentTypeEnum {
  // json
  JSON = 'application/json;charset=UTF-8',
  // json
  TEXT = 'text/plain;charset=UTF-8',
  // form-data 一般配合qs
  FORM_URLENCODED = 'application/x-www-form-urlencoded;charset=UTF-8',
  // form-data  上传
  FORM_DATA = 'multipart/form-data;charset=UTF-8',
  // 服务版本
  REQUEST_VERSION = '0.0.1',
  // 运营平台  报文头
  TENANT_ID = '000000',
  AUTHORIZATION = 'Basic YWdlbnRwYzphZ2VudHBjX3NlY3JldA==',
}

/**
 *  图片请求 base64头
 */
export enum RequestImageEnum {
  BASE64 = 'data:image/png;base64,',
}
