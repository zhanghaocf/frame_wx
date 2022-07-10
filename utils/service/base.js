import {
  simpleDebounce,
  composeFn,
  replaceCallback
} from '../util'
import { 
  getTest2
} from '../api/index.js'

function loadingShow(txt){
  return (fn)=>{
    return (...list)=>{
      let pageArr = getCurrentPages();
      let page = pageArr[pageArr.length-1];
      let {loadingTxt} = page.data;
      loadingTxt.push(txt);
      page.setData({
        loadingTxt
      })
      return fn.apply(this,list).then(res=>{
        loadingTxt.shift();
        page.setData({
          loadingTxt
        })
        return res
      }).catch(err=>{
        loadingTxt.shift();
        page.setData({
          loadingTxt
        })
        throw err
      })
    }
  }
}

function cacheFn(fn){
  let obj = {}
  return (...args) => {
    let key = JSON.stringify(args)
    let val = obj[key]
    if(val){
      console.log("拿到缓存啦", obj)
      return val
    }else{
      let v = fn.apply(this,args)
      if(v.then){
        return v.then(res=>{
          obj[key] = v
          return v
        })
      }else{
        obj[key] = v
        return v
      }
    }
  }
}

function errorHandle(fn){
  return (...args)=>{
    return fn.apply(this,args).catch(msg=>{
      let warning = typeof msg === 'string'?msg:'系统繁忙，请稍候重试'
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: warning,
      });
    })
  }
}

function handleApi(fn,
  {
      loadingTxt = '', //是否有loading
      needError = true, // true弹错误信息false不弹
      needDebance = false, //是否防止连点
      cacheBol = false, //是否缓存
      simpleBol = false //是否作为单例模式
  } = {}) {
  let arr = []
  loadingTxt && arr.unshift(loadingShow(loadingTxt))
  needDebance && arr.unshift(simpleDebounce)
  simpleBol && arr.unshift(replaceCallback)
  needError && arr.unshift(errorHandle)
  //composeFnCache中的函数参数有顺序要求错误处理总是第一个,后期开发添加其他处理方法用arr.push
  cacheBol && arr.push(cacheFn)
  return composeFn.apply(this, arr)(fn)
}


module.exports={
  handleApi
}