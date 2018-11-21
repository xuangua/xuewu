<template>
    <div class="manage_page fillcontain">
        <el-row style="height: 100%;">
            <el-col :span="4"  style="min-height: 100%; background-color: #324057;">
                <el-menu :default-active="defaultActive" style="min-height: 100%;" theme="dark" router>
                    <el-menu-item index="manage"><i class="el-icon-menu"></i>首页</el-menu-item>
                    <el-submenu index="2" v-if="adminRole == 4">
                        <template slot="title"><i class="el-icon-document"></i>数据管理</template>
                        <el-menu-item index="userList">用户列表</el-menu-item>
                        <el-menu-item index="shopList">商家列表</el-menu-item>
                        <el-menu-item index="foodList">食品列表</el-menu-item>
                        <el-menu-item index="orderList">订单列表</el-menu-item>
                        <el-menu-item index="adminList">管理员列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="3" v-if="adminRole == 4">
                        <template slot="title"><i class="el-icon-plus"></i>添加数据</template>
                        <el-menu-item index="addShop">添加商铺</el-menu-item>
                        <!-- <el-menu-item index="addGoods">添加商品</el-menu-item> -->
                    </el-submenu>
                    <el-submenu index="4" v-if="adminRole == 4">
                        <template slot="title"><i class="el-icon-star-on"></i>图表</template>
                        <el-menu-item index="visitor">用户分布</el-menu-item>
                        <!-- <el-menu-item index="newMember">用户数据</el-menu-item> -->
                    </el-submenu>
                    <el-submenu index="5" v-if="adminRole == 4">
                        <template slot="title"><i class="el-icon-edit"></i>编辑</template>
                        <!-- <el-menu-item index="uploadImg">上传图片</el-menu-item> -->
                        <el-menu-item index="vueEdit">文本编辑</el-menu-item>
                    </el-submenu>
                    <el-submenu index="6" v-if="adminRole == 4">
                        <template slot="title"><i class="el-icon-setting"></i>设置</template>
                        <el-menu-item index="adminSet">管理员设置</el-menu-item>
                        <!-- <el-menu-item index="sendMessage">发送通知</el-menu-item> -->
                    </el-submenu>
                    <el-submenu index="7" v-if="adminRole == 4">
                        <template slot="title"><i class="el-icon-warning"></i>说明</template>
                        <el-menu-item index="explain">说明</el-menu-item>
                    </el-submenu>
                    <el-submenu index="8" v-if="adminRole == 4">
                        <template slot="title"><i class="el-icon-plus"></i>数据录入</template>
                        <el-menu-item index="shopAddress">添加地址</el-menu-item>
                        <el-menu-item index="foodCategory">添加商品</el-menu-item>
                        <el-menu-item index="shopAddressList">地址列表</el-menu-item>
                        <el-menu-item index="foodCategoryList">商品列表</el-menu-item>
                    </el-submenu>

                    <!-- 店铺所有者 -->
                    <el-submenu index="101">
                        <template slot="title"><i class="el-icon-plus"></i>我的店铺</template>
                        <el-menu-item index="shopList">店铺列表</el-menu-item>
                        <el-menu-item index="foodList">商品列表</el-menu-item>
                    </el-submenu>
                    <el-submenu index="102">
                        <template slot="title"><i class="el-icon-plus"></i>添加店铺</template>
                        <el-menu-item index="addShop">添加商铺</el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-col>
            <el-col :span="20" style="height: 100%;overflow: auto;">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        computed: {
            defaultActive: function(){
                return this.$route.path.replace('/', '');
            },
            adminRole:function(){
                return this.$store.state.adminInfo.role;
            }
        }
    }
</script>


<style lang="less" scoped>
    @import '../style/mixin';
    .manage_page{
        
    }
</style>
