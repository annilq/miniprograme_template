// pages/personal/pages/my_orders/description_of_illness.js
import { message } from "@api/api";
import { request } from "@api/api_request";
import { showToast, formatFullDate } from "@utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    descrs: null,
    // 问诊表数据
    menopause: false, //第17题是否绝经
    sex: 1, //性别：1男，2女
    query: false, //是否是查询页面
    disabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date: formatFullDate(new Date()),
      orderNum: options.orderNum,
      patientId: options.patientId,
      type: options.type ? options.type : 0, //1：在线问诊过来的
      mode: options.mode ? options.mode : 0, //1：问卷不能填写
      tab: options.tab ? options.tab : 1 //1是病情信息，2是问诊表
    },
      () => {
        this.loadData1();
      });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  loadData1: function () {
    // 载入诊前描述
    request(
      message.descr, {
      orderNum: this.data.orderNum
    }).then( (data)=> {
      if (data.code == 0) {
        let list = data.resp;
        list.forEach(item => {
          item.imgs = item.img ? item.img.split(',') : []
          item.tongue = item.tongue ? item.tongue.split(',') : []
          item.face = item.face ? item.face.split(',') : []
        })
        this.setData({
          descrs: list
        })
      } else {
        wx.showModal({
          title: '消息',
          content: data.info,
        })
      }
    })
  },


})