// pages/my-wish/my-wish.js
var app = getApp()
import urlObj from '../../utils/url.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timeIcon: "../../resource/images/timeicon.png",
    headImg: "../../resource/images/nimingtouxiang.png",
    silvery: "../../resource/images/yinpai.png",
    gold: "../../resource/images/jinpai.png",
    imgUrls: [{ src: "../../resource/images/pai.png", text: "第一" }, { src: "../../resource/images/yinpai.png", text: "第二" }, { src: "../../resource/images/jinpai.png", text: "第二" }],
    leftSrc: "../../resource/images/zuo.png",
    rightSrc: "../../resource/images/you.png",
    closeImg: "../../resource/images/off-btn.png",
    currentIndex: 0,
    leftStatus: false,
    rightStatus: true,
    indicatorDots: true,
    indicatorColor: "#b9bfc9",
    indicatorColored: "#fff",
    autoplay: false,
    interval: 5000,
    duration: 1000,
    popStatus:false,
    pageStatus: false,
    pageNo: 1,
    pageSize: 20,
    hasMoreData: true,
    arrs: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("load")
    wx.showLoading({
      title: '加载中...',
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
    console.log("show")
    this.setData({
      pageNo:1,
      arrs:[]
    })
    this.getWishData();
  },
  getWishData: function () {  
    var self = this;
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/user/my_wish",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          page_no: self.data.pageNo,
          num: self.data.pageSize
        },
        dataType: "json",
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 0) {
            wx.hideLoading();
            if (res.data.data.length > 0) {
              self.setData({
                arrs: self.data.arrs.concat(res.data.data),
                pageNo:self.data.pageNo+1,
                hasMoreData:true
              })
            } else {
              self.data.hasMoreData = false;
            }
          }           
          //把幸运卡的选项存进全局变量里面
          app.globalData.cardData = res.data.data.wish_card_data
        }
      })
    })   
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
    this.onShow()
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    if (self.data.hasMoreData) {
      self.getWishData()
    } else {

    }
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
  getCard:function(){
    this.setData({
      popStatus:true
    })
  },
  colsePop:function(){
    this.setData({
      popStatus: false
    })
  },
  toMyWish: function () {
    this.setData({
      pageStatus: false
    });
    wx.navigateTo({
      url: '../my-wish/my-wish',
    })
    // wx.redirectTo({
    //   url: '../my-wish/my-wish',
    // })
  },
  toWishWall: function () {
    this.setData({
      pageStatus: true
    });
    // wx.
    var pageNum = getCurrentPages().length;
    if (pageNum==2){
      wx.navigateBack({
        delta:1
      })
    }else{
      wx.redirectTo({
        url: '../index/index',
      })
    }

    
  },
  toWishMes:function(e){
    var wishId=e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../wish-mes/wish-mes?id=' + wishId,
    })
  },
  splitByDate:function(d){
    var ret = [];
    var tmp_data = {};
    var self =this;
    var date;
    for (var i = 0; i < d.length; i++) {
      date = d[i].created.split(' ')[0];
      if (self.isEmptyObj(tmp_data)) {
        tmp_data[date] = [];
        tmp_data[date].push(d[i]);
        continue;
      }

      if (Object.keys(tmp_data)[0] == date) {
        tmp_data[date].push(d[i]);
      } else {
        ret.push(tmp_data);
        tmp_data = {};
        tmp_data[date] = [];
        tmp_data[date].push(d[i]);
      }
    }

    if (!self.isEmptyObj(tmp_data)) {
      ret.push(tmp_data);
    }
    // console.log(ret);
    return ret;
  },
  isEmptyObj:function(obj){
    return Object.keys(obj).length ? false : true;
  }
})