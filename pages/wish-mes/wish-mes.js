// pages/wish-mes/wish-mes.js
var app = getApp();
import urlObj from '../../utils/url.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    headImg: "../../resource/images/nimingtouxiang.png",
    silvery: "../../resource/images/yinpai.png",
    loveImg: "../../resource/images/xinxin.png",
    wishImg: ["../../resource/images/yuan.png", "../../resource/images/yuan.png", "../../resource/images/yuan.png", "../../resource/images/yuan.png", "../../resource/images/yuan.png"],
    arrow: "../../resource/images/arrow.png",
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
    popStatus: false,
    isShare:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opts) {
    var id = opts.id;
    var self =this;
    this.id = id;   
    this.getJson(); 
         
  },
  getJson:function(){
    var self = this;
    // 根据许愿id获取数据
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/other/get_wish_info?wish_id=" + self.id,
        method: "GET",
        header: {
          "Content-Type": "application/json",
          'Authorization': 'AppletToken ' + token
        },
        data: {
        },
        dataType: "json",
        success: function (res) {
          wx.hideLoading()

          self.setData({
            wallId: res.data.data.wish_wall_id,
            content: res.data.data.content,
            cardIcon: res.data.data.wish_card_icon,
            nickname: res.data.data.nickname,
            avatar: res.data.data.avatar,
            expired: res.data.data.expired,
            isCreator: res.data.data.is_creator,
            blessCount: res.data.data.bless_count,
            cardId: res.data.data.wish_card_id,
            icons: res.data.icons,
            protectDays: parseInt(res.data.data.bless_count/ 5),
            // cardData: app.globalData.cardData, //复制给swiper心愿卡
            popStatus: false,
            popStatus1: false
          });
          // 根据是否购买心愿卡设置显示状态
          if (self.data.cardId == 0) {
            self.setData({
              isHasCard: false
            })
          } else {
            self.setData({
              isHasCard: true
            })
          }
          // 根据是否被祝福设置显示状态
          if (self.data.blessCount == 0) {
            self.setData({
              isBlessed: false
            })
          } else {
            self.setData({
              isBlessed: true
            })
          }
        }
      });

      // 检查是否祝福过的状态
      wx.request({
        url: urlObj.url.httpSrc + "/other/check_bless",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          wish_id: self.id
        },
        dataType: "json",
        success: function (res) {
          if (res.data.code == 3) {
            self.setData({
              blessStatus: true
            })
          } else {
            self.setData({
              blessStatus: false
            })
          }

        }
      })
      //请求首页配置的接口
      wx.request({
        url: urlObj.url.httpSrc + "/other/index",
        method: "GET",
        header: {
          "Content-Type": "application/json",
          // "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {
        },
        dataType: "json",
        success: function (res) {
          if (res.data.code == 0) {
            self.setData({
              cardData: res.data.data.wish_card_data,
              stoneData: res.data.data.energy_stone_data,
            })
          }

        }
      })
    });
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
    var self = this;
    return {
      title: self.data.nickname+'许愿灵',
      path: '/pages/wish-mes/wish-mes?id=' + self.id,
      success:function(){
        self.setData({
          isShare:true
        })
      }
    } 
  },
  next: function () {
    var self = this;
    this.setData({
      currentIndex: self.data.currentIndex + 1,
      leftStatus: true
    })
    if (self.data.currentIndex == this.data.cardData.length-1) {
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
  getCard: function () {
    this.setData({
      popStatus: true
    })
  },
  getStone: function () {
    this.setData({
      popStatus1: true
    })
  },
  colsePop: function () {
    this.setData({
      popStatus: false,
      popStatus1: false
    })
  },
  toPay:function(){
    var self = this;
    var index = this.data.currentIndex;
    
    // 商品id,后端拿来区分心愿卡还是能量石
    var goodsId = 0;
    if (self.data.popStatus==true){
      goodsId = this.data.cardData[index].id;
    } else if (self.data.popStatus1==true){
      goodsId = this.data.stoneData[index].id;
    }  
    app.getToken(function (token) {
      wx.request({
        url: urlObj.url.httpSrc + "/recharge/pre_order/wftpay",
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded",
          'Authorization': 'AppletToken ' + token
        },
        data: {
          goods_id: goodsId,
          wish_id: self.id,
          content: self.data.content,
          wish_wall_id: self.data.wallId,
          anonymity: 0   //因为详情页后端没有返回是否匿名状态，故传空
        },
        dataType: "json",
        success: function (res) {
          console.log(res, "支付")
          if (res.data.code == 0) {
            var pay_info = JSON.parse(res.data.data.pay_info);
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
                // wx.redirectTo({
                //   url: '../wish-mes/wish-mes？id=' + self.wish_id,//支付成功后拿本条许愿id刷新页面
                // })
                self.getJson();
              },
              'fail': function (res) {
                wx.showToast({
                  title: '支付失败',
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
  },
  tobless: function (formId){
    var self = this;  
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
          wish_id: self.id
        },
        dataType: "json",
        success: function (res) {
          // 发送模板
          getApp().sendModel(formId, token);
          if (res.data.code == 0) {
            self.setData({
              blessStatus: true
            });
            //刷新
            self.getJson();
          }

        }
      })
    }) 
  },
  formSubmit(e){
    var formId = e.detail.formId;
    var self = this;
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
          wish_id: self.id
        },
        dataType: "json",
        success: function (res) {
          // 发送模板
          getApp().sendModel(formId, token);
          if (res.data.code == 0) {
            self.setData({
              blessStatus: true
            });
            //刷新
            self.getJson();
          }

        }
      })
    }) 
  },
  toWish:function(){
    wx.redirectTo({
      url: '../to-wish/to-wish',
    })
  },
  next1: function () {
    var self = this;
    this.setData({
      currentIndex: self.data.currentIndex + 1,
      leftStatus: true
    })
    if (self.data.currentIndex == this.data.stoneData.length - 1) {
      this.setData({
        rightStatus: false,
      })
    } else {
      this.setData({
        rightStatus: true,

      })
    }
  },
  last1: function () {
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
  swiperChange: function (e) {
    this.setData({
      currentIndex: e.detail.current
    })
    this.arrComfirm()
  },
  arrComfirm: function () {
    var self = this;
    var length;
    if (self.data.popStatus1==true){
      length = self.data.stoneData.length
    } else if (self.data.popStatus == true){
      length = self.data.cardData.length
    }

    if (self.data.currentIndex > length-2) {
      this.setData({
        rightStatus: false,
        leftStatus:true
      })
    } else if (self.data.currentIndex < 1) {
      this.setData({
        leftStatus: false,
        rightStatus:true
      })
    } else {
      this.setData({
        leftStatus: true,
        rightStatus: true,
      })
    }
  }
  
})