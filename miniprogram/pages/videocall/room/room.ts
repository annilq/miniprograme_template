import { getDiffTimeFormat, randomRoomID } from "@utils/util";
import TRTC from "../../../static/trtc-wx";
import { requestFormData } from "@api/api_request";
import { user_queue_access, user_queue_in, user_queue_end } from "@api/api";
const app = getApp() as IAppOption;

Page({
  data: {
    _rtcConfig: {
      sdkAppID: "", // 必要参数 开通实时音视频服务创建应用后分配的 sdkAppID
      userID: "", // 必要参数 用户 ID 可以由您的帐号系统指定
      userSig: "", // 必要参数 身份签名，相当于登录密码的作用
    },
    pusher: null,
    playerList: [],
    // 通话时长
    timeString: "",
    // 当前排队人数
    onlineNum: 0,
    isEnterRoom: false,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log("room onload", options);
    wx.setKeepScreenOn({
      keepScreenOn: true,
    });
    this.TRTC = new TRTC(this);
    this.init(options);
    this.bindTRTCRoomEvent();
    this.enterRoom({ roomID: options.roomID });
  },
  onReady() {
    console.log("room ready");
  },
  onShow() {
    // const { isEnterRoom } = this.data
    // if (!isEnterRoom) {
    //   this.waitingTimer = setTimeout(this.waitingPatient, 10000)
    // }
    this.getLeaveNum();
  },
  onUnload() {
    console.log("room unload");
    clearTimeout(this.treatInTimer);
    clearTimeout(this.waitingTimer);
    clearTimeout(this.treatmentTimer);
    this.exitRoom();
  },
  init(options) {
    const pusherConfig = {
      beautyLevel: 9,
      // 1 视频
      // 2 语音
      enableCamera: options.appSence === "1" ? true : false,
      enableMic: true,
    };
    const pusher = this.TRTC.createPusher(pusherConfig);
    console.log(pusher.pusherAttributes, "000");
    this.setData({
      _rtcConfig: {
        userID: options.userID,
        sdkAppID: options.sdkAppID,
        userSig: options.userSig,
      },
      pusher: pusher.pusherAttributes,
    });
  },
  getLeaveNum() {
    const data = app.globalData.patientInfo;
    const params = {
      deptId: data?.deptId,
      doctorId: data?.doctorId,
    };
    requestFormData<any>(user_queue_end, params).then((data) => {
      if (data.code === 0) {
        this.setData({ onlineNum: data.resp });
      }
    });
  },

  enterRoom(options) {
    const roomID = options.roomID || randomRoomID();
    const config = Object.assign(this.data._rtcConfig, { roomID });
    this.setData(
      {
        pusher: this.TRTC.enterRoom(config),
      },
      () => {
        this.TRTC.getPusherInstance().start(); // 开始推流（autoPush的模式下不需要）
      }
    );
  },

  exitRoom() {
    const result = this.TRTC.exitRoom();
    this.setData({
      pusher: result.pusher,
      playerList: result.playerList,
    });
  },

  // 设置 pusher 属性
  setPusherAttributesHandler(options) {
    this.setData({
      pusher: this.TRTC.setPusherAttributes(options),
    });
  },

  // 设置某个 player 属性
  setPlayerAttributesHandler(player, options) {
    this.setData({
      playerList: this.TRTC.setPlayerAttributes(player.streamID, options),
    });
  },

  // 事件监听
  bindTRTCRoomEvent() {
    const TRTC_EVENT = this.TRTC.EVENT;
    // 初始化事件订阅
    this.TRTC.on(TRTC_EVENT.LOCAL_JOIN, (event) => {
      console.log("* room LOCAL_JOIN", event);
      // 进房成功，触发该事件后可以对本地视频和音频进行设置
      // this.setPusherAttributesHandler({ enableMic: true })
      this.startTreament();
    });
    this.TRTC.on(TRTC_EVENT.LOCAL_LEAVE, (event) => {
      // 退出房间后需要通知后台
      console.log("* room LOCAL_LEAVE", event);
    });
    this.TRTC.on(TRTC_EVENT.ERROR, (event) => {
      console.log("* room ERROR", event);
      wx.navigateBack();
    });
    // 远端用户退出
    this.TRTC.on(TRTC_EVENT.REMOTE_USER_LEAVE, (event) => {
      // 远端用户退出后，离开聊天室
      const { playerList } = event.data;
      this.setData({
        playerList: playerList,
      });
      console.log("* room REMOTE_USER_LEAVE", event);
      this.leaveRoom();
    });
    // 远端用户推送视频
    this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_ADD, (event) => {
      console.log("* room REMOTE_VIDEO_ADD", event);
      const { player } = event.data;
      // 开始播放远端的视频流，默认是不播放的
      this.setPlayerAttributesHandler(player, { muteVideo: false });
      // 患者已经进入诊室
      this.setData({ isEnterRoom: true }, () => {
        // 在这里添加通话时长逻辑
        this.treatmentTimeCount = 0;
        this.setTreatMentTime();
      });
      clearTimeout(this.waitingTimer);
    });
    // 远端用户取消推送视频
    this.TRTC.on(TRTC_EVENT.REMOTE_VIDEO_REMOVE, (event) => {
      console.log("* room REMOTE_VIDEO_REMOVE", event);
      const { player } = event.data;
      this.setPlayerAttributesHandler(player, { muteVideo: true });
    });
    // 远端用户推送音频
    this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_ADD, (event) => {
      console.log("* room REMOTE_AUDIO_ADD", event);
      const { player } = event.data;
      this.setPlayerAttributesHandler(player, { muteAudio: false });
    });
    // 远端用户取消推送音频
    this.TRTC.on(TRTC_EVENT.REMOTE_AUDIO_REMOVE, (event) => {
      console.log("* room REMOTE_AUDIO_REMOVE", event);
      const { player } = event.data;
      this.setPlayerAttributesHandler(player, { muteAudio: true });
    });
  },
  setTreatMentTime() {
    // 设置当前通话时长
    this.treatmentTimeCount++;
    const timeString = getDiffTimeFormat(this.treatmentTimeCount * 1000);
    this.setData({ timeString }, () => {
      this.treatmentTimer = setTimeout(() => {
        this.setTreatMentTime();
      }, 1000);
    });
  },
  // 离开房间
  leaveRoom() {
    // 1. 离开房间时候清除通话时长timer
    // 2. 提示患者离开房间
    this.treatmentTimeCount = 0;
    wx.showModal({
      title: "提示",
      content: "患者已经离开房间",
      confirmText: "知道了",
      showCancel: false,
      success: (res) => {
        if (res.confirm) {
          this.endTreatment();
        }
      },
    });
  },
  // 通知用户退出房间
  endTreatment() {
    const data = app.globalData.patientInfo;
    const params = {
      orderNum: data?.orderNum,
    };
    requestFormData<any>(user_queue_end, params).then((data) => {
      if (data.code === 0) {
        wx.navigateBack();
      }
    });
  },
  // 开始接诊
  startTreament() {
    const data = app.globalData.patientInfo;
    const params = {
      orderNum: data?.orderNum,
    };
    requestFormData<any>(user_queue_access, params)
      .then((data) => {
        if (data.code === 0) {
          // 通知服务器医生已经准备好，可以通知患者进入诊室
          this.treatInTimer = setTimeout(this.treatIn, 100);
          // 等待患者，每10秒钟提醒一次医生是否等待，如若提示超过30秒则强制退出
          this.waitingTimer = setTimeout(this.waitingPatient, 10000);
        }
      })
      .catch((e) => {
        wx.showModal({
          title: "提示",
          content: "进入诊疗失败，退出",
          showCancel: false,
          success: (res) => {
            if (res.confirm) {
              wx.navigateBack();
            }
          },
        });
      });
  },
  // 等待患者进入诊疗
  waitingTimer: 0,
  // 等待次数
  waitingCount: 0,
  // 通知患者进入诊疗
  treatInTimer: 0,
  // 当前通话时长
  treatmentTimer: 0,
  // 当前通话开始时间，用来显示通话时长
  treatmentTimeCount: 0,

  waitingPatient() {
    const { isEnterRoom } = this.data;
    if (!isEnterRoom || this.waitingCount < 30) {
      wx.showModal({
        title: "提示",
        content: "患者还未进入房间，是否继续等待，是否立即结束诊疗！",
        confirmText: "继续等待",
        cancelText: "结束",
        success: (res) => {
          if (res.confirm) {
            this.waitingCount++;
            // 继续等待
            this.waitingTimer = setTimeout(this.waitingPatient, 10000);
          } else {
            this.waitingCount = 0;
            // 有个疑问，患者还没有接受诊疗时候，是应该直接结束接诊还是应该挂断当前通话
            this.endTreatment();
          }
        },
      });
    } else if (this.waitingCount >= 30) {
      wx.showModal({
        title: "提示",
        content: "患者已经长时间未进入，退出诊疗室！",
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            this.waitingCount = 0;
            this.endTreatment();
          }
        },
      });
    }
  },

  // 通知患者进入房间
  treatIn() {
    const data = app.globalData.patientInfo;
    const params = {
      orderNum: data?.orderNum,
    };
    requestFormData<any>(user_queue_in, params).then((data) => {
      console.log(data);
    });
    // 患者可能退出房间或者不在房间，需要一直推送消息
    this.treatInTimer = setTimeout(this.treatIn, 8000);
  },

  // 是否订阅某一个player Audio
  _mutePlayerAudio(event) {
    const player = event.currentTarget.dataset.value;
    if (player.hasAudio && player.muteAudio) {
      this.setPlayerAttributesHandler(player, { muteAudio: false });
      return;
    }
    if (player.hasAudio && !player.muteAudio) {
      this.setPlayerAttributesHandler(player, { muteAudio: true });
      return;
    }
  },

  // 订阅 / 取消订阅某一个player Video
  _mutePlayerVideo(event) {
    const player = event.currentTarget.dataset.value;
    if (player.hasVideo && player.muteVideo) {
      this.setPlayerAttributesHandler(player, { muteVideo: false });
      return;
    }
    if (player.hasVideo && !player.muteVideo) {
      this.setPlayerAttributesHandler(player, { muteVideo: true });
      return;
    }
  },

  // 挂断退出房间
  _hangUp() {
    this.exitRoom();
    this.endTreatment()
    // wx.showModal({
    //   title: '提示',
    //   content: '您是否确定结束视频通话',
    //   success: (res) => {
    //     if (res.confirm) {
    //       this.exitRoom()
    //       wx.navigateBack({
    //         delta: 1,
    //       })
    //     }
    //   }
    // })
  },

  // 设置美颜
  _setPusherBeautyHandle() {
    const beautyLevel = this.data.pusher.beautyLevel === 0 ? 9 : 0;
    this.setPusherAttributesHandler({ beautyLevel });
  },

  // 发布 / 取消发布 Audio
  _pusherAudioHandler() {
    if (this.data.pusher.enableMic) {
      this.setPusherAttributesHandler({ enableMic: false });
    } else {
      this.setPusherAttributesHandler({ enableMic: true });
    }
  },

  _pusherSwitchCamera() {
    const frontCamera =
      this.data.pusher.frontCamera === "front" ? "back" : "front";
    this.TRTC.getPusherInstance().switchCamera(frontCamera);
  },

  _setPlayerSoundMode() {
    if (this.data.playerList.length === 0) {
      return;
    }
    const player = this.TRTC.getPlayerList();
    const soundMode = player[0].soundMode === "speaker" ? "ear" : "speaker";
    this.setPlayerAttributesHandler(player[0], { soundMode });
  },
  // 请保持跟 wxml 中绑定的事件名称一致
  _pusherStateChangeHandler(event) {
    this.TRTC.pusherEventHandler(event);
  },
  _pusherNetStatusHandler(event) {
    this.TRTC.pusherNetStatusHandler(event);
  },
  _pusherErrorHandler(event) {
    this.TRTC.pusherErrorHandler(event);
  },
  _pusherBGMStartHandler(event) {
    this.TRTC.pusherBGMStartHandler(event);
  },
  _pusherBGMProgressHandler(event) {
    this.TRTC.pusherBGMProgressHandler(event);
  },
  _pusherBGMCompleteHandler(event) {
    this.TRTC.pusherBGMCompleteHandler(event);
  },
  _pusherAudioVolumeNotify(event) {
    this.TRTC.pusherAudioVolumeNotify(event);
  },
  _playerStateChange(event) {
    this.TRTC.playerEventHandler(event);
  },
  _playerFullscreenChange(event) {
    this.TRTC.playerFullscreenChange(event);
  },
  _playerNetStatus(event) {
    this.TRTC.playerNetStatus(event);
  },
  _playerAudioVolumeNotify(event) {
    this.TRTC.playerAudioVolumeNotify(event);
  },
});
