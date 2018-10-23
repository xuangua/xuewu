import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from "vuex-persistedstate"
import {getAdminInfo} from '@/api/getData'

Vue.use(Vuex)

const state = {
	siteConfig: {},
	status: '',
	isLoggedIn: false,
	token: localStorage.getItem('token') || '',
	adminInfo: {
		avatar: 'default.jpg'
	},
}

const mutations = {
	saveAdminInfo(state, adminInfo){
		state.adminInfo = adminInfo;
		state.isLoggedIn = true;
	},
	clearAdminInfo(state){
		state.adminInfo = {};
		state.isLoggedIn = false;
	}
}

const actions = {
	async getAdminData({commit}){
		try{
			const res = await getAdminInfo()
			if (res.status == 1) {
				commit('saveAdminInfo', res.data);
			}else{
				throw new Error(res)
			}
		}catch(err){
			console.log('您尚未登陆或者session失效')
		}
	}
}
const getters = {
	isLoggedIn: state => state.isLoggedIn,
	authStatus: state => state.status,
}

export default new Vuex.Store({
	state,
	actions,
	mutations,
	getters,
	plugins: [createPersistedState({
		storage: window.sessionStorage,
		reducer(val) {
			return {
			    // 只储存state中的assessmentData
				adminInfo: val.adminInfo,
				isLoggedIn: val.isLoggedIn
			}
		}
	})]
})