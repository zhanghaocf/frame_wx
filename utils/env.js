//返回值{develop:'开发版',trial:'体验版',release:'正式版'}
function setEnvVariable(){
  let env = ''
  let configobj = {
    'develop':{
      url:'https://wechat.91pitu.com'
    },
    //不加trial即体验版也用正式版环境
    // 'trial':{

    // },
    'release':{
      url:'https://wechat.91pitu.com'
    }
  }
  return function(){
    if(env){
      // console.log("当前环境:::",env)
      return configobj[env] || configobj.release
    }
    env='release' //主要兼容微信版本过低的用户不至于让他们打开开发环境变量所以默认正式版
    if(wx.getAccountInfoSync){
      let {miniProgram:{envVersion}} = wx.getAccountInfoSync()
      if(envVersion){
        env = envVersion
      }
    }
    // console.log("当前环境:::",env)
    return configobj[env] || configobj.release
  }
}

module.exports={
  getEnv:setEnvVariable()
}