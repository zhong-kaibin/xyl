// pages/list-detail/list-detail.js
const app = getApp()
import urlObj from '../../utils/url.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgSrc: "../../resource/images/banner.png",
    jinpai: "../../resource/images/jinpai.png",
    blessStatus:false,
    pageNo:1,
    pageSize:20,
    hasMoreData:true,
    arrs:[]

  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    wx.showLoading({
      title: '正在加载...',
    })
    var self = this;   
    var id = opts.wish_wall_id;
    this.id = id;
    // self.setData({
    //   wallDataIndex: opts.index
    // })           
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
    var self = this;
    this.getWishData();
    this.setData({
      pageNo:1
    })
  },
  getWishData:function(){  
    var self = this;
    wx.request({
      url: urlObj.url.httpSrc + "/other/wish_list?wish_wall_id=" + self.id,
      method: "GET",
      header: {
        "Content-Type": "application/json",
        'Authorization': 'AppletToken ' +app.token
      },
      data: {
        page_no: self.data.pageNo,
        num: self.data.pageSize
      },
      dataType: "json",
      success: function (res) {
        wx.hideLoading();
        wx.stopPullDownRefresh()
        var listItem = res.data.data;
        // 改变每条记录的时间显示方式
        if(res.data.code==0){
          wx.hideLoading();
          if (res.data.data.length > 0){
             for (var i = 0; i < res.data.data.length; i++) {
               listItem[i].total_seconds = self.changeTime(res.data.data[i].total_seconds)
             }
             self.setData({
               arrs: self.data.arrs.concat(listItem),
               wallData: res.data.wish_wall_data,
               hasMoreData:true,
               pageNo:self.data.pageNo+1
             })
          }else{
             self.data.hasMoreData = false;
          }
        }  
        self.setData({
          wallContent: res.data.wish_wall_data.default_content
        })      
      }
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
    wx.hideLoading();
    this.setData({
      pageNo:1,
      pageSize:20,
      hasMoreData:true,
      arrs:[]
    })
    this.onShow();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var self = this;
    if (self.data.hasMoreData){
      self.getWishData()
    }else{
      
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  toWish:function(){
    var self =this;
    wx.navigateTo({
      url: '../to-wish/to-wish?id=' + self.id + "&wallContent=" + self.data.wallContent,
    })
  },
  addBless:function(e){
    var self = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var arrsBlessCount = "arrs[" + index + "].bless_count";
    var blessCount = self.data.arrs[index].bless_count;
    var arrsIsBless = "arrs[" + index + "].is_bless";          
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/other/add_bless",
        method: "POST",
        header: {
          // "Content-Type": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          wish_id:id
        },
        dataType: "json",
        success: function (res) {

          if(res.data.code==0){
            self.setData({
              [arrsBlessCount]: blessCount + 1,
              [arrsIsBless]: 1,
            })
          }
          
        }
      })
    }) 
  },
  changeTime: function (seconds){
    var MIN = 60;
    var HOUR = MIN * 60;
    var DAY = HOUR * 24;

    //console.log(int(seconds/DAY))
    if (seconds >= DAY) {
      //return '1111'
      return '' + parseInt(seconds / DAY) + '天前';
    }

    if (seconds >= HOUR) {
      return '' + parseInt(seconds / HOUR) + '小时前';
    }

    if (seconds >= MIN) {
      return '' + parseInt(seconds / MIN) + '分钟前';
    }
    if (seconds < MIN) {
      return '' + '刚刚';
    }

  },
  formSubmit(e) {
    var formId = e.detail.formId;
    var self = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    var arrsBlessCount = "arrs[" + index + "].bless_count";
    var blessCount = self.data.arrs[index].bless_count;
    var arrsIsBless = "arrs[" + index + "].is_bless";
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/other/add_bless",
        method: "POST",
        header: {
          // "Content-Type": "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          wish_id: id
        },
        dataType: "json",
        success: function (res) {
          // 发送模板id
          getApp().sendModel(formId, token);
          if (res.data.code == 0) {
            self.setData({
              [arrsBlessCount]: blessCount + 1,
              [arrsIsBless]: 1,
            })
            
          }

        }
      })
    }) 
  },
})