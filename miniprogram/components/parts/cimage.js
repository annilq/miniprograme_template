// pages/components/parts/cimage.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    src: {
      type: String,
      value: ''
    },
    list: {
      type: Array,
      value: []
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    loading: true,
    status: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 预览图片
    preview: function(e) {
      wx.previewImage({
        current: this.data.src,
        urls: this.data.list,
      })
    },

   // 加载完图片
    loadedImage: function(e){
      this.setData({
        loading: false,
        status: 0
      })
    },
    
    // 加载失败
    errorImage: function(e){
      this.setData({
        loading: false,
        status: 1 // 加载失败
      })
    }
  }
})