//index.js
//获取应用实例
const app = getApp()
import urlObj from '../../utils/url.js';
Page({
  data: {
    arr:[1,2,3,4],
    imgSrc:"../../resource/images/banner.png",
    pageStatus:true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    

     
  },
  onShow:function(){
    var self = this;
      wx.request({
        url: urlObj.url.httpSrc + "/other/index",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          // 'Authorization': 'AppletToken ' + app.token
        },
        dataType: "json",
        success: function (res) {
          wx.hideLoading()
          self.setData({
            wallData: res.data.data.wish_wall_data,
          })
          //把幸运卡的选项存进全局变量里面
          app.globalData.cardData = res.data.data.wish_card_data
        }
      })

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  toMyWish:function(){
    this.setData({
      pageStatus:false
    });
    wx.navigateTo({
      url: '../my-wish/my-wish',
    })
  },
  toWishWall:function(){
    this.setData({
      pageStatus:true
    });
    wx.redirectTo({
      url: '../index/index',
    })
  },
  toWishList:function(opts){
    var id = opts.currentTarget.dataset.id;
    var index = opts.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../list-detail/list-detail?wish_wall_id=' + id + "&index=" + index
    })
  },
  onPullDownRefresh: function () {  
    this.onShow()
    wx.stopPullDownRefresh();
  },
  onShareAppMessage:function(){
    var self = this;
    return {
      title: '许愿灵',
      path: '/pages/index/index',
      success: function () {
      }
    } 
  }
})
