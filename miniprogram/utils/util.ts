import { configUrl } from "../api/config"

//信息弹出框
export const showToast = (n: string) => {
  wx.showToast({
    title: n,
    icon: 'none',
    duration: 3000
  })
  return false
}

//确定信息弹出框
export const showModal = (n: string) => {
  wx.showModal({
    title: '提示',
    content: n,
    showCancel: false,
    confirmText: '确定',
  })
  return false
}

//加载弹出框
export const showLoading = (n: string) => {
  wx.showLoading({
    title: n,
    mask: true
  })
  return false
}

// 输入框去空格
export const trim = (str: string) => {
  if (str) {
    str = str.replace(/\s+/g, "");
  }
  return str;
}

/**
 * 验证身份证(15位/18位)
 */
export const isIDCard = (idCardNo: string) => {
  let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return reg.test(idCardNo);
}

/**
 * 验证手机号 (简单)
 */
export const isMobileSimple = (mobile: string) => {
  let reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  return reg.test(mobile)
}

// 数据统计页面图表数据格式化
export const chartsFormat = (str: string) => {
  if (!str || str.length == 0) return str
  if (str) {
    var detail = str.map(item => {
      return item.orderCompleteNum
    })
  }
  return detail ? detail : str;
}

/***
 * data:要转换的字符串
 * symbol：隔开的符号 ，默认为逗号
 */

export const dateFmt = function (date, fmt: string) {
  if (!date) {
    return
  }
  if (typeof date == "string") {
    date = date.replace(/-/g, "/")
  }
  date = new Date(date);
  fmt = fmt || "yyyy-MM-dd";
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
export const formatFullDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}
export const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
// 截取字符串的前多少个字并加入省略号(data:字符串，截取数量)
export const valueSubstring = (data, num) => {
  const value = data.length > num ? data.substring(0, num) + '...' : data
  return value;
}

// 图片域名处理
export const urlIpFormat = function (value) {
  if (!value) return;
  return value.substring(0, 4) == 'http' ? value : configUrl + value;
}

export const shareMsg = {
  title: '“互联网+”智慧医疗，让看病变得更便捷',
  path: "/pages/loading/loading",
}
export function randomUserID() {
  return new Date().getTime().toString(16).split('').reverse().join('')
}
export function randomRoomID() {
  return parseInt(Math.random() * 9999)
}
export function getQuerysString(params: any) {
  const qs =
    '?' +
    Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
  return qs
}

export function getDiffTimeFormat(timediff) {

  let totalTime = timediff / 1000;//秒
  let hour = 0, minute = 0, second = 0;

  if (3600 <= totalTime) {
    hour = Math.floor(totalTime / 3600);
    totalTime = totalTime - 3600 * hour;
  }
  if (60 <= totalTime) {
    minute = Math.floor(totalTime / 60);
    totalTime = totalTime - 60 * minute;
  }
  if (0 <= totalTime) {
    second = totalTime;
  }
  let sb = "";

  if (hour < 10) {
    sb = sb + "0" + hour + ":";
  } else {
    sb = sb + hour + ":";
  }
  if (minute < 10) {
    sb = sb + "0" + minute + ":";
  } else {
    sb = sb + minute + ":";
  }
  if (second < 10) {
    sb = sb + "0" + second;
  } else {
    sb = sb + second;
  }
  return sb;
}