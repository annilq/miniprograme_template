// pages/online_hos/pages/diagnosis_and_treatment/order/book.js
import { request } from "@api/api_request";
import { message } from "@api/api";
import { shareMsg, showToast } from "@utils/util";

const maxImageSize = 10 * 1024 * 1024; // 10Mb
const pageSize = 5;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderNum: "",
    lastId: undefined,
    // 消息记录
    messageList: [],
    // 历史消息
    historyMessages: [],
    // 患者信息
    orderInfo: {},
    // 病例描述
    description: {},
    // 信息加载滚动位置
    messageSort: "",
    scrollHeight: 0,
    empty: 0,
    content: "加载历史消息",
    messageLoading: false,
    hasMore: true, // 是否有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData(
      {
        orderNum: options.orderNum,
      },
      () => {
        this.loadData();
        this.description();
        this.initMsg();
      }
    );
  },
  initMsg() {
    this.getMsg().then((data) => {
      console.log(data);
      this.setData({
        messageList: data, //留言消息
      });
    });
  },
  // 诊单信息查询
  loadData: function (): Promise<any> {
    const { orderNum } = this.data;
    const url = message.orderInfo;
    const req = {
      orderNum,
    };
    return request(url, req).then((data) => {
      console.log(data);
      this.setData({
        orderInfo: data.resp, //挂号单
      });
    });
  },

  // 患者：查询留言消息
  getMsg(lastId?: string) {
    const { orderNum } = this.data;
    return request<Message[]>(
      message.msgList,
      {
        orderNum: orderNum,
        lastId: lastId,
        size: pageSize,
      },
      { showLoading: false }
    ).then((data) => {
      // 修改时间
      let messageList = data.resp;
      messageList = messageList.sort((a, b) => parseInt(a.id) - parseInt(b.id));
      return [...messageList];
    });
  },
  // 查询病情描述信息
  description() {
    const { orderNum } = this.data;
    request<any>(message.descr, {
      orderNum,
    }).then((data) => {
      console.log(data?.resp);
      let description = "";
      var imgLength = 0;
      if (data?.resp.length > 0) {
        data?.resp.forEach((item) => {
          item.imgs = item.img ? item.img.split(",") : [];
          imgLength += item.imgs.length;
          description += item.description;
        });
      }

      this.setData({
        description: description ? description : "暂无病情描述", //病情描述图片数量
        imgLength: imgLength ? imgLength : 0, //病情描述文字
        treatmentDescriptionVos: data.resp, //病情描述
      });
    });
  },
  // 上拉显示更多留言
  getHistoryMsg: function () {
    console.log("get history");
    if (this.data.hasMore) {
      let lastId;
      if (this.data.historyMessages.length > 0) {
        lastId = this.data.historyMessages[0].id;
      } else {
        lastId = this.data.messageList[0].id;
      }
      this.getMsg(lastId).then((data) => {
        const historyMessages = this.data.historyMessages
          ? data.concat(this.data.historyMessages)
          : data; //留言消息
        this.setData({
          historyMessages, //留言消息历史
          hasMore: data.length >= pageSize ? true : false,
          messageSort: data[0]?.id,
        });
      });
    }
  },

  // 预览图片
  preview: function (e) {
    wx.previewImage({
      current: e.currentTarget.dataset.src,
      // urls:[ this.data.imgUrl],
      urls: [e.currentTarget.dataset.src],
    });
  },
  //留言输入框实时获取数据
  messageInput: function (e) {
    this.setData({
      message: e.detail.value,
    });
  },

  // 失败消息重新发送
  repeat(e) {
    let list = this.data.messageList;
    let detail = e.currentTarget.dataset.detail;
    const msg: Message = list.find((item) => item.id == detail.id)!;
    this.send(msg.content, msg.contentType);
  },

  // 发送留言
  send: function (msg: string, contentType: Message["contentType"]) {
    let content;
    if (contentType == 2) {
      content = msg;
    } else if (contentType == 1) {
      content = msg;
    } else {
      // 发送按钮触发
      content = this.data.message;
    }

    // 先把数据放上去
    let messageList = this.data.messageList;

    let data = [
      {
        id: messageList
          ? parseInt(messageList[messageList.length - 1].id) + 1
          : 1,
        contentType: contentType || 1,
        senderType: 2,
        sendTime: Date.now(),
        content,
        fail: false,
      },
    ];
    this.setData({
      messageList: this.data.messageList
        ? this.data.messageList.concat(data)
        : data,
      messageSort: data[0].id,
      message: "",
      messageLoading: true,
    });

    let req = {
      content: content,
      contentType: contentType == 2 ? contentType : 1,
      orderNum: this.data.orderInfo.orderNum,
      patientName: this.data.orderInfo.patientName,
    };
    return request(message.send, req, { showLoading: false })
      .then((data) => {
        console.log(data);
        if (data.code == 0) {
          this.setData({
            messageLoading: false,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        // 发送失败标识
        var index =
          "messageList[" + (this.data.messageList.length - 1) + "].fail";
        this.setData({
          [index]: true,
          messageLoading: false,
        });
      });
  },

  /**
   * 是否订阅
   */
  subscribeMessage() {
    if (getApp().isFastDoubleClick()) return;
    getApp().getSubscribeMessage(
      this,
      ["okQQLRu7KGefDclBJtOzRFeRaTEqoTk59B9jNsnv7BI"],
      false
    );
    // this.messageLoad()
  },

  // 选择上传文件
  onChooseImage: function () {
    wx.chooseImage({
      count: 9,
      success: (res) => {
        let filePaths = res.tempFiles;
        console.log(filePaths);
        let uploadCount = 0;

        filePaths.forEach((file) => {
          if (file.size > maxImageSize) return;
          uploadCount++;
          let item = {
            src: file.path,
            uploading: true,
          };
          // attachImages.push(item)

          // 上传图片
          wx.uploadFile({
            url: message.zl_uploadPicture,
            filePath: file.path,
            name: "file",
            header: {
              "Content-Type": "multipart/form-data",
              token: getApp().globalData.token,
            },
            formData: {},
            success(res) {
              item.uploading = false;
              this.send(JSON.parse(res.data).resp, 2);
            },
          });
        });

        if (uploadCount != filePaths.length) {
          showToast(
            `检测到有${filePaths.length - uploadCount}张图片超出${
              maxImageSize / (1024 * 1024)
            }Mb的限制，已自动剔除`
          );
        }

        // that.setData({
        //   attachImages: attachImages
        // });
      },
      fail: function (res) {},
      complete: function (res) {},
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getNewMsg();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  start_timer: 0,
  onHide: function () {
    clearInterval(this.start_timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.start_timer);
  },

  getNewMsg() {
    this.start_timer = setInterval(() => {
      this.getMsg().then((data) => {
        const { messageList } = this.data;
        console.log(messageList);
        // 只读取留言消息
        const leaveMsg = data
          .filter((item) => item.senderType === 1)
          .sort((a, b) => parseInt(a.id) - parseInt(b.id));
        const messages = messageList.filter((o) => o.senderType == 1); // 当前已载入的数据（并且仅获取患者的留言）
        const compareData = messages.slice(0 - leaveMsg.length); // 获取需要对比的数据
        const cpIds = compareData.map((o) => o.id); // 获取到需要对比的id
        const newMsg = leaveMsg.filter((o) => !cpIds.includes(o.id)); // 获取到未加载的数据
        this.setData({
          messageList: messageList.concat(newMsg),
          messageSort: newMsg[newMsg.length - 1]?.id,
        });
      });
    }, 3000);
  },

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
  onShareAppMessage: function () {
    return shareMsg;
  },
});
