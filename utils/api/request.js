import {getEnv} from '../env'
import {replaceCallback} from "../util"
var log = require('../log/index.js')
let env = getEnv()
var domain = env.url;
let token = '';
function request(options) {
  let { header, noNeedToken } = options
  options.header = {
    ...header&&{header},
    // ...token&&!noNeedToken&&{gusuchongci: token}
    ...token&&!noNeedToken&&{Authorization: 'Bearer '+token}
  }
  return new Promise((resolve,reject)=>{
    wx.request({
      timeout:120000,
      ...options,
      success: (res) => {
        if(res.statusCode===401){
          //用户信息过期
          handleLogin401()
          return
        }
        if(res.statusCode>=400){
          res.requesturl=options.url
          res.requestData=options.data||''
          log.warn(JSON.stringify(res))
          return reject((res.data&&res.data.msg)||'系统繁忙，请稍候重试')
        }
        let dt = res.data;
        if(dt.success!==false){
          resolve(dt)
        }else{
          reject(dt.msg||'系统繁忙，请稍候重试')
        }
      },
      fail: (err) => {
        err.requesturl=options.url
        err.requestData=options.data||''
        log.error(err)
        if(err&&err.errMsg){
          switch(err.errMsg){
            case 'request:fail timeout':
              err = "网络不稳定，请稍候重试"
              break;
          }
        }
        if(err&&err.msg){
          err=err.msg
        }
        reject(err)
      }
    });
  })
}
//url,headers,data,noNeedToken是否需要token校验，默认都携带
function Get(options){
  let opt = {
    ...options,
    method:'GET'
  }
  return request(opt)
}

//url,headers,data
function Post(options){
  let opt = {
    ...options,
    method:'POST'
  }
  return request(opt)
}
function Put(options){
  let opt = {
    ...options,
    method:'PUT'
  }
  return request(opt)
}

function Delete(options){
  let opt = {
    ...options,
    method:'DELETE'
  }
  return request(opt)
}

function login(code){
  // todo 实现登录接口
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      token="test_token"
      resolve('test_token')
    },1000)
  })
  // return Post({
  //   'url':`${domain}/account/login/${code}`,
  //   noNeedToken:true
  // }).then(res=>{
  //   let {result:{access_token}={access_token:''}} = res
  //   token=access_token
  //   return res
  // })
}

const simpleLogin = replaceCallback(login)
let handleLogin401 = function(){
  handleLogin401 = ()=>{console.log('已经在处理了')}
  wx.showModal({
    title:'提示',
    content:'您的用户信息已经过期了哟～请老板重新登录下',
    showCancel:false,
    confirmText:'重新登录',
    success:()=>{
      wx.login({
        success: (res)=>{
          simpleLogin(res.code).then(res=>{
            wx.reLaunch({
              url: '/pages/index/index',
            })
          })
        },
      })
    }
  })
}

module.exports = {
  Get,
  Post,
  Put,
  Delete
}