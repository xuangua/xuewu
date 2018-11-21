import {
    RECORD_ADDRESS,
    SAVE_USER_REAL_ADDRESS,
    SAVE_USER_DETAIL_ADDRESS,
    UPDATE_USER_DETAIL_ADDRESS,
    SAVE_USER_CHOSEN_SCHOOL_ADDRESS,
    ADD_CART,
    REDUCE_CART,
    INIT_BUYCART,
    CLEAR_CART,
    RECORD_SHOPDETAIL,
    RECORD_USERINFO,
    GET_USERINFO,
    CONFIRM_REMARK,
    CONFIRM_INVOICE,
    CHOOSE_SEARCH_ADDRESS,
    SAVE_GEOHASH,
    CONFIRM_ADDRESS,
    CHOOSE_ADDRESS,
    NEED_VALIDATION,
    SAVE_CART_ID_SIG,
    SAVE_ORDER_PARAM,
    CHANGE_ORDER_PARAM,
    ORDER_SUCCESS,
    SAVE_SHOPID,
    SAVE_ORDER,
    OUT_LOGIN,
    RETSET_NAME,
    SAVE_AVANDER,
    SAVE_ADDRESS,
    SAVE_ADDDETAIL,
    SAVE_QUESTION,
    ADD_ADDRESS,
    BUY_CART,
} from './mutation-types.js'

import {setStore, getStore} from '../config/mUtils'

import {localapi, proapi} from 'src/config/env'

export default {
    // 记录当前经度纬度
    [RECORD_ADDRESS](state, {
        latitude,
        longitude
    }) {
        console.log('RECORD_ADDRESS.latitude')
        console.log(latitude)
        console.log('RECORD_ADDRESS.longitude')
        console.log(longitude)
        state.latitude = latitude;
        state.longitude = longitude;
    },

    [SAVE_USER_REAL_ADDRESS](state, realAddrName) {
        console.log('SAVE_USER_REAL_ADDRESS.realAddrName')
        console.log(realAddrName)
        state.realAddrName = realAddrName;
    },

    [SAVE_USER_DETAIL_ADDRESS](state, {
        realAddrName,
        shopAddrName,
        decidedSchoolData,
        realaddressDetail
    }) {
        // console.log('SAVE_USER_DETAIL_ADDRESS.realAddrName')
        // console.log(realAddrName)
        // console.log('SAVE_USER_DETAIL_ADDRESS.shopAddrName')
        // console.log(shopAddrName)
        // console.log('SAVE_USER_DETAIL_ADDRESS.decidedSchoolData')
        // console.log(decidedSchoolData)
        state.realAddrName = realAddrName;
        state.shopAddrName = shopAddrName;
        state.decidedSchoolData = decidedSchoolData;
        state.realaddressDetail = realaddressDetail;
        state.latitude = decidedSchoolData.location.lat;
        state.longitude = decidedSchoolData.location.lng;
    },

    [UPDATE_USER_DETAIL_ADDRESS](state, {
        shopAddrName,
        decidedSchoolData
    }) {
        console.log('UPDATE_USER_DETAIL_ADDRESS.shopAddrName')
        console.log(shopAddrName)
        console.log('UPDATE_USER_DETAIL_ADDRESS.decidedSchoolData')
        console.log(decidedSchoolData)

        state.shopAddrName = shopAddrName;
        state.decidedSchoolData = decidedSchoolData;
        state.latitude = decidedSchoolData.location.lat;
        state.longitude = decidedSchoolData.location.lng;
    },

    [SAVE_USER_CHOSEN_SCHOOL_ADDRESS](state, {
        province,
        city,
        district,
        schoolName,
        schoolCampusName,
        schoolCampusId
    }) {
        let chosenSchoolData = {
            province: province,
            city: city,
            district: district,
            schoolName: schoolName,
            schoolCampusName: schoolCampusName,
            schoolCampusId: schoolCampusId,
        }
        state.chosenSchoolCampusData = chosenSchoolData;
        console.log('SAVE_USER_CHOSEN_SCHOOL_ADDRESS.chosenSchoolCampusData')
        console.log(state.chosenSchoolCampusData)
    },

    [RECORD_SHOPDETAIL](state, detail) {
        state.shopDetail = detail;
    },
    // 加入购物车
    [ADD_CART](state, {
        shopid,
        food_category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
        packing_fee,
        sku_id,
        stock
    }) {
        let cart = state.cartList;
        let shop = cart[shopid] = (cart[shopid] || {});
        let category = shop[food_category_id] = (shop[food_category_id] || {});
        let item = category[item_id] = (category[item_id] || {});
        if (item[food_id]) {
            item[food_id]['num']++;
        } else {
            item[food_id] = {
                    "num" : 1,
                    "id" : food_id,
                    "name" : name,
                    "price" : price,
                    "specs" : specs,
                    "packing_fee" : packing_fee,
                    "sku_id" : sku_id,
                    "stock" : stock
            };
        }
        state.cartList = {...cart};
        //存入localStorage
        setStore('buyCart', state.cartList);
    },
    // 移出购物车
    [REDUCE_CART](state, {
        shopid,
        food_category_id,
        item_id,
        food_id,
        name,
        price,
        specs,
    }) {
        let cart = state.cartList;
        let shop = (cart[shopid] || {});
        let category = (shop[food_category_id] || {});
        let item = (category[item_id] || {});
        if (item && item[food_id]) {
            if (item[food_id]['num'] > 0) {
                item[food_id]['num']--;
                state.cartList = {...cart};
                //存入localStorage
                setStore('buyCart', state.cartList);
            } else {
                //商品数量为0，则清空当前商品的信息
                item[food_id] = null;
            }
        }
    },
    //网页初始化时从本地缓存获取购物车数据
    [INIT_BUYCART](state) {
        let initCart = getStore('buyCart');
        if (initCart) {
            state.cartList = JSON.parse(initCart);
        }
    },
    //清空当前商品的购物车信息
    [CLEAR_CART](state, shopid) {
        state.cartList[shopid] = null;
        state.cartList = {...state.cartList};
        setStore('buyCart', state.cartList);
    },
    // 记录用户信息
    [RECORD_USERINFO](state, info) {
        console.log("info")
        console.log(info)
        state.userInfo = info;
        state.userInfo.user_id = info.openid;
        state.login = true;
        setStore('wx_openid', info.openid);
    },
    //获取用户信息存入vuex
    [GET_USERINFO](state, info) {
        if (state.userInfo && (state.userInfo.username !== info.username)) {
            return;
        };
        if (!state.login) {
            return
        }
        if (!info.message) {
            state.userInfo = {...info};
        } else {
            state.userInfo = null;
        }
    },
    //修改用户名
    [RETSET_NAME](state,username) {
        state.userInfo = Object.assign({}, state.userInfo,{username})
    },
    //保存商铺id
    [SAVE_SHOPID](state, shopid) {
        state.shopid = shopid;
    },
    //记录订单页面用户选择的备注, 传递给订单确认页面
    [CONFIRM_REMARK](state, {
        remarkText,
        inputText
    }) {
        state.remarkText = remarkText;
        state.inputText = inputText;
    },
    //是否开发票
    [CONFIRM_INVOICE](state, invoice) {
        state.invoice = invoice;
    },
    //选择搜索的地址
    [CHOOSE_SEARCH_ADDRESS](state, place) {
        state.searchAddress = place;
    },
    //保存geohash
    [SAVE_GEOHASH](state, geohash) {
        // console.log('SAVE_GEOHASH.geohash')
        // console.log(geohash)
        state.geohash = geohash;
        
    },
    //确认订单页添加新的的地址
    [CONFIRM_ADDRESS](state, newAddress) {
        state.newAddress.push(newAddress);
    },
    //选择的地址
    [CHOOSE_ADDRESS](state, {
        address,
        index
    }) {
        state.choosedAddress = address;
        state.addressIndex = index;
    },
    //保存下单需要验证的返回值
    [NEED_VALIDATION](state, needValidation) {
        state.needValidation = needValidation;
    },
    //保存下单后购物id 和 sig
    [SAVE_CART_ID_SIG](state, {
        cart_id,
        sig
    }) {
        state.cart_id = cart_id;
        state.sig = sig;
    },
    //保存下单参数，用户验证页面调用
    [SAVE_ORDER_PARAM](state, orderParam) {
        state.orderParam = orderParam;
    },
    //修改下单参数
    [CHANGE_ORDER_PARAM](state, newParam) {
        state.orderParam = Object.assign({}, state.orderParam, newParam);
    },
    //下单成功，保存订单返回信息
    [ORDER_SUCCESS](state, order) {
        state.cartPrice = null;
        state.orderMessage = order;
    },
    //进入订单详情页前保存该订单信息
    [SAVE_ORDER](state, orderDetail) {
        state.orderDetail = orderDetail;
    },
    //退出登录
    [OUT_LOGIN](state) {
        state.userInfo = {};
        state.login = false;
    },
    //保存图片
    [SAVE_AVANDER](state, imgPath) {
        state.imgPath = imgPath;
    },
    //删除地址列表
    [SAVE_ADDRESS](state, newAdress) {
        state.removeAddress = newAdress
    },
    //添加地址name
    [SAVE_ADDDETAIL](state, addAddress){
        state.addAddress=addAddress;
    },
    //保存所选问题标题和详情
    [SAVE_QUESTION](state, question) {
        state.question = {...question};
    },
    //增加地址
    [ADD_ADDRESS](state, obj) {
        state.removeAddress = [obj, ...state.removeAddress];
    },
    //会员卡价格纪录
    [BUY_CART](state, price) {
        state.cartPrice = price;
    },

}
