// pages/wx-pay/wx-pay.js
const app = getApp()
import urlObj from '../../utils/url.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userHead: "../../resource/images/nimingtouxiang.png",
    username:"匿名用户",
    silvery: "../../resource/images/yinpai.png",
    gold: "../../resource/images/jinpai.png",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    var self = this;
    this.setData({
      id : opts.id,
      cardId : opts.cardId,
      nmStatus: opts.nmStatus,
      info: app.globalData.cardData[opts.cardId-1],
      goodsId: opts.cardId,
      content:opts.content

    })
    if (opts.nmStatus==0){
      this.setData({
        userHead: app.globalData.userInfo.avatarUrl,
        username: app.globalData.userInfo.nickName,
      })
    }

    // 获取购买卡的人数
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/other/get_buy_count",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          wish_card_id: self.data.cardId
        },
        dataType: "json",
        success: function (res) {
          if (res.data.code == 0) {
            self.setData({
              cardNum: res.data.data,
            })
          }

        }
      })
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
  toPay:function(){
    var self = this;
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/recharge/pre_order/wftpay",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          goods_id: self.data.goodsId,
          wish_id:0,
          content: self.data.content,
          wish_wall_id:self.data.id,
          anonymity: self.data.nmStatus
        },
        dataType: "json",
        success: function (res) {
          console.log(res, "支付")
          if (res.data.code == 0) {
            var pay_info = JSON.parse(res.data.data.pay_info);
            var order_id = res.data.order_id;
            wx.requestPayment({
              'timeStamp': pay_info.timeStamp,
              'nonceStr': pay_info.nonceStr,
              'package': pay_info.package,
              'signType': pay_info.signType,
              'paySign': pay_info.paySign,
              'success': function (res) {
                wx.showToast({
                  title: '支付成功',
                })
                app.getToken(function (token) {
                  wx.request({
                    url: urlObj.url.httpSrc + "/recharge/get_wish",
                    method: "GET",
                    header: {
                      "Content-Type": "application/json",
                      'Authorization': 'AppletToken ' + token
                    },
                    data: {
                      order_id: order_id
                    },
                    dataType: "json",
                    success: function (res) {
                      if(res.data.code==0){
                        self.setData({
                          wishId: res.data.data.id
                        });
                        wx.redirectTo({
                          url: '../look-wish/look-wish?id=' + self.data.wishId,
                        })
                      }else{
                        wx.showToast({
                          title: '添加失败',
                        })
                      }
                      
                    }
                  })
                })   
                
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败，请重新支付',
                })
              }
            })
          } else {
            wx.showToast({
              title: '网络错误',
            })
          }
        }

      })
    }) 
  }
})