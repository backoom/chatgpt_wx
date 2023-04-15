// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
  },
  //点亮发送给朋友(在当前页添加)
  onShareAppMessage(){
    return {
      title: '自定义转发标题',//标题
      path: '/page/user?id=123'//路径
    }
  },
  onShareTimeline() {
  },//点亮分享朋友圈,暂只支持Android平台

  onShow: function () {
    //分享到朋友圈(在onLoad或onShow中添加)
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });

    if(wx.getStorageSync('expireTime')==null ||wx.getStorageSync('expireTime') < Date.now()){
      console.log(wx.getStorageSync('expireTime')+"-->"+Date.now());
      wx.removeStorageSync('expireTime')
      let username = wx.getStorageSync('username')
      wx.removeStorageSync('username')
      wx.request({
        url: 'http://38.60.39.126:8079/user/logout',
        method: "get",
        data: {
          "username": username,
        },
        success: ({
          data
        }) => {
          wx.showToast({
            icon: 'none',
            title: '身份验证到期，请重新登录',
            duration: 2500
          })
        }
      })
    }

    wx.request({
      url: 'http://38.60.39.126:8079/user/checkUserKey',
      method: "get",
      data: {
        "username": wx.getStorageSync('username'),
        "key":wx.getStorageSync('key')
      },
      success: ({
        data
      }) => {
        console.log(data.code);
        if (data.code === 500) {
          wx.showToast({
            icon: 'none',
            title: data.message,
            duration: 2500
          })
          wx.removeStorageSync('username')
          wx.removeStorageSync('key')
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      }
    })
    if (wx.getStorageSync('username') ==null || wx.getStorageSync('username')=== '') {
      wx.redirectTo({
        url: '/pages/login/login',
      })
    }
  }
})
