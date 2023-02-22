// pages/person/login/login.js
import { showToast, trim } from "@utils/util";
import { wxId } from "~/api/config";
import { home_data } from "@api/api";
import { request } from "@api/api_request";
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickTime: false,
    account: "",
    password: "",
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (wx.getUserProfile) {
      wx.login({
        success: res => {
          app.globalData.code = res.code
          this.setData({
            canIUseGetUserProfile: true
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 以前没有登录过需要授权然后登录
  submit(e) {
    if (getApp().isFastDoubleClick()) return;
    let self = this
    wx.showLoading({
      title: '正在加载',
    })
    const {
      account,
      password,
    } = this.data
    if (!trim(account)) {
      showToast("请输入账号")
      return
    } else if (!trim(password)) {
      showToast("请输入密码")
      return
    }
    this.setData({
      clickTime: true
    }, () => {
      wx.login({
        success: res => {
          let req = {
            code: res.code,
            wxId: wxId,
            account,
            password,
          }

          // request(Api.userInfo.accountBind, req, "POST", "正在加载", function (data) {
          //   // 上传身份信息
          //   app.globalData.userInfo = data.resp;
          //   app.globalData.token = data.resp.token;
          //   wx.hideLoading();
          //   if (data.resp.employeeId) {
          //     wx.switchTab({
          //       url: '/pages/home/home',
          //     })
          //   }
          // }, function (data) {
          //   showToast(data.info)
          //   self.setData({
          //     clickTime: false
          //   })
          // })
        }
      })
    })
  },
})