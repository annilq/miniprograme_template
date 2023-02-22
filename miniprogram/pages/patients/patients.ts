// pages/patients/registered.ts
import { history } from "@api/api";
import { request } from "@api/api_request";
import dayjs from "dayjs";
const app = getApp() as IAppOption;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    searchValue: "",
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
        { label: "全部日期", value: 0 },
        { label: "今日", value: 1 },
        { label: "本周", value: 2 },
        { label: "本月", value: 3 },
        { label: "三个月内", value: 4 },
        { label: "半年内", value: 5 },
        { label: "一年内", value: 6 },
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
  submit(e) {
    this.setData(
      {
        page: 1,
      },
      this.loadData
    );
  },
  cancel() {
    this.setData(
      {
        searchValue: "",
        page: 1,
      },
      this.loadData
    );
  },
  getDateParams(type: number): any {
    let startDate, endDate;
    switch (type) {
      case 1:
        [startDate, endDate] = [
          dayjs().format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ];
        break;
      case 2:
        [startDate, endDate] = [
          dayjs().startOf("week").format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ];
        break;
      case 3:
        [startDate, endDate] = [
          dayjs().startOf("month").format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ];
        break;
      case 4:
        [startDate, endDate] = [
          dayjs().subtract(3, "months").format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ];
        break;
      case 5:
        [startDate, endDate] = [
          dayjs().subtract(6, "months").format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ];
        break;
      case 6:
        [startDate, endDate] = [
          dayjs().subtract(1, "year").format("YYYY-MM-DD"),
          dayjs().format("YYYY-MM-DD"),
        ];
        break;
      default:
        break;
    }
    return {
      startDate,
      endDate,
    };
  },

  loadData(append: boolean = false): Promise<any> {
    const { patients, sorter, pageNum, searchValue } = this.data;
    const newparams = {
      scene: patients.value ? patients.value : undefined,
      ...(sorter.value !== 0 && this.getDateParams(sorter.value)),
      search: searchValue,
      page: pageNum,
      size: 10,
    };
    this.setData({ loading: true });

    return request<any>(history.pageList, newparams)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    this.loadData();
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
