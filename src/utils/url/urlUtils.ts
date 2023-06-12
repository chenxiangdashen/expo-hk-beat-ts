/**
 * 将对象添加当作参数拼接到URL上面
 * @param baseUrl 需要拼接的url
 * @param obj 参数对象
 * @returns {string} 拼接后的对象
 * 例子:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: object): string {
  let parameters = '';
  let url = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  if (/\?$/.test(baseUrl)) {
    url = baseUrl + parameters;
  } else {
    url = baseUrl.replace(/\/?$/, '?') + parameters;
  }
  return url;
}

/**
 * 过滤不必要的请求参数
 *
 * @param {object} param
 * @return {object}
 */
export function filterParam(param) {
  const flag = typeof param === 'object';
  const obj = flag ? {} : param;
  if (flag) {
    const keys = Object.keys(param);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (param[key] === undefined || param[key] === null || param[key] === '') {
        // 过滤这一部分参数
      } else {
        obj[key] = param[key];
      }
    }
  }
  return obj;
}
