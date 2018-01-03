// pages/to-wish/to-wish.js
const app = getApp()
import urlObj from '../../utils/url.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [{ src: "../../resource/images/pai.png", text: "第一" }, { src: "../../resource/images/yinpai.png", text: "第二" }, { src: "../../resource/images/jinpai.png", text: "第三" }],
    active: false,
    leftSrc: "../../resource/images/zuo.png",
    rightSrc: "../../resource/images/you.png",
    nmIcon: "../../resource/images/check.png",
    nmStatus: 0,
    textNum: 0,
    currentIndex: 0,
    leftStatus: false,
    rightStatus: true,
    indicatorDots: true,
    indicatorColor: "#b9bfc9",
    indicatorColored: "#fff",
    autoplay: false
    // interval: 5000,
    // duration: 1000
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    var id = opts.id;
    this.id = id;
    this.setData({
      cardData: app.globalData.cardData,
      wallData: app.globalData.wallData,
      // wallDataIndex: opts.wallDataIndex
      wallContent: opts.wallContent
    })
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
      wx.hideLoading()
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
  next: function () {
    var self = this;
    this.setData({
      currentIndex: self.data.currentIndex + 1,
      leftStatus: true
    })
    if (self.data.currentIndex == this.data.imgUrls.length - 1) {
      this.setData({
        rightStatus: false,
      })
    } else {
      this.setData({
        rightStatus: true,

      })
    }


  },
  last: function () {
    var self = this;
    this.setData({
      currentIndex: self.data.currentIndex - 1,
      rightStatus: true
    })
    if (self.data.currentIndex == 0) {
      this.setData({
        leftStatus: false
      })
    } else {
      this.setData({
        leftStatus: true
      })
    }
  },
  textConfirm: function (e) {
    var self = this;
    var val = e.detail.value.replace(/(^\s*)|(\s*$)/g, "")
    console.log(val + "长度：" + val.length + "状态" + !val)
    if (val.length==0) {
      // return false
      self.setData({
        textNum: val.length,
        content: val,
        active: false
      })
    }else{
      self.setData({
        textNum: val.length,
        content: val,
        active: true
      })
      }
  },
  changNm: function (opts) {
    var nmStatus = opts.currentTarget.dataset.status;
    // nmStatus ? this.data.nmStatus = false : this.data.nmStatus=true;
    if (nmStatus == 1) {
      this.setData({
        nmIcon: "../../resource/images/check.png",
        nmStatus: 0
      })
    } else {
      this.setData({
        nmIcon: "../../resource/images/checked.png",
        nmStatus: 1
      })
    }
  },
  addWish: function () {
    var self = this;
    if (this.data.currentIndex == 0) {
      app.getToken(function (token) {
        wx.request({
          url: urlObj.url.httpSrc + "/other/add_wish",
          method: "POST",
          header: {
            // "Content-Type": "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
            'Authorization': 'AppletToken ' + token
          },
          data: {
            content: self.data.content,
            wish_wall_id: self.id,
            anonymity: self.data.nmStatus
          },
          dataType: "json",
          success: function (res) {
            if (res.data.code == 0) {
              var id = res.data.data.id;
              wx.navigateTo({
                url: '../look-wish/look-wish?id=' + id,
              })
              // wx.redirectTo({
              //   url: '../look-wish/look-wish?id=' + id,
              // })
            }
          }
        })
      })
    } else {
      var index = self.data.currentIndex-1
      wx.redirectTo({
        url: '../wx-pay/wx-pay?id=' + this.id + "&cardId=" + self.data.cardData[index].id + "&nmStatus=" + self.data.nmStatus + "&content=" + self.data.content,
      })
    }

  },
  swiperChange:function(e){
    var self = this;
    this.setData({
      currentIndex: e.detail.current
    })
    this.arrComfirm()
  },
  arrComfirm:function(){
    var self = this;
    if (self.data.currentIndex > 1) {
      this.setData({
        rightStatus: false,
      })
    } else if (self.data.currentIndex < 1) {
      this.setData({
        leftStatus: false
      })
    }else{
      this.setData({
        leftStatus: true,
        rightStatus: true,
      })
    }
  }

})