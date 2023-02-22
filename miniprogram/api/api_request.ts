import { showToast } from "~/utils/util";
import FormData from "./wx-formdata/formData.js";

const App = getApp() as IAppOption;

interface requestOptions {
  method?: "GET" | "POST";
  message?: string;
  showLoading?: boolean;
  header?: any;
}

export function request<T>(
  url: string,
  params = {},
  options: requestOptions = {
    message: "",
    showLoading: true,
    method: "POST",
    header: {},
  }
): Promise<YQResponse<T>> {
  const { message = "", method = "POST", showLoading = true, header } = options;
  const token = App.globalData.token;

  if (showLoading) {
    wx.showLoading({
      title: message,
      mask: true,
    });
  }

  console.log("request_url:" + url);
  const requestPromise = new Promise<YQResponse<T>>((resolve, reject) => {
    wx.request({
      url: url,
      data: params,
      header: {
        "content-Type": "application/json", // default
        token: token,
        from: "wxwork",
        ...header,
      },
      method: method,
      success: function (res: { statusCode: number; data: YQResponse<T> }) {
        console.log("response_success:" + JSON.stringify(res));
        if (res.statusCode === 200 && res.data) {
          if (res.data.code === 0) {
            // 成功
            try {
              resolve(res.data);
            } catch (error) {
              requestFail(error.message);
              reject(error);
            }
          } else if (res.data.code == 300 || res.data.code == 401) {
            // 身份过期,loading页面重登陆
            reject(res.data);
            wx.reLaunch({ url: "/pages/loading/loading" });
          } else {
            // 其他
            requestFail(res.data.info ? res.data.info : "操作异常");
            reject(res.data?.info || "操作异常");
          }
        } else if (
          res.statusCode == 502 ||
          res.statusCode == 403 ||
          res.statusCode == 503
        ) {
          // 502:错误的网关  403:服务器拒绝访问  503:服务器发版
          // 如断网提示（登录页面断网正常提示）
          let pages = getCurrentPages();
          let perpage = pages[pages.length - 1];
          let route = perpage.route;
          if (route != "pages/loading/loading") {
            wx.showModal({
              title: "温馨提示",
              content: "网络异常,请稍后再试",
              showCancel: false,
              confirmText: "刷新页面",
              success(res) {
                if (res.confirm) {
                  perpage.onLoad();
                }
              },
            });
          }
        } else {
          requestFail(res.data ? JSON.stringify(res.data) : "操作异常");
          reject(res.data?.info || "操作异常");
        }
      },
      fail: function (res) {
        console.error("response_fail:" + JSON.stringify(res));
        requestFail(res.data ? JSON.stringify(res.data) : "操作异常");
        reject(res.data?.info || "操作异常");
      },
      complete: function (res) {
        if (showLoading) {
          wx.hideLoading();
        }
      },
    });
  });

  return requestPromise;
}
export function requestFormData<T>(
  url: string,
  params: any = {},
  options: requestOptions = {
    message: "",
    showLoading: true,
    method: "POST",
    header: {},
  }
): Promise<YQResponse<T>> {
  let formData = new FormData();
  for (let key in params) {
    if (params.hasOwnProperty(key)) {
      formData.append(key, params[key]);
    }
  }
  const data = formData.getData();

  return request<T>(url, data.buffer, {
    ...options,
    header: {
      ...(options?.header && { ...options.header }),
      "content-type": data.contentType,
    },
  });
}

// 请求失败
function requestFail(errMsg: string) {
  showToast(errMsg);
}
