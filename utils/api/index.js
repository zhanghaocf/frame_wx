import {
  Get
} from "./request";

function testHttp(){
  // todo 模拟接口
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve('这是测试接口')
    },1000)
  })
}

module.exports = {
  testHttp
}