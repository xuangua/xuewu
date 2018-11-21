<template>
    <div>
        <div class="signup-head">
            <div class="signup-head-content">
                <a href="/">
                    <!-- <img src="~assets/images/logo.png" alt=""> -->
                    <span>学屋商城后台管你系统</span>
                </a>
            </div>
        </div>
        <div class="signup-box">
            <div class="signup-nav">
                <span class="title">{{!success ? '账号注册' : '邮箱验证' }}</span>
                <span class="desc">{{!success ? '如果您有 学屋商城 账号' : '如果您已经完成验证'}}，那么可以<a href="/signin">登录</a></span>
            </div>

            <div style="margin: 20px;"></div>
            <el-form :model="formCustom" :label-position="labelPosition" ref="formCustom" label-width="80px" style="height: 500px">
                <el-form-item label="用户名" prop="username" class="signup-label">
                    <el-input size="large" v-model="formCustom.username" placeholder="用户名" class="signup-input" maxLength="20">4-20位可由中文、数字、字母组成</el-input>
                    <!-- <span class="signup-label"></span> -->
                    <span class="signup-label">4-20位可由中文、数字、字母组成</span>
                </el-form-item>
                <el-form-item label="密码" prop="password" class="signup-label">
                    <el-input size="large" type="password" placeholder="密码" class="signup-input"  v-model="formCustom.passwd"></el-input>
                    <span class="signup-label">6-20位可由中文、数字、字母组成</span>
                </el-form-item>
                <el-form-item label="确认密码" prop="passwdCheck" class="signup-label">
                    <el-input size="large" type="password" placeholder="再次输入密码" class="signup-input"  v-model="formCustom.passwdCheck"></el-input>
                    <span class="signup-label">请在此确认您的密码</span>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="submitForm('formCustom')" class="signup-button">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    // import ErrorCode from '~/constant/ErrorCode'
    // import config from '~/config'
    // import request from '~/net/request'
    import {trim, trimBlur} from '@/utils/tool'
    import {register, getAdminInfo} from '@/api/getData'

    export default {
        data () {
            const validatePass = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入密码'))
                } else {
                    if (value.length < 6 || value.length > 20) {
                        return callback(new Error('密码必须6-20个字符'))
                    }
                    if (this.formCustom.passwdCheck !== '') {
                        // 对第二个密码框单独验证
                        this.$refs.formCustom.validateField('passwdCheck')
                    }
                    callback()
                }
            }
            const validatePassCheck = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请输入确认密码'))
                } else if (value !== this.formCustom.passwd) {
                    callback(new Error('两次输入密码不一致!'))
                } else {
                    callback()
                }
            }

            const validateUserName = (rule, value, callback) => {
                if (value && (value.length < 4 || value.length > 20)) {
                    callback(new Error('用户名长度必须4-20位'))
                }
                callback()
            }
            return {
                isMounted: false,
                loading: false,
                labelPosition: 'left',
                formCustom: {
                    passwd: '',
                    passwdCheck: '',
                    username: '',
                    email: ''
                },
                success: false,
                ruleCustom: {
                    passwd: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { validator: validatePass, trigger: 'blur' }
                    ],
                    passwdCheck: [
                        { required: true, message: '请输入确认密码', trigger: 'blur' },
                        { validator: validatePassCheck, trigger: 'blur' }
                    ],
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { validator: validateUserName, trigger: 'blur' }
                    ],
                    email: [
                        { required: true, message: '请输入邮箱', trigger: 'blur' },
                        { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
                    ]
                }
            }
        },
        head () {
            return {
                title: '注册'
            }
        },
        layout: 'onlyfooter',
        methods: {
            handleSubmit (name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.loading) {
                            return
                        }
                        this.loading = true
                        request.signup({
                            body: {
                                name: trim(this.formCustom.username),
                                password: trim(this.formCustom.passwd),
                                email: trim(this.formCustom.email)
                            }
                        }).then(res => {
                            this.loading = false
                            // if (res.errNo === ErrorCode.SUCCESS) {
                            //     this.success = true
                            //     this.$Message.success({
                            //         duration: config.messageDuration,
                            //         closable: true,
                            //         content: '提交成功!'
                            //     })
                            // } else {
                            //     this.$Message.error({
                            //         duration: config.messageDuration,
                            //         closable: true,
                            //         content: res.msg
                            //     })
                            // }
                        }).catch(err => {
                            this.loading = false
                            this.$Message.error({
                                duration: config.messageDuration,
                                closable: true,
                                content: err.message
                            })
                        })
                    }
                })
            },
            blur (name) {
                trimBlur(name, this)
            },
            async submitForm(formName) {
                this.$refs[formName].validate(async (valid) => {
                    if (valid) {
                        const res = await register({name: trim(this.formCustom.username), email: "111@111.com", password: trim(this.formCustom.passwd)})
                        if (res.errNo == 0) {
                            this.$message({
                                type: 'success',
                                message: '注册成功, 现在就去登录吧~~'
                            });
                            this.$router.push('manage')
                        }else{
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: '请输入用户名或密码',
                            offset: 100
                        });
                        return false;
                    }
                });
            },
        },
        mounted () {
            this.isMounted = true
        }
    }
</script>

<style>
    @import '../assets/styles/signup.css'
</style>
