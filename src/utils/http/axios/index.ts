// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
import { VAxios } from "./Axios";
import { AxiosTransform } from "./axiosTransform";
import axios, { AxiosResponse } from "axios";
import { checkStatus } from "./checkStatus";
import { formatRequestDate, joinTimestamp } from "./helper";
import { ContentTypeEnum, RequestEnum, ResultEnum } from "@/enums/httpEnum";

import { isString } from "../../is";

import { CreateAxiosOptions, RequestOptions, Result } from "./types";
import { cleanObj, deepMerge } from "@/utils";
import store from "@/store";
import {resetToken} from "@/store/features/auth/UserInfoSlice";
/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestData: (
    res: AxiosResponse<Result>,
    options: RequestOptions
  ) => {
    const {
      isShowMessage = true,
      isShowErrorMessage,
      isShowSuccessMessage,
      successMessageText,
      errorMessageText,
      isTransformResponse,
      isReturnNativeResponse,
    } = options;

    // 是否返回原生响应头 比如：需要获取响应头时使用该属性
    if (isReturnNativeResponse) {
      return res;
    }
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }

    const { data } = res;

    if (!data) {
      // return '[HTTP] Request has no return value';
      throw new Error("请求出错，请稍候重试");
    }
    //  这里 code，result，message为 后台统一的字段，需要修改为项目自己的接口返回格式
    const { code, data: result, message }: any = data;
    console.log("data---->", data);
    // 请求成功 code === 200  或者 msg === 'success' 为了兼容后端返回的数据格式
    const hasSuccess =
      code === ResultEnum.SUCCESS || code === ResultEnum.SUCCESS_STR;

    // 接口请求成功，直接返回结果
    if (hasSuccess) {
      return result;
    }

    console.log("data---->", message);
    // 接口请求错误，统一提示错误信息 这里逻辑可以根据项目进行修改
    let errorMsg = message || "请求出错，请稍候重试";
    switch (code) {
      // 请求失败
      case ResultEnum.ERROR:
        break;
      // 登录超时
      case ResultEnum.TIMEOUT:
        break;
      case ResultEnum.TOKEN_ERROR:
        store.dispatch(resetToken())
        break;
    }
    throw new Error(errorMsg);
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const {
      apiUrl,
      joinPrefix,
      joinParamsToUrl,
      formatDate,
      joinTime = true,
      urlPrefix,
      isCleanObj = true,
    } = options;
    console.log(options);
    config.url = `http://106.14.171.53:8008/web-app-agt${config.url}`;
    // 通过options参数
    const params = (isCleanObj ? cleanObj(config.params) : config.params) || {};
    const data = config.data || {};
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(
          params || {},
          joinTimestamp(joinTime, false)
        );
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      formatDate && formatRequestDate(params);
      if (
        Reflect.has(config, "data") &&
        config.data &&
        Object.keys(config.data).length > 0
      ) {
        config.data = data;
        config.params = params;
      } else {
        config.data = params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    // 请求之前处理config
    const { userInfo } = store.getState();
    const token = userInfo.token;
    // const token = useAppSelector((state) => state.userInfo.token);
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers["ticket"] = options.authenticationScheme
        ? `${options.authenticationScheme} ${token}`
        : token;
    }
    return config;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message } = error || {};
    // TODO 此处要根据后端接口返回格式修改
    const msg: string =
      response && response.data && response.data.msg ? response.data.msg : "";
    const error_description: string =
      response && response.data && response.data.error_description
        ? response.data.error_description
        : "";
    const err: string = error.toString();
    try {
      if (code === "ECONNABORTED" && message.indexOf("timeout") !== -1) {
        return;
      }
      // 401 未登录 跳转登录页
      if (response && response.status === ResultEnum.TOKEN_ERROR) {
        // toLogin();

        return Promise.reject(error);
      }
      if (err && err.includes("Network Error")) {
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as any);
    }
    // 请求是否被取消
    const isCancel = axios.isCancel(error);
    if (!isCancel) {
      checkStatus(
        error.response && error.response.status,
        msg,
        error_description
      );
    } else {
      console.warn(error, "请求被取消！");
    }
    //return Promise.reject(error);
    return Promise.reject(response?.data);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: 10 * 1000,
        authenticationScheme: "",
        // 接口前缀
        apiUrl: "http://106.14.171.53:8008/web-app-agt",
        headers: {
          "Content-Type": ContentTypeEnum.JSON,
          requestVersion: ContentTypeEnum.REQUEST_VERSION,
        },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: "none",
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
        },
        withCredentials: false,
      },
      opt || {}
    )
  );
}

export const http = createAxios();

// 项目，多个不同 api 地址，直接在这里导出多个
// src/api ts 里面接口，就可以单独使用这个请求，
// import { httpTwo } from '@/utils/http/axios'
// export const httpTwo = createAxios({
//   requestOptions: {
//     apiUrl: 'http://localhost:9001',
//     urlPrefix: 'api',
//   },
// });
