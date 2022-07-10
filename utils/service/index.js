import {
  handleApi
} from "./base"
import {
  testHttp
} from "../api/index"
module.exports={
  testHttpM:handleApi(testHttp,{
    loadingTxt:'测试中'
  }),
  testSingle:handleApi(testHttp,{
    loadingTxt:'单例',
    simpleBol:true
  })
}