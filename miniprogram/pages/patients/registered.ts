// pages/patients/registered.ts
import { registration } from "@api/api";
import { request } from "@api/api_request";
import { showToast } from "~/utils/util";
const app = getApp() as IAppOption;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    dataList: [],
    totalPage: 0,
    patients: {
      value: 0,
      options: [
        { label: "全部患者", value: 0 },
        { label: "问诊患者", value: 1 },
        { label: "复诊患者", value: 2 },
      ],
    },
    sorter: {
      value: 0,
      options: [
        { label: "全部状态", value: 0 },
        { label: "已接诊", value: 3 },
        { label: "未接诊", value: 1 },
      ],
    },
  },
  onPatientChange(e) {
    this.setData(
      {
        "patients.value": e.detail.value,
        page: 1,
      },
      this.loadData
    );
  },
  onStatusChange(e) {
    this.setData(
      {
        "sorter.value": e.detail.value,
        page: 1,
      },
      this.loadData
    );
  },
  loadData(append: boolean = false): Promise<any> {
    const { patients, sorter, pageNum } = this.data;
    const newparams = {
      scene: patients.value ? patients.value : undefined,
      treatmentStatus: sorter.value ? sorter.value : undefined,
      page: pageNum,
      size: 10,
    };
    this.setData({ loading: true });
    return request<any>(registration.pageList, newparams)
      .then((data) => {
        console.log(data);
        const newData = append
          ? this.data.dataList.concat(data?.resp.list)
          : data?.resp.list;
        this.setData({
          dataList: newData,
          totalPage: data?.resp.totalPage,
          loading: false,
        });
      })
      .catch((e) => {
        this.setData({ loading: false });
      });
  },
  goPersonDetail(e) {
    const item = e.currentTarget.dataset?.item;
    console.log(item);
    app.globalData.patientInfo = item;
    // 这里在url上面加参数以方便webview复用
    // type=quene只有视频问诊时候才显示问诊按钮
    wx.navigateTo({
      url: `/pages/personDetail/person?orderNum=${item.orderNum}&patientId=${item.patientId}`,
    });
  },
  sendNotice() {
    const deptCode = this.data.dataList[0].deptCode;
    wx.showModal({
      title: "提醒",
      content: "是否发送提醒?",
      success: (res) => {
        if (res.confirm) {
          request<any>(registration.sendMsgMass, { deptCode: deptCode }).then(
            (data) => {
              showToast(data?.info);
            }
          );
        }
      },
    });
  },
  sendMsg(e) {
    const orderNum = e.currentTarget.dataset.ordernum;
    wx.showModal({
      title: "提醒",
      content: "是否发送提醒?",
      success: (res) => {
        if (res.confirm) {
          request<any>(registration.sendMsg, { orderNum }).then((data) => {
            console.log(data);
            showToast(data?.info);
          });
        }
      },
    });
  },
  sendPaymentMessage(e) {
    const orderNum = e.currentTarget.dataset.ordernum;
    wx.showModal({
      title: "提醒",
      content: "是否发送提醒?",
      success: (res) => {
        if (res.confirm) {
          request<any>(registration.sendPaymentMessage, { orderNum }).then(
            (data) => {
              showToast(data?.info);
            }
          );
        }
      },
    });
  },
  goDesp(e) {
    const orderNum = e.currentTarget.dataset.ordernum;
    wx.navigateTo({
      url: `/pages/personDetail/description?orderNum=${orderNum}`,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    const type = parseInt(options.type, 10);
    this.setData(
      {
        "sorter.value": type || 0,
      },
      this.loadData
    );
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {},

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
  onPullDownRefresh() {
    this.loadData().then(wx.stopPullDownRefresh);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    const { totalPage, pageNum } = this.data;
    if (totalPage > pageNum) {
      this.setData(
        {
          pageNum: pageNum + 1,
        },
        () => this.loadData(true)
      );
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {},
});
