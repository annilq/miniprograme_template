// pages/setting/user.ts
import {
  heart,
  notice_count,
  home_data,
  user_info,
  user_set_status,
} from "@api/api";
import { request, requestFormData } from "@api/api_request";

const app = getApp() as IAppOption;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    connecting: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.setData({
      userInfo: app.globalData.userInfo,
      version: wx.getAccountInfoSync().miniProgram.version,
    });
  },
  switchStatus() {
    wx.showActionSheet({
      itemList: ["接诊中", "暂停接诊"],
      success: (res) => {
        this.setConnectStatus(res.tapIndex);
      },
    });
  },

  setConnectStatus(type: number) {
    const { connecting } = this.data;
    if ((type === 0 && connecting) || (type === 1 && !connecting)) {
      return;
    }
    const params = {
      onlineStatus: type === 0 ? 1 : 2,
    };
    requestFormData<any>(user_set_status, params).then((data) => {
      console.log(data);
      if (type === 0) {
        this.setData({ connecting: true });
      } else if (type === 1) {
        this.setData({ connecting: false });
      }
    });
  },
  infoTimer: 0,
  getInfo() {
    request<any>(user_info, {}, { showLoading: false }).then((data) => {
      if (data?.resp.online === 1) {
        this.setData({ connecting: true });
      } else if (data?.resp.online === 2) {
        this.setData({ connecting: false });
      }
      this.infoTimer = setTimeout(this.getInfo, 15000);
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
export {};
