<template>
  	<div class="login_page fillcontain">
	  	<transition name="form-fade" mode="in-out">
	  		<section class="form_contianer" v-show="showLogin">
		  		<div class="manage_tip">
		  			<p>elm后台管理系统</p>
		  		</div>
		    	<el-form :model="loginForm" :rules="rules" ref="loginForm">
					<el-form-item prop="username">
						<el-input v-model="loginForm.username" placeholder="用户名"><span></span></el-input>
					</el-form-item>
					<el-form-item prop="password">
						<el-input type="password" placeholder="密码" v-model="loginForm.password"></el-input>
					</el-form-item>
					<div v-if="luosimaoSiteKey" style="min-height: 44px;">
                    	<div class="l-captcha" data-width="100%" :data-site-key="luosimaoSiteKey" data-callback="luosimaoCallback"></div>
                	</div>
	                <p style="text-align: right;padding-right: 2px;margin-top:10px;">
	                    <router-link  id="singup" to="/signup">立即注册</router-link> 
	                    <!-- <a href="/signup" class="golang-common-link" style="margin-right: 12px;">立即注册</a> -->
	                    <a href="/ac/pwdReset" class="golang-common-link">忘记密码</a>
	                </p>

					<el-form-item>
				    	<el-button type="primary" @click="submitForm('loginForm')" class="submit_btn">登录</el-button>
				  	</el-form-item>
				</el-form>
				<p class="tip">温馨提示：</p>
				<p class="tip">还没有注册的用户，点击<router-link to="/register">注册</router-link></p>
				<p class="tip">注册过的用户可凭账号密码登录</p>
	  		</section>
	  	</transition>
  	</div>
</template>
<!-- <script type="text/javascript" color="51,133,255" opacity='0.7' zIndex="1" count="80" src="/javascripts/canvasnest/canvas-nest.min.js"></script> -->

<script>
	import {login, getAdminInfo} from '@/api/getData'
	import {mapActions, mapState} from 'vuex'

	export default {
	    data(){
			return {
				luosimaoRes: '',
				luosimaoSiteKey: this.$store.state.siteConfig.luosimaoSiteKey,
				loginForm: {
					username: '',
					password: '',
				},
				rules: {
					username: [
			            { required: true, message: '请输入用户名', trigger: 'blur' },
			        ],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
				},
				showLogin: false,
			}
		},
		mounted(){
			console.log(this.adminInfo)
			this.showLogin = true;
			if (!this.adminInfo.id) {
    			this.getAdminData()
    		}

    		window.luosimaoCallback = (response) => {
    			console.log('get a callback');
                this.luosimaoRes = response
            }
		},
		computed: {
			...mapState(['adminInfo']),
		},
		head(){
			return {
				title: '登录',
				script: [
					{ src: '//captcha.luosimao.com/static/js/api.js' }
				]
			}
        },
		methods: {
			...mapActions(['getAdminData']),
			async submitForm(formName) {
				this.$refs[formName].validate(async (valid) => {
					if (valid) {
						const res = await login({signinInput: this.loginForm.username, password: this.loginForm.password})
						if (res.errNo == 0) {
							this.$message({
		                        type: 'success',
		                        message: '登录成功'
		                    });
		                    // this.adminInfo = res.adminInfo;
		                    this.$store.commit('saveAdminInfo', res.data.user);
							this.$router.push('manage')
						}else{
							this.$message({
		                        type: 'error',
		                        message: res.msg
		                    });
						}
					} else {
						this.$notify.error({
							title: '错误',
							message: '请输入正确的用户名密码',
							offset: 100
						});
						return false;
					}
				});
			},
		},
		watch: {
			adminInfo: function (newValue){
				console.log(newValue)
				if (newValue.id) {
					this.$message({
                        type: 'success',
                        message: '检测到您之前登录过，将自动登录'
                    });
					this.$router.push('manage')
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '../style/mixin';
	.login_page{
		background-color: #324057;
	}
	.manage_tip{
		position: absolute;
		width: 100%;
		top: -100px;
		left: 0;
		p{
			font-size: 34px;
			color: #fff;
		}
	}
	.form_contianer{
		.wh(320px, 210px);
		.ctp(320px, 210px);
		padding: 25px;
		border-radius: 5px;
		text-align: center;
		background-color: #fff;
		.submit_btn{
			width: 100%;
			font-size: 16px;
		}
	}
	.tip{
		font-size: 12px;
		color: red;
	}
	.form-fade-enter-active, .form-fade-leave-active {
	  	transition: all 1s;
	}
	.form-fade-enter, .form-fade-leave-active {
	  	transform: translate3d(0, -50px, 0);
	  	opacity: 0;
	}
</style>
