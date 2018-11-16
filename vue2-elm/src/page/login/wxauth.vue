<template>
    <div>
        <head-top signin-up='home'>
            <span slot='logo' class="head_logo"  @click="reload">ele.me</span>
        </head-top>
    </div>
</template>

<script>
import headTop from '../../components/header/head'
import {getWxConfigNeededData} from '../../service/getData'
import {mapState, mapMutations} from 'vuex'

export default {
    data(){
        return{
            pointX: '',
            pointY: '',
            point: '',
            marker: '',
            // location:{
            //     href : 'http://wemall.wxapp.xuangua.xyz/#/home'
            // },
            // wxUserInfo: null, //获取到的用户信息
            // wxlogin: false,
            // BaseUrl: "https://open.weixin.qq.com/connect/oauth2/authorize?",
            // JsApiData:"",

            // GetCodes:{
            //     //公众号的唯一标识
            //     AppId:"wx65c37541d5bb2ae1",
            //     //授权后重定向的回调链接地址(填当前页) TODO:changeme
            //     GetCodes:"http://wemall.wxapp.xuangua.xyz",
            //     //返回类型，请填写code
            //     Response_type: "code",
            //     //应用授权作用域，snsapi_base （不弹出授权页面，直接跳转，只能获取用户openid）
            //     Scope: "snsapi_userinfo",
            //     //重定向后会带上state参数，开发者可以填写a-zA-Z0-9的参数值，最多128字节
            //     State:"test",
            //     //必须带此参数
            //     Wechat_Redirect:"#wechat_redirect"
            // },
        }
    },

    mounted(){
        if(this.isWechat()){
            if (!(this.userInfo && this.userInfo.user_id)) {
                this.$router.push({path:'/wxlogin'})
            } else if (!this.geohash) {
                this.getWxConfig();
            } else {
                let geo = this.geohash
                this.$router.push({path:'/msite', query:{geo}})
            }
        }else{
            this.$router.push({path:'/msite'})
            // alert('请在微信中打开...');
        }
    },

    components:{
        headTop
    },

    computed:{
        ...mapState([
            'latitude','longitude','geohash', 'userInfo'
        ]),
    },

    methods:{
        ...mapMutations([
            'RECORD_ADDRESS', 'SAVE_GEOHASH',
        ]),
        // 判断是否是微信环境
        isWechat(){
            let ua = window.navigator.userAgent.toLowerCase();
            return ua.match(/MicroMessenger/i) == 'micromessenger';
        },
        //获取微信配置 
        getWxConfig(){
            let that = this;
            let geo = ''
            // let lat = ''
            // let long = ''
            // let params = {
            //     url: 'http://www.123.com/shop/index1.html'
            // }
            console.log(this.$route.fullPath)
            console.log(window.location)

            let accessurl = window.location.origin + window.location.pathname;
            console.log(accessurl)
            getWxConfigNeededData(accessurl).then(res => {
                console.log(res)
                wx.config({
                    debug: false,
                    appId: res.app_id,
                    nonceStr: res.nonce_str,
                    timestamp: res.timestamp,
                    // url: res.url,
                    signature: res.signature,
                    jsApiList: [
                        'checkJsApi', 'openLocation', 'getLocation'
                    ],
                })
                wx.checkJsApi({
                    jsApiList: ['getLocation'],
                    success: function (res) {
                        if (res.checkResult.getLocation == false) {
                            alert('你的微信版本太低，不支持微信JS接口，请升级到最新的微信版本！');
                            return;
                        }
                    }
                });
                wx.ready(function () {
                    // wx.invoke('getLocation', 'openLocation', {}, function(res) {
                    //     //alert(res.err_msg + "唯一");
                    // });
                    wx.getLocation({
                        success: function (res) {
                            console.log(res)
                            // that.pointY = res.latitude; // 纬度，浮点数，范围为90 ~ -90
                            // that.pointX = res.longitude; // 经度，浮点数，范围为180 ~ -180。

                            // that.point = new BMap.Point(that.pointX,that.pointY);
                            // that.marker = new BMap.Marker(that.point); // 创建点

                            // that.getShopFjStudio()
                            geo = res.latitude + ',' + res.longitude;
                            // 记录当前经度纬度
                            // lat = res.latitude;
                            // long = res.longitude;
                            // this.RECORD_ADDRESS({lat, long});
                            // this.SAVE_GEOHASH(geo);
                            console.log(geo)
                            // that.$router.push({path:'/wxlogin'})
                            that.$router.push({path:'/msite', query:{geo}})
                            // return geo
                        },
                        cancel: function (res) {
                            alert('用户拒绝授权获取地理位置');
                            // that.getShopFjStudio()
                        }
                    });
                });

                wx.error(function (res) {
                    console.log(res)
                    console.log('请升级到最新的微信版本')
                    // that.getShopFjStudio()
                });
            }).catch(res => {
                console.log(res)
            })

            console.log('geo')
            // console.log(geo)
            // if (geo.indexOf(',') == -1) {
            //     that.$router.push({path:'/msite'})
            // }
        },
        saveCustomerAddress(lat, long){
            this.RECORD_ADDRESS({lat, long});
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
