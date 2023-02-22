import { user_queue_refuse, get_registration_order } from '@api/api';
import { request, requestFormData } from '@api/api_request';
import { getQuerysString } from '@utils/util';
const app = getApp() as IAppOption
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: {},
    dialogShow: false,
    buttons: [{ text: '关闭' }],
  },
  showDialog: function (e) {
    this.setData({
      dialogShow: true
    })
  },
  tapDialogButton(e) {
    this.setData({
      dialogShow: false
    })
  },
  
  goDesp() {
    const orderNum = this.data.orderInfo.orderNum  
    wx.navigateTo({ url: `/pages/personDetail/description?orderNum=${orderNum}` })
  },
  goDetail() {
    const orderNum = this.data.orderInfo.orderNum  
    wx.navigateTo({ url: `/pages/message/detail/detail?orderNum=${orderNum}` })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.order(options)
  },

  refuseDialog() {
    wx.showModal({
      title: '提示',
      content: '是否确定拒绝接诊',
      success: (res) => {
        if (res.confirm) {
          this.refuse()
        }
      }
    })
  },

  order(options) {
    // type=quene||detail
    console.log(options.type);

    this.setData({ type: options.type || "detail" })
    const params = {
      orderNum: options?.orderNum,
      patientId: options?.patientId
    }
    request<any>(get_registration_order, params).then((data) => {
      console.log(data);
      this.setData({ orderInfo: data?.resp })
    })
  },
  refuse() {
    const data = app.globalData.patientInfo
    const params = {
      orderNum: data?.orderNum
    }
    requestFormData<any>(user_queue_refuse, params).then((data) => {
      console.log(data);
      wx.navigateBack()
    })
  },
  startVideo() {
    this.enterRoom(1)
  },
  startAudio() {
    this.enterRoom(2)
  },
  // 视频通话，语音通话
  enterRoom(appSence: 1 | 2) {
    const data = app.globalData.patientInfo
    const { videoCallSign, roomNum, videoSdkAppId, videoCallUser, patientName } = data!
    const orderInfo = this.data.orderInfo as PatientOrder
    const patientInfo = {
      cardNo: orderInfo.patientId,
      patientName: orderInfo.patientName,
      patientDoctorCode: orderInfo.doctorCode,
      patientDeptCode: orderInfo.deptCode,
      patientDoctorId: orderInfo.doctorId,
      orderNum: orderInfo.orderNum,
      clinicNo: orderInfo.clinicNo,
      patientAge: orderInfo.patientAge,
      patientGender: orderInfo.patientGender,
    }
    const treatParam = {
      sdkAppID: videoSdkAppId,
      userSig: videoCallSign,
      roomID: roomNum,
      userID: videoCallUser,
      appSence: appSence,
      // patientGender: orderInfo.patientGender ? "男" : "女",
      // scene: orderInfo.scene,
      // treatmentDescriptions: [],
      // detail: data
    }

    const qs = getQuerysString(treatParam)
    console.log(qs)
    const url = `../videocall/room/room${qs}`
    this.checkDeviceAuthorize().then(() => {
      console.log('授权成功')
      wx.navigateTo({ url })
    })
      .catch((error) => {
        console.log('没有授权', error)
      })
  },
  hasOpenDeviceAuthorizeModal: false,
  authorizeMic: false,
  authorizeCamera: false,
  checkDeviceAuthorize() {
    this.hasOpenDeviceAuthorizeModal = false
    return new Promise<any>((resolve, reject) => {
      if (!wx.getSetting || !wx.getSetting()) {
        // 微信测试版 获取授权API异常，目前只能即使没授权也可以通过
        resolve()
      }
      wx.getSetting().then((result) => {
        console.log('getSetting', result)
        this.authorizeMic = result.authSetting['scope.record']
        this.authorizeCamera = result.authSetting['scope.camera']
        if (result.authSetting['scope.camera'] && result.authSetting['scope.record']) {
          // 授权成功
          resolve()
        } else {
          // 没有授权，弹出授权窗口
          // 注意： wx.authorize 只有首次调用会弹框，之后调用只返回结果，如果没有授权需要自行弹框提示处理
          console.log('getSetting 没有授权，弹出授权窗口', result)
          wx.authorize({
            scope: 'scope.record',
          }).then((res) => {
            console.log('authorize mic', res)
            this.authorizeMic = true
            if (this.authorizeCamera) {
              resolve()
            }
          })
            .catch((error) => {
              console.log('authorize mic error', error)
              this.authorizeMic = false
            })
          wx.authorize({
            scope: 'scope.camera',
          }).then((res) => {
            console.log('authorize camera', res)
            this.authorizeCamera = true
            if (this.authorizeMic) {
              resolve()
            } else {
              this.openConfirm()
              reject(new Error('authorize fail'))
            }
          })
            .catch((error) => {
              console.log('authorize camera error', error)
              this.authorizeCamera = false
              this.openConfirm()
              reject(new Error('authorize fail'))
            })
        }
      })
    })
  },

  openConfirm() {
    if (this.hasOpenDeviceAuthorizeModal) {
      return
    }
    this.hasOpenDeviceAuthorizeModal = true
    return wx.showModal({
      content: '您没有打开麦克风和摄像头的权限，是否去设置打开？',
      confirmText: '确认',
      cancelText: '取消',
      success: (res) => {
        this.hasOpenDeviceAuthorizeModal = false
        console.log(res)
        // 点击“确认”时打开设置页面
        if (res.confirm) {
          console.log('用户点击确认')
          wx.openSetting({
            success: (res) => { },
          })
        } else {
          console.log('用户点击取消')
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})