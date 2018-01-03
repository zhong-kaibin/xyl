//app.js
import urlObj from 'utils/url.js';
App({
  onLaunch: function () {
    // 展示本地存储能力
    var self = this;
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.showLoading({
      title: '正在加载',
    })   
    wx.request({
      url: urlObj.url.httpSrc + "/other/index",
      method: "GET",
      header: {
        "Content-Type": "application/json",
        // 'Authorization': 'AppletToken ' + token
      },
      dataType: "json",
      success: function (res) {
        //把幸运卡的选项存进全局变量里面
        self.globalData.cardData = res.data.data.wish_card_data;
        self.globalData.wallData = res.data.data.wish_wall_data;
      }
    });

    // 不强制登陆

  },
  //强制登陆
  getToken: function (cb) {
    //调用登录接口获取登录凭证，进而换取用户登录态信息
    var self = this
    if (this.token) {
      cb(this.token)
    } else {
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code;
            //获取用户信息，需要用户点击允许
            wx.getUserInfo({
              success: function (res) {
                self.globalData.userInfo = res.userInfo
                // console.log(res, "用户信息")
                //发起网络请求
                wx.request({
                  // url: 'https://devapi.bjpio.com/user/login',
                  url: urlObj.url.httpSrc + '/user/login',
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  dataType: "json",
                  data: {
                    code: code,
                    rawData: res.rawData,
                    signature: res.signature,
                    encryptedData: res.encryptedData,
                    iv: res.iv
                  },
                  success: function (res) {
                    if(res.data.code==0){
                      self.token = res.data.data.token
                      self.globalData.token = res.data.data.token
                      //cb ? cb(self.token) : true;
                      cb(self.token)
                    }else{
                      wx.showToast({
                        title: '登录失败'
                      })
                    }
                    
                  }
                })
              },
              fail: function () {
                //wx.hideLoading()
                self.showAutoModel()
                console.log("获取用户信息失败")
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    }
  },
  //提示授权
  showAutoModel: function () {
    var self = this
    wx.showModal({
      title: '用户未授权',
      content: '如需正常使用许愿灵，请按确定并在授权管理中选中“用户信息”，仅是获取用户公开的信息。',
      showCancel: true,
      success: function (res) {
        if (res.confirm) {
          wx.openSetting({
            success: function success(res) {
              //我去，默认成功后调用获取数据？？
              var page = getCurrentPages()[0]
              page.onLoad(this.query)
            }
          });
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '你需要先授权',
          })
          //self.showAutoModel()
        }
      }
    })
  },
  globalData: {
    userInfo: null
  },
  sendModel: function (formId,token) {
    var self = this;
    //发送模板消息
    wx.request({
      url: urlObj.url.httpSrc  + "/other/collect_form_id",
      method: "GET",
      header: {
        'content-type': 'application/json',
        'Authorization': 'AppletToken ' + token
      },
      data: {
        form_id: formId
      },
      dataType: "json",
      success: function (res) {
      }
    })
  }
})