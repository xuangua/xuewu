import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './action'
import getters from './getters'
import createPersistedState from "vuex-persistedstate"

Vue.use(Vuex)

const state = {
	latitude: '', // 当前位置纬度
	longitude: '', // 当前位置经度
	realAddrName: '',			//通过wxgeo获取的用户真实地址信息 名字
	shopAddrName: '',			//通过wxgeo获取的用户真实地址信息,然后选出的最近学校/校区 名字
	decidedSchoolData: {},      //通过wxgeo获取的用户真实地址信息,然后选出的最近学校/校区 详细信息
	realaddressDetail: {},      //通过wxgeo获取的用户真实地址信息 详细信息
	chosenSchoolCampusData: {}, //用户手动指定的 学校/校区/地址信息
	cartList: {}, // 加入购物车的商品列表
	shopDetail: null, //商家详情信息
	userInfo: null, //用户信息
	shopid: null,//商铺id
	remarkText: null,//可选备注内容
	inputText: '',//输入备注内容
	invoice: false,//开发票
	newAddress: [], //确认订单页新的地址
	searchAddress: null,//搜索并选择的地址
	geohash: null,//地址geohash值
	choosedAddress: null,//选择地址
	addressIndex: null,//选择地址的索引值
	needValidation: null,//确认订单时是否需要验证
	cartId: null, //购物车id
	sig: null,//购物车sig
	orderParam: null,//订单的参数
	orderMessage: null, //订单返回的信息
	orderDetail: null, //订单详情
	login: false,//是否登录
	imgPath:null,//头像地址
	removeAddress:[],//移除地址
	addAddress:'',		//新增地址
	question: null,//问题详情
	cartPrice: null, //会员卡价格
}

export default new Vuex.Store({
	state,
	getters,
	actions,
	mutations,
	plugins: [createPersistedState({
		storage: window.sessionStorage,
		reducer(val) {
			return {
			    // 只储存state中的 userInfo, login, 
				userInfo: val.userInfo,
				login: val.login,
				chosenSchoolCampusData: val.chosenSchoolCampusData,
				decidedSchoolData: val.decidedSchoolData,
				realAddrName: val.realAddrName,
				shopAddrName: val.shopAddrName,
				realaddressDetail: val.realaddressDetail,
			}
		}
	})]
})