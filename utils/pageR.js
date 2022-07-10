// 定义小程序内置的属性/方法
const originProperties = ['data', 'options']
const originMethods = ['onLoad', 'onReady', 'onShow', 'onHide', 'onUnload', 'onPullDownRefresh', 'onReachBottom', 'onShareAppMessage', 'onPageScroll', 'onTabItemTap','onResize','onAddToFavorites','onShareTimeline','onAfterUserid']

function merge (mixins, options) {
  mixins.forEach((mixin) => {
    if (Object.prototype.toString.call(mixin) !== '[object Object]') {
      throw new Error('mixin 类型必须为对象！')
    }
    // 遍历 mixin 里面的所有属性
    for (let [key, value] of Object.entries(mixin)) {
      if (originProperties.includes(key)) {
        // 内置对象属性混入
        options[key] = { ...value, ...options[key] }
      } else if (originMethods.includes(key)) {
        // 内置方法属性混入，优先执行混入的部分
        const originFunc = options[key]
        options[key] = function (...args) {
          value.call(this, ...args)
          return originFunc && originFunc.call(this, ...args)
        }
      } else {
        // 自定义方法混入
        options = { ...{[key]:value}, ...options }
      }
    }
  })
  return options
}



let oldPage = Page
// 在Page中添加onAfterUserid生命周期函数，目的是在onLoad执行并保证在获取用户id之后执行
Page = function(options){
  // 添加mixins混入
  const mixins = options.mixins
  // mixins 必须为数组
  if (Array.isArray(mixins)) {
    delete options.mixins
    // mixins 注入并执行相应逻辑
    options = merge(mixins, options)
  }
  //判断每个页面如果没有userid等到有时再触发请求
  //就是把每个页面需要在userid后面调的请求写在方法onAfterUserid()
  if(options.onAfterUserid){
    let olfFn = options.onAfterUserid
    options.onAfterUserid = function(...list){
      let app = getApp()
      let {loadingTxt} = this.data;
      loadingTxt.push('数据加载中')
      this.setData({
        loadingTxt
      })
      app.getLogin.then(res=>{
        loadingTxt.shift()
        this.setData({
          loadingTxt
        })
        olfFn.apply(this,list)
      }).catch(err=>{
        loadingTxt.shift()
        this.setData({
          loadingTxt
        })
        app.alertMsg('系统出错，请关闭小程序重新打开尝试')
      })
    }
    let onloadFn = options.onLoad
    options.onLoad = function(...list){
      options.onAfterUserid.apply(this,list)
      onloadFn&&onloadFn.apply(this,list)
    }
  }

  oldPage(options)
}

