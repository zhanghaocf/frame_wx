module.exports = (keyname='test')=>({
    data: { [`${keyname}_someData`]: 'myMixin' },
    onAfterUserid(){console.log('我是mixin中的onAfterUserid')},
    onShow () { console.log('Log from mixin!') },
    [`${keyname}_clickfn`](){console.log('快点击我')}
  })