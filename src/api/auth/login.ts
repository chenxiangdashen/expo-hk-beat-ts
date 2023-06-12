import { http } from "@/utils/http/axios";
import { RequestEnum } from "@/enums/httpEnum";

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request({
    url: `/auth/login`,
    method: RequestEnum.GET,
    params,
  });
}

/**
 *   获取用户登录信息
 */

export function qryUserInfo() {
  return http.request({
    url: "/agt/login/qryLogInfo",
    method: RequestEnum.GET,
  });
}
