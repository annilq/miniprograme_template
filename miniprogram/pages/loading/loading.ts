// pages/person/person.js
import { user_set_dept, login, userBind } from "@api/api";
import { request } from "@api/api_request";

const app = getApp() as IAppOption;
console.log(app.globalData.systeminfo);

Page({
  /**
   * 页面的初始数据
   */
  data: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    // this.loadData();
  },

  onShow: function () {
    app.getSetting().then((code) => {
      console.log(code);
      request<any>(login, { code }).then((data) => {
        console.log(data);
        if (data.resp.loginStatus === 4) {
          wx.showModal({
            title: "请输入工号",
            content: "",
            showCancel: false,
            editable: true,
            placeholderText: "请输入工号",
            success: (res) => {
              if (res.confirm) {
                request<any>(userBind, {
                  doctorCode: res.content,
                  doctorName: data.resp?.doctorName,
                  qywxUserId: data.resp?.qywxUserId,
                })
                  .then((data) => {
                    app.globalData.token = data?.resp.token;
                    this.loadData();
                  })
                  .catch((e) => {
                    console.log(e);
                    wx.showModal({
                      title: "提示",
                      content: e.info,
                      showCancel: false,
                      success: function (res) {
                        if (res.confirm) {
                          wx.reLaunch({ url: "/pages/loading/loading" });
                        }
                      },
                    });
                  });
              }
            },
          });
        } else {
          app.globalData.token = data?.resp.token;
          this.loadData();
        }
      }).catch(errMsg=>{
        wx.showModal({
          title: "提示",
          content: errMsg,
          showCancel: false,
        });
      });
    });
  },

  // 列表
  loadData: function () {
    this.getDept().then((data) => {
      app.globalData.userInfo = data.resp[0];
      wx.switchTab({
        url: "/pages/doctor/doctor",
      });
    });
  },

  getDept() {
    return request<any>(user_set_dept, {}, { method: "GET" });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
