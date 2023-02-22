// pages/queue/queue.ts
import { user_set_status, user_queue_list, user_info } from "@api/api";
import { request, requestFormData } from "@api/api_request";
import { showToast } from "@utils/util";
const app = getApp() as IAppOption;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    type: "",
  },
  timer: 0,
  /**
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
    this.getUserList();
    this.getInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  getUserList: function () {
    let req = {
      deptId: app.globalData.userInfo?.deptId,
    };
    requestFormData<any>(user_queue_list, req, { showLoading: false }).then(
      (data) => {
        const users = data.resp;
        this.setData(
          {
            dataList: users,
          },
          () => {
            this.timer = setTimeout(this.getUserList, 8000);
          }
        );
      }
    );
  },
  goPersonDetail(e) {
    const item = e.currentTarget.dataset?.item;
    console.log(item);
    app.globalData.patientInfo = item;
    // 这里在url上面加参数以方便webview复用
    // type=quene只有视频问诊时候才显示问诊按钮
    wx.navigateTo({
      url: `/pages/personDetail/person?orderNum=${item.orderNum}&patientId=${item.patientId}&type=quene`,
    });
  },
  stop() {
    wx.showModal({
      title: "提示",
      content: "您确定要关闭接诊吗",
      success: (res) => {
        if (res.confirm) {
          this.setConnectStatus();
        }
      },
    });
  },

  setConnectStatus() {
    const params = {
      onlineStatus: 2,
    };
    requestFormData<any>(user_set_status, params).then((data) => {
      console.log(data);
      wx.navigateBack();
    });
  },

  getInfo() {
    request<any>(user_info, {}).then((data) => {
      if (data?.resp.online !== 1) {
        showToast("尚未开始接诊!");
        wx.navigateBack();
      }
    });
  },
  onHide() {
    clearTimeout(this.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    clearTimeout(this.timer);
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
