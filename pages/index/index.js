const app = getApp()
import {
  testHttpM,
  testSingle
} from "../../utils/service/index"
Page({
  mixins:[require('../../utils/mixins/testmixin')('sb'),require('../../utils/mixins/testmixin')('sb')],
  data: {
    loadingTxt:[]
  },
  onAfterUserid(){
    console.log('我是首页onAfterUserid')
  },
  clickfn(){
    testHttpM().then(res=>{
      console.log(res)
    })
  },
  clickSinglefn(){
    testSingle().then(res=>{
      console.log("单例:::",res)
    })
  },
  clear(){
    testSingle.destoryFunctional()
  }
})
