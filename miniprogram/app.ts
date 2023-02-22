// app.ts
import { showToast } from "~/utils/util";

App<IAppOption>({
  globalData: {
    systeminfo: wx.getSystemInfoSync(),
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync("logs") || [];
    logs.unshift(Date.now());
    wx.setStorageSync("logs", logs);
    // 检查版本更新
    this.checkVersion();
    this.listenNetwork();
  },
  listenNetwork() {
    wx.onNetworkStatusChange((res) => {
      console.error("network:" + res);

      this.globalData.isConnected = res.isConnected;
      if (!res.isConnected) {
        showToast("您的网络已断开,请重新联网");
      }
    });
  },
  onShow: function (options) {
    if (
      options.scene == 1007 ||
      options.scene == 1008 ||
      options.scene == 1035 ||
      options.scene == 1058 ||
      options.scene == 1011 ||
      options.scene == 1082 ||
      options.scene == 1014 ||
      options.scene == 1012 ||
      options.scene == 1043 ||
      options.scene == 1047 ||
      options.scene == 1048
    ) {
      // 公众号自定义菜单 || 公众号文章 || 扫码二维码 || 公众号会话下发的文字链 || 模版消息 || 扫描小程序码 || 长按图片识别二维码
      // 外部跳转到非启动页 (转发已设定进入启动页,无需处理)
      let pages = getCurrentPages();
      console.error("页面数 :" + pages.length);
      console.log(options);
    }
  },

  /**
   * 检查版本更新
   */
  checkVersion: function () {
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate)
      });

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: "更新提示",
          content: "发现新版本,是否现在更新?",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          },
        });
      });

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: "已经有新版本了哟~",
          content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~",
          showCancel: false,
        });
      });
    } else {
      wx.showModal({
        title: "提示",
        content:
          "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。",
      });
    }
  },

  /**
   * 判断双击事件
   */
  isFastDoubleClick: function () {
    let time = new Date().getTime();
    let timeD = time - this.globalData.lastClickTime;
    if (timeD > 0 && timeD < 500) {
      console.error("======== double click ==========");
      return true;
    }
    this.globalData.lastClickTime = time;
    return false;
  },

  // 登录
  getSetting(): Promise<any> {
    console.log("get code");
    return new Promise((resolve, reject) => {
      if (this.globalData.systeminfo.environment) {
        wx.qy.login({
          success: (res) => {
            resolve(res.code);
          },
        });
      } else {
        wx.showModal({
          title: "提示",
          content: "当前环境不是企业微信环境，退出小程序",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              wx.exitMiniProgram();
            }
          },
        });
      }
    });
  },
});
