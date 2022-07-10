import {
  set_2times_callback
} from "/utils/util"
require('./utils/pageR')
App({
  onLaunch: function () {
    this.getLogin()
    this.autoUpdate()
  },
  getCode() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          resolve(res.code);
        },
        fail() {
          reject('发生错误啦,请稍后重试');
        },
      });
    });
  },
  loginfn(){
    // return new Promise((resolve,reject)=>{
    //   setTimeout(()=>{
    //     resolve('nihao')
    //   },1000)
    // })
    return Promise.reject('出错啦')
    // let {appid} = this.globalData
    // return this.getCode().then(res=>{
    //   return getUserId(res,appid)
    // }).then(res=>{
    //   let {ID,user_id,"user-key":userKey} = res
    //   if(!user_id){
    //     throw '系统超时，请尝试重新打开小程序使用'
    //   }
    // })
  },
  getLogin(){
    this.getLogin = set_2times_callback(this.loginfn.bind(this))()
    .catch(err=>{
      this.alertMsg('提示',err)
      throw err
    })
  },
  autoUpdate() {
    if(!wx.getUpdateManager){
      console.log("兼容老版本")
      return
    }
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启应用',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            updateManager.applyUpdate()
          }
        }
      })
    })
  },
  alertMsg(title, content,showCancel) {
    showCancel=showCancel?showCancel:false
    return new Promise((resolve, reject) => {
      wx.showModal({
        title,
        content,
        showCancel,
        success(res) {
          res.confirm && resolve('');
          res.cancel && reject('')
        }
      });
    });
  },
  globalData: {
    appid:''
  }
})