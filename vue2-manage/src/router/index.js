import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/'

Vue.use(Router)

const login = r => require.ensure([], () => r(require('@/page/login')), 'login');
const register = r => require.ensure([], () => r(require('@/page/register')), 'register');
const signup = r => require.ensure([], () => r(require('@/page/signup')), 'signup');
const manage = r => require.ensure([], () => r(require('@/page/manage')), 'manage');
const home = r => require.ensure([], () => r(require('@/page/home')), 'home');
const addShop = r => require.ensure([], () => r(require('@/page/addShop')), 'addShop');
const addGoods = r => require.ensure([], () => r(require('@/page/addGoods')), 'addGoods');
const userList = r => require.ensure([], () => r(require('@/page/userList')), 'userList');
const shopList = r => require.ensure([], () => r(require('@/page/shopList')), 'shopList');
const foodList = r => require.ensure([], () => r(require('@/page/foodList')), 'foodList');
const orderList = r => require.ensure([], () => r(require('@/page/orderList')), 'orderList');
const adminList = r => require.ensure([], () => r(require('@/page/adminList')), 'adminList');
const visitor = r => require.ensure([], () => r(require('@/page/visitor')), 'visitor');
const newMember = r => require.ensure([], () => r(require('@/page/newMember')), 'newMember');
const uploadImg = r => require.ensure([], () => r(require('@/page/uploadImg')), 'uploadImg');
const vueEdit = r => require.ensure([], () => r(require('@/page/vueEdit')), 'vueEdit');
const adminSet = r => require.ensure([], () => r(require('@/page/adminSet')), 'adminSet');
const sendMessage = r => require.ensure([], () => r(require('@/page/sendMessage')), 'sendMessage');
const explain = r => require.ensure([], () => r(require('@/page/explain')), 'explain');

const routes = [
	{
		path: '/',
		component: manage,
		meta: {requiresAuth: true},
	},
	{
		path: '/login',
		component: login,
	},
	{
		path: '/register',
		component: register
	},
	{
		path: '/signup',
		component: signup,
	},
	{
		path: '/manage',
		component: manage,
		meta: {requiresAuth: true},
		name: '',
		children: [{
			path: '',
			component: home,
			// meta: {requiresAuth: true},
		},{
			path: '/login',
			component: login,
			// meta: ['添加数据', '添加商铺'],
		},{
			path: '/addShop',
			component: addShop,
			meta: ['添加数据', '添加商铺'],
		},{
			path: '/addGoods',
			component: addGoods,
			meta: ['添加数据', '添加商品'],
		},{
			path: '/userList',
			component: userList,
			meta: ['数据管理', '用户列表'],
		},{
			path: '/shopList',
			component: shopList,
			meta: ['数据管理', '商家列表'],
		},{
			path: '/foodList',
			component: foodList,
			meta: ['数据管理', '食品列表'],
		},{
			path: '/orderList',
			component: orderList,
			meta: ['数据管理', '订单列表'],
		},{
			path: '/adminList',
			component: adminList,
			meta: ['数据管理', '管理员列表'],
		},{
			path: '/visitor',
			component: visitor,
			meta: ['图表', '用户分布'],
		},{
			path: '/newMember',
			component: newMember,
			meta: ['图表', '用户数据'],
		},{
			path: '/uploadImg',
			component: uploadImg,
			meta: ['文本编辑', 'MarkDown'],
		},{
			path: '/vueEdit',
			component: vueEdit,
			meta: ['编辑', '文本编辑'],
		},{
			path: '/adminSet',
			component: adminSet,
			meta: ['设置', '管理员设置'],
		},{
			path: '/sendMessage',
			component: sendMessage,
			meta: ['设置', '发送通知'],
		},{
			path: '/explain',
			component: explain,
			meta: ['说明', '说明'],
		}]
	}
]

let router = new Router({
	routes,
	strict: process.env.NODE_ENV !== 'production',
})

// /**
//  * Before each route we will see if the current user is authorized
//  * to access the given route
//  */
// // router.beforeEach(({to, next, abort, redirect}) => {
// router.beforeEach(({to, from, next}) => {
//     console.log(to)
//     console.log(next)
//     // console.log(abort)
//     // console.log(redirect)
//     let authorized = false
//     let user = JSON.parse(window.localStorage.getItem('atiiv.auth-user'))
    
//     /**
//      * Remember that access object in the routes? Yup this why we need it.
//      *
//      */
//     if (to.access !== undefined) {
//         authorized = Authorization.authorize(
//             to.access.requiresLogin,
//             to.access.requiredPermissions,
//             to.access.permissionType
//         )

//         if (authorized === 'loginIsRequired') {
//             router.go({name: 'login'})
//         }

//         if (authorized === 'notAuthorized') {
//             /**
//              * Redirects to a "default" page 
//              */
//             router.go({ /*...*/ })
//         }
//     }
//     /**
//      * Everything is fine? Let's to the page then.
//      */
//     next()
// })

router.beforeEach((to, from, next) => {
  // console.log(to)
  // console.log(from)
  // console.log(next)
  // console.log(to.meta)
  if(to.matched.some(record => record.meta.requiresAuth)) {
  // if(to.meta) {
    // console.log("store.state")
    // console.log(store.state)
    // console.log("store.getters.isLoggedIn")
    // console.log(store.getters.isLoggedIn)
    if (store.getters.isLoggedIn) {
      next()
      return
    }
    next('/login') 
  } else {
  	// console.log("to next")
    next() 
  }
})

export default router