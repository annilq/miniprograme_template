// pages/doctor/doctor.ts
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
    queueNum: 0,
    unReadNewsNum: 0,
    treatmentTodayNum: 0,
    registrationNum: 0,
    connecting: false,
  },
  timer: 0,
  infoTimer: 0,
  homeDataTimer: 0,
  /*
   * 生命周期函数--监听页面加载
   */
  onLoad() {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getHomeData();
    this.getInfo();
  },

  goRegisPatients(e) {
    const type = e.currentTarget.dataset?.type;
    if (type) {
      wx.navigateTo({ url: `/pages/patients/registered?type=${type}` });
    } else {
      wx.navigateTo({ url: "/pages/patients/registered" });
    }
  },

  goHistoryPatients() {
    wx.navigateTo({ url: "/pages/patients/patients" });
  },

  goQueuePage() {
    const { connecting } = this.data;
    if (!connecting) {
      wx.showModal({
        title: "提示",
        content: "尚未开启接诊，是否开启视频接诊?",
        success: (res) => {
          if (res.confirm) {
            console.log("用户点击确定");
            this.setConnectStatus(0);
          }
        },
      });
      return;
    }
    wx.navigateTo({ url: "../queue/queue" });
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
        this.heart();
      } else if (type === 1) {
        this.setData({ connecting: false });
        clearTimeout(this.timer);
      }
    });
  },

  getInfo() {
    request<any>(user_info, {}, { showLoading: false }).then((data) => {
      if (data?.resp.online === 1) {
        this.setData({ connecting: true });
        this.heart();
      } else if (data?.resp.online === 2) {
        this.setData({ connecting: false });
        clearTimeout(this.timer);
      }
      this.infoTimer = setTimeout(this.getInfo, 15000);
    });
  },

  getHomeData() {
    const params = {
      deptId: app.globalData.userInfo?.deptId,
    };
    request<any>(home_data, params, { showLoading: false }).then((data) => {
      const {
        queueNum,
        unReadNewsNum,
        treatmentTodayNum,
        registrationNum,
      } = data.resp;
      this.setData({
        queueNum,
        unReadNewsNum,
        treatmentTodayNum,
        registrationNum,
      });
      this.homeDataTimer = setTimeout(this.getHomeData, 15000);
    });
  },

  heart() {
    request<any>(heart, {}, { showLoading: false }).then((data) => {
      console.log(data);
      this.timer = setTimeout(() => this.heart, 1000 * 60 * 3);
    });
  },

  getNoticeCount() {
    request<any>(notice_count, {}).then((data) => {
      console.log(data);
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    clearTimeout(this.timer);
    clearTimeout(this.homeDataTimer);
    clearTimeout(this.infoTimer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearTimeout(this.timer);
    clearTimeout(this.homeDataTimer);
    clearTimeout(this.infoTimer);
  },

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
