<template>
    <div>
        <head-top signin-up='home'>
            <span slot='logo' class="head_logo"  @click="reload">ele.me</span>
        </head-top>
    </div>
</template>

<script>
import headTop from '../../components/header/head'
import {getOpenid, getWxUserInfo, loginWithWxUserInfo} from '../../service/getData'
import {mapState, mapMutations} from 'vuex'

export default {
    data(){
        return{
            // location:{
            //     href : 'http://wemall.wxapp.xuangua.xyz/#/home'
            // },
            wxUserInfo: null, //获取到的用户信息
            wxlogin: false,
            getCodeCallbackUrl: "",
            BaseUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?",
            JsApiData:"",

            GetCodes:{
                //公众号的唯一标识
                AppId:"wx65c37541d5bb2ae1",
                //授权后重定向的回调链接地址(填当前页) TODO:changeme
                GetCodes:"http://wemall.wxapp.xuangua.xyz",
                //返回类型，请填写code
                Response_type: "code",
                //应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
                Scope: "snsapi_userinfo",
                //重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
                State:"test",
                //必须带此参数
                Wechat_Redirect:"#wechat_redirect"
            },
        }
    },

    mounted(){
        // this.getCodeCallbackUrl = window.location.origin + window.location.pathname;
        this.getCodeCallbackUrl = window.location.origin;
        console.log(this.getCodeCallbackUrl)
        console.log(window.location.origin)
        console.log(window.location.pathname)
        //判断本地localStorag是否已经有openid，有则不获取，没有就去获取
        if (!this.GetStorage("wxUserInfo")) {
            this.GetCode()
        } else {
            console.log("wxUserInfo")
            console.log(this.wxUserInfo)
            this.wxUserInfo = JSON.parse(sessionStorage.getItem("wxUserInfo"))
            console.log("wxUserInfo")
            console.log(this.wxUserInfo)
            loginWithWxUserInfo(this.wxUserInfo).then(res => {
                    console.log(res)
                    // alert("res中的userInfo：" + res.wxUserInfo);
                    if (res.errNo == 0) {
                        this.wxUserInfo = res.data.user;
                        this.RECORD_USERINFO(this.wxUserInfo);
                        this.SetStorage("wxUserInfo", JSON.stringify(this.wxUserInfo))
                        // this.$store.commit('saveAdminInfo', res.data.user);
                        this.$router.push({path:'/wxauth'})
                    }else{
                        this.$router.push({path:'/'})
                    }
                    // window.location = this.GetCodes.GetCodes
                }
            )
        }
    },

    components:{
        headTop
    },

    computed:{
        ...mapState([
            'latitude','longitude','geohash', 'userInfo'
        ]),
        //将获取的数据按照A-Z字母开头排序
        sortgroupcity(){
            let sortobj = {};
            for (let i = 65; i <= 90; i++) {
                if (this.groupcity[String.fromCharCode(i)]) {
                    sortobj[String.fromCharCode(i)] = this.groupcity[String.fromCharCode(i)];
                }
            }
            return sortobj
        }
    },

    methods:{
        ...mapMutations([
            'RECORD_USERINFO',
        ]),
        // async login () {
        //   let login = false
        //   try {
        //     // 获取openid
        //     let { data } = await api.getOpenId()
        //     window.localStorage.setItem('openId', data.open_id)
        //     window.localStorage.setItem('userId', data.user_id)
        //     window.sessionStorage.setItem('code', getparam('code'))
        //     login = true
        //   } catch (error) {
        //     // OAuthModules.goOAuth('wx6bce565776a81ced', 'http://test.xlink.cn/wechat/mqtt/index.html')
        //     if (window.localStorage.getItem('openId')) {
        //       login = true
        //     } else {
        //       login = false
        //     }
        //   }
        //   if (!login) return console.error('not find openId')
        //   // 存储已经获取tooken的信息
        //   let {data} = await api.getUserAuthorize(window.localStorage.getItem('openId'))
        //   window.localStorage.setItem('accessToken', data.access_token)
        //   window.localStorage.setItem('authorize', data.authorize)
        //   // 获取设备列表
        //   let { data: {devices} } = await api.getDeviceList()
        //   this.devices = devices
        //   if (!devices.length) return
        //   this.productId = devices[0].device_pid
        //   this.curentDevieId = devices[0].device_id
        // },

        //获取code
        // userWxLogin(){
        //     userLoginWithWx().then(res => {
        //             console.log(res)
        //             // alert("res中的userInfo：" + res.wxUserInfo);
        //             if (res.errNo == 0) {
        //                 this.wxUserInfo = res.wxUserInfo;
        //                 this.RECORD_USERINFO(this.wxUserInfo);
        //                 this.SetStorage("wxUserInfo", res.wxUserInfo)
        //                 // this.$store.commit('saveAdminInfo', res.data.user);
        //                 this.$router.push({path:'/msite'})
        //                 // this.$router.push({
        //                 //     path: '/wxauth', 
        //                 //     params: {}, 
        //                 //     query: {}
        //                 // });
        //             }else{
        //                 this.$router.push({path:'/'})
        //             }
        //             // this.WxPayBtn(this.GetStorage("wxopenid"))
        //         }
        //     )
        // },

        //拼接获取code的地址
        ReturnGetCodeUrl(){
            return this.BaseUrl + "appid=" + this.GetCodes.AppId + "&redirect_uri="
                + this.getCodeCallbackUrl + "&response_type="
                + this.GetCodes.Response_type + "&scope=" + this.GetCodes.Scope + "&state="
                + this.GetCodes.State + this.GetCodes.Wechat_Redirect
        },

        //取localStorage数据
        GetStorage(name){
            return sessionStorage.getItem(name);
        },

        //写localStorage数据
        SetStorage(name, value){
            return sessionStorage.setItem(name, value);
        },

        //获取地址栏code参数
        GetQueryString(name){
            var url = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var newUrl = window.location.search.substr(1).match(url);
            if (newUrl != null) {
                return unescape(newUrl[2]);
            } else {
                return false;
            }
        },

        //获取code
        GetCode(){
            //如果有code参数，那么GetOpenId获取openid
            if (this.GetQueryString("code")) {
                console.log("有code")
                this.GetOpenId(this.GetQueryString("code"))
            //没有那么重定向去获取
            } else {
                console.log("没有code")
                /**
                 * 具体参考微信获取code文档 ：http://mp.weixin.qq.com/wiki/17/c0f37d5704f0b64713d5d2c37b468d75.html
                 * 官方接口：
                 * https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&redirect_uri=REDIRECT_URI&response_type=code&scope=SCOPE&state=STATE#wechat_redirect
                 */
                //重定向去微信来获取code
                 window.location = this.ReturnGetCodeUrl()
            }
        },

        //通过上面的GetCode()取得code，然后通过code取openid
        GetOpenId(code){
            // alert("GetOpenId获得的code为：" + code)

            //判断本地localStorag是否已经有openid，有则不获取，没有就去获取
            // if (!this.GetStorage("wxUserInfo")) {
                //判读用户是否存在
                // getOpenid(code).then(function (res) {
                //         console.log(res);
                //         alert("res中的userInfo：" + res.userInfo);
                //         this.wxUserInfo = res.userInfo;
                //         this.RECORD_USERINFO(this.wxUserInfo);
                //         // SetStorage("wxUserInfo", res.userInfo)

                //         // this.WxPayBtn(this.GetStorage("wxopenid"))

                //     }, function (error) {
                //         alert(JSON.stringify(error))
                //     }
                // )

                getWxUserInfo(code).then(res => {
                        console.log(res)
                        // alert("res中的userInfo：" + res.wxUserInfo);
                        if (res.errNo == 0) {
                            this.wxUserInfo = res.wxUserInfo;
                            this.RECORD_USERINFO(this.wxUserInfo);
                            this.SetStorage("wxUserInfo", JSON.stringify(res.wxUserInfo))
                            // this.$store.commit('saveAdminInfo', res.data.user);
                            // this.$router.push({path:'/msite'})
                        }else{
                            // this.$router.push({path:'/'})
                        }
                        // reload()
                        window.location = this.getCodeCallbackUrl
                    }
                )
                // this.$http.get("http://139.xxx.210.190/tucekeji/index.php/Admin/GetOpenId/GetOpenid?codes=" + code)
                //     .then(function (success) {

                //         alert("success中的openid：" + success.data)
                //         this.SetStorage("wxopenid", JSON.stringify(success.data))

                //         this.WxPayBtn(this.GetStorage("wxopenid"))

                //     }, function (error) {
                //         alert(JSON.stringify(error))
                //     })
            // }
            // this.$router.push({path:'/wxauth'})
            // this.$router.push({path:'/'})
            // this.$router.push('/msite');
        },
        //从服务器去拿最终的jsapi支付参数
        WxPayBtn(openid){
            alert("WxPayBtn"+openid)
            this.$http.get("http://www.wuxxxxo.com/wx/weixin/index.php?openid=" + openid + "&body=" + "测试标题" + "&total_fee=" + "1")
                .then(function (success) {

                    //打印最终获得的jsapi支付参数
                    alert(JSON.stringify(success.body))

                    //将jsapi参数存到JsApiData中
                    this.JsApiData = JSON.stringify(success.body);

                    //调用jsApiCall传入jsapi参数，发起支付
                    this.jsApiCall(this.JsApiData)

                },function (error) {
                    alert(JSON.stringify(error))
                })
        },
        //正式发起微信支付
        jsApiCall(jsapi){
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                jsapi,
                function (res) {
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        alert("支付成功")

                        //你的业务逻辑

                    } else {
                        alert("支付失败")
                        alert(JSON.stringify(res.err_msg))
                    }
                }
            );
        },

        //点击图标刷新页面
        reload(){
            window.location.reload();
        }
    },
}

</script>

<style lang="scss" scoped>
    @import '../../style/mixin';
    .head_logo{
        left: 0.4rem;
        font-weight: 400;
        @include sc(0.7rem, #fff);
        @include wh(2.3rem, 0.7rem);
        @include ct;
    }

    .letter_classify_li{
        margin-bottom: 0.4rem;
        background-color: #fff;
        border-bottom: 1px solid $bc;
        .groupcity_name_container{
            li{
                color: #666;
            }
        }
    }
</style>
