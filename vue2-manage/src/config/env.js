/**
 * 配置编译环境和线上环境之间的切换
 * 
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * baseImgPath: 图片存放地址
 * 
 */
let baseUrl = ''; 
let routerMode = 'hash';
let baseImgPath;

if (process.env.NODE_ENV == 'development') {
    //baseUrl = '//dev.xuangua.xyz';
    baseUrl = '//dev.xuangua.com/api/xuewu';
    // baseUrl = '//wemall.wxapp.xuangua.xyz/api/xuewu';
    baseImgPath = '/img/';
}else{
    baseUrl = '//dev.xuangua.xyz/api/xuewu';
    baseImgPath = '//dev.xuangua.xyz/img/';
    // baseImgPath = '//dev.xuangua.com/img/';
    // baseUrl = '//wemall.wxapp.xuangua.xyz/api/xuewu';
    // baseImgPath = '//wemall.wxapp.xuangua.xyz/img/';
}

export {
	baseUrl,
	routerMode,
	baseImgPath
}