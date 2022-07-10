function curryN(length,fn){
  let arr = []
  return function c(...args){
    arr = arr.concat(args)
    if(arr.length<length){
      return c
    }else{
      return fn.apply(this,arr)
    }
  }
}

function composeFn(...args){
  let destoryFnArr = [];
  return function(fn){
    let newFn = args.reduceRight((s,f)=>{
      let resFn = f(s)
      let {destoryFunctional} = resFn
      destoryFunctional && destoryFnArr.push(destoryFunctional)
      return resFn
    },fn)
    newFn.destoryFunctional=()=>{
      destoryFnArr.forEach(fn=>fn())
    }
    return newFn
  }
}

//fn失败执行几次问题
function performTimes(count,fn){
  let t = count
  return function haha(...args){
    return fn.apply(this,args).catch(err=>{
      if(--count>0){
        return new Promise((resolve,reject)=>{
          setTimeout(()=>{
            return resolve(haha(...args))
          },(t-count)*500)
        })
      }else{
        throw err
      }
    })
  }
}

function replaceCallback(fn){
  let p = null
  function replaceCallback_fn(...args){
    if(p){
      return p;
    }
    return p?p:(p=fn.apply(this,args))
  }
  replaceCallback_fn.destoryFunctional = ()=>{
    console.log("删除了单例效果");
    p=null;
  }
  return replaceCallback_fn;
}

function simpleDebounce(fn){
  let timer = null
  return (...args)=>{
    clearTimeout(timer)
    return new Promise((resolve,reject)=>{
      timer=setTimeout(()=>{
        resolve(fn.apply(this,args))
      },300)
    })
  }
}

function heartfn(fn,statefn=(param)=>true){
  let timer = null
  return function settingfn(...args){
      settingfn.stoptimer=false
      function heartHandleFn(...args){
          return new Promise((resolve,reject)=>{
              fn.apply(this,args).then(res=>{
                  if(statefn(res)){
                      resolve(res)
                  }else{
                      if(settingfn.stoptimer){
                          return reject('阻止了')
                      }
                      timer = setTimeout(()=>{
                          resolve(heartHandleFn(...args))
                      },1000)
                  }
              }).catch(err=>{
                  if(settingfn.stoptimer){
                      return reject('阻止了')
                  }
                  timer = setTimeout(()=>{
                      resolve(heartHandleFn(...args))
                  },1000)
              })
          })
      }
      return heartHandleFn(...args)
  }
}
//_______________________________________________________

function perform2Times(fn){
  return performTimes(2,fn)
}

//对promise的fn设置执行失败最多可执行2次然后再去解决异步回调问题
function set_2times_callback(fn){
  return composeFn(replaceCallback,perform2Times)(fn)
}

module.exports={
  composeFn,
  set_2times_callback,
  simpleDebounce,
  replaceCallback
}