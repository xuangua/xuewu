<template>
  	<div>
<!--         <head-top signin-up='home'>
            <span class="title_text">选择店铺所在学校</span>
            <span slot='logo' class="head_logo"  @click="reload">选择店铺</span>
        </head-top> -->
        <head-top head-title="选择店铺所在学校" ></head-top>
        <nav class="city_nav">
            <div class="city_tip">
                <span>店铺地址：</span>
                <span>{{province}}{{city}}{{district}}</span>
            </div>
            <!-- <h4 class="city_title">选择</h4> -->
<!--             <router-link :to="'/city/' + guessCityid" class="guess_city">
                <span>{{guessCity}}</span>
                <svg class="arrow_right">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#arrow-right"></use>
                </svg>
            </router-link>   -->
        </nav>
<!--         <section id="hot_city_container">
            <h4 class="city_title">热门城市</h4>
            <ul class="citylistul clear">
                <router-link  tag="li" v-for="item in hotcity" :to="'/city/' + item.id" :key="item.id">
                    {{item.name}}
                </router-link>  
            </ul>
        </section>
        <section class="group_city_container">
            <ul class="letter_classify">
                <li v-for="(value, key, index) in sortgroupcity" :key="key"  class="letter_classify_li">
                    <h4 class="city_title">{{key}}
                        <span v-if="index == 0">（按字母排序）</span>
                    </h4>
                    <ul class="groupcity_name_container citylistul clear">
                        <router-link  tag="li" v-for="item in value" :to="'/city/' + item.id" :key="item.id" class="ellipsis">
                            {{item.name}}
                        </router-link>  
                    </ul>
                </li>
            </ul>
        </section> -->

      <div class="select-search">
        <div class="select-header" @click="isExpand=!isExpand">
          <input type="text" autocomplete="off" readonly :placeholder="placeholder" :value="placeholderValue" @keydown.down.prevent="selectChildWidthArrowDown" @keydown.up.prevent="selectChildWidthArrowUp" @keydown.enter="selectChildWidthEnter">
          <i class="fzicon " :class="isExpand?'fz-ad-jiantou1':'fz-ad-jiantou'"></i>
        </div>
        <div class="select-body" v-if="isExpand">
          <input type="text" placeholder="关键字" v-model="searchVal" autocomplete="off" @blur="resetDefaultStatus" @keydown.esc="resetDefaultStatus" @keydown.down.prevent="selectChildWidthArrowDown" @keydown.up.prevent="selectChildWidthArrowUp" @keydown.enter="selectChildWidthEnter">
          <transition name="el-fade-in-linear" mode="out-in">
            <div class="typeahead-filter" v-show="typeaheadData">
              <transition-group tag="ul" name="el-fade-in-linear">
                <li v-for="(item,index) in typeaheadData " :key="index" :class="item.active ? 'active':''" @mouseenter="setActiveClass(index)" @mouseleave="setActiveClass(index)" @click="selectChild(index)">
                  <a href="javascript:;">
                    {{item.text}}
                  </a>
                </li>
              </transition-group>
              <p class="noFound" v-show="typeaheadData && typeaheadData.length === 0">未能查询到,请重新输入!</p>
            </div>
          </transition>
        </div>
      </div>
    </div>

</template>

<script>
import {mapState, mapMutations} from 'vuex'
import headTop from '../../components/header/head'
import {cityGuess, hotcity, groupcity, getSupportedSchoolList} from '../../service/getData'

export default {
    data(){
        return{
            province: '',
            city: '',
            district: '',
            // locatedCity: '',
            guessCity: '',   //当前城市
            guessCityid: '', //当前城市id
            hotcity: [],     //热门城市列表
            groupcity: {},   //所有城市列表
            placeholderValue: '',// 给看到选择内容的
            isExpand: false,
            searchVal: '', // 搜索关键字
            resultVal: '', // 保存搜索到的值
            searchList: [], //保存过滤的结果集
            currentIndex: -1, // 当前默认选中的index,
            placeholder: '--请选择--',
            mapData: [
                    {
                      text: 'wofsdf',
                      value: 0
                    },
                    {
                      text: '我是技术渣1',
                      value: 1
                    },
                    {
                      text: '我是技术渣2',
                      value: 2
                    },
                    {
                      text: '我是天坑',
                      value: 3
                    },
                    {
                      text: '我是天坑,分身乏术',
                      value: 4
                    },
                    {
                      text: '我是天坑2,分身乏术',
                      value: 5
                    },
                    {
                      text: '我是天坑3,分身乏术',
                      value: 6
                    }
                  ],
            filteredMapData: [],
            supportedSchoolDetailList: [],
        }
    },

	mounted(){
        this.initData();
        // 获取当前城市
        // cityGuess().then(res => {
        //     // this.guessCity = "武汉";  //res.name;
        //     // this.guessCityid = 7;     //res.id;
        //     this.guessCity = res.name;
        //     this.guessCityid = res.id;
        //     console.log(res)
        // })

        // //获取热门城市
        // hotcity().then(res => {
        //     this.hotcity = res;
        //     console.log(res)
        // })

        // //获取所有城市
        // groupcity().then(res => {
        //     this.groupcity = res;
        //     console.log(res)
        // })
    },

    components:{
        headTop
    },

    computed:{
        ...mapState([
            'realaddressDetail','decidedSchoolData','realAddrName','shopAddrName'
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
        },

        typeaheadData () {
            let temp = [];
            if (this.searchVal === '') {
                return this.mapData;
            } else {
                this.currentIndex = -1;  // 重置特殊情况下的索引
                this.mapData.forEach(item => {
                    item.active = false; // 取消高亮
                    if (item.text.indexOf(this.searchVal.toLowerCase().trim()) !== -1) {
                        temp.push(item)
                    }
                })
                // console.log('typeaheadData () temp')
                // console.log(temp)
                this.filteredMapData = temp
                return temp;
            }
        }
    },

    methods:{
        ...mapMutations([
            'SAVE_USER_CHOSEN_SCHOOL_ADDRESS', 'UPDATE_USER_DETAIL_ADDRESS'
        ]),
        //点击图标刷新页面
        reload(){
            window.location.reload();
        },

        async initData(){
            console.log('this.realaddressDetail')
            console.log(this.realaddressDetail)

            // TODO: change to real city, here hack to Wuhan
            // this.province = this.realaddressDetail.ad_info.province
            // this.city = this.realaddressDetail.ad_info.city
            // if (this.province === this.city){
            //     this.province = ''
            // }
            // this.district = this.realaddressDetail.ad_info.district
            this.province = '湖北省'
            this.city = '武汉市'
            this.district = '洪山区'
            // this.locatedCity = this.realaddressDetail.ad_info.province 

            // 获取以支持学校列表
            let res = await getSupportedSchoolList(this.province, this.city, this.district);
            if (res.errNo == 0) {
                this.mapData = res.supportedSchoolList;
                this.supportedSchoolDetailList = res.supportedSchoolDetailList;
            }
            console.log('getSupportedSchoolList() res')
            console.log(res)
        },

      resetDefaultStatus () {
        this.searchVal = '';
        this.resultVal = '';
        this.currentIndex = -1;
        this.typeaheadData.forEach(item => {
          this.$set(item, 'active', false);
        })
      },
      setActiveClass (index) { // 设置样式活动类
        // console.log('setActiveClass (index)')
        // console.log(index)
        // console.log(innerIndex)
        console.log(this.filteredMapData)
        this.filteredMapData.forEach((item, innerIndex) => {
          if (index === innerIndex) {
            this.$set(item, 'active', true);
            this.currentIndex = index;  // 这句话是用来修正index,,就是键盘上下键的索引,不然会跳位
          } else {
            this.$set(item, 'active', false)
          }
        })
      },
      selectChildWidthArrowDown () {
        // 判断index选中子项
        if (this.currentIndex < this.typeaheadData.length) {
          this.currentIndex++;
          this.typeaheadData.forEach((item, index) => {
            this.currentIndex === index ? this.$set(item, 'active', true) : this.$set(item, 'active', false);
          })
        }
      },
      selectChildWidthArrowUp () {
        // 判断index选中子项
        if (this.currentIndex > 0) {
          this.currentIndex--;
          this.typeaheadData.forEach((item, index) => {
            this.currentIndex === index ? this.$set(item, 'active', true) : this.$set(item, 'active', false);
          })
        }
      },
      selectChildWidthEnter () {
        // 若是结果集只有一个,则默认选中
        if (this.typeaheadData.length === 1) {
          this.searchVal = this.typeaheadData[0].text;
          this.resultVal = this.typeaheadData[0].value;
          this.placeholderValue = this.typeaheadData[0].text;
          this.isExpand = false;
          this.$emit('selectValue', { text: this.searchVal, value: this.resultVal })
        } else {
          // 若是搜索的内容完全匹配到项内的内容,则默认选中
          this.typeaheadData.forEach(item => {
            if (this.searchVal === item.text || item.active === true) {
              this.searchVal = item.text;
              this.placeholderValue = item.text;
              this.resultVal = item.value;
              this.isExpand = false;
              this.$emit('selectValue', { text: this.searchVal, value: this.resultVal })
            }
          })
        }
        this.resetDefaultStatus();
      },
      selectChild (index) {
        // 鼠标点击选择子项
        // console.log('selectChild (index)')
        // console.log(index)
        let schoolCampusName = '';
        let schoolCampusId = 0;
        this.filteredMapData.forEach((item, innerIndex) => {
          if (index === innerIndex || item.active) {
            this.searchVal = item.text;
            this.resultVal = item.value;
            this.placeholderValue = item.text;
            this.isExpand = false;

            schoolCampusName = item.text;
            schoolCampusId = item.value;
          }
          this.$set(item, 'active', false);
        })
        this.$emit('selectValue', { text: this.searchVal, value: this.resultVal });
        this.resetDefaultStatus();

        // console.log('schoolCampusName+schoolCampusId')
        // console.log(schoolCampusName)
        // console.log(schoolCampusId)
        if ((schoolCampusName != '') && (schoolCampusId!=0)) {
            //only pass schoolCampusId for msite check, other param pass with vuex
            let tmpProvince = this.province
            let tmpCity = this.city
            let tmpDistrict = this.district

            // this.supportedSchoolDetailList.forEach((item) => {
            for (var i=0;i<this.supportedSchoolDetailList.length;i++) {
                let tmpSchoolId = this.supportedSchoolDetailList[i].id;
                let tmpSchoolName = this.supportedSchoolDetailList[i].school_name;
                let tmpSchoolCampusName = this.supportedSchoolDetailList[i].school_campus_name;
                let tempSchoolCampusName = tmpSchoolName + tmpSchoolCampusName;
                // console.log('tempSchoolCampusName + item.id')
                // console.log(tempSchoolCampusName)
                // console.log(item.id)
                if ( (tempSchoolCampusName === schoolCampusName) && (schoolCampusId === tmpSchoolId) ) {
                    let chosenSchoolCampusData = {
                        province: this.province,
                        city: this.province,
                        district: this.province,
                        schoolName: tmpSchoolName,
                        schoolCampusName: tmpSchoolCampusName,
                        schoolCampusId: schoolCampusId,
                    }
                    console.log('home.uve chosenSchoolCampusData')
                    console.log(chosenSchoolCampusData)
                    this.SAVE_USER_CHOSEN_SCHOOL_ADDRESS(chosenSchoolCampusData);
                    let shopAddrName = tmpSchoolName
                    if (tmpSchoolCampusName != '') {
                        shopAddrName = tmpSchoolName + '(' + tmpSchoolCampusName + ')';
                    }
                    let updateUserDetailAddrData = {
                        shopAddrName: shopAddrName,
                        decidedSchoolData: this.supportedSchoolDetailList[i]
                    }
                    this.UPDATE_USER_DETAIL_ADDRESS(updateUserDetailAddrData);
                    break;
                }
            }
            // })
            window.location.href="/msite?chooseSchoolId="+schoolCampusId;
            // this.$router.push({path: "/msite", query: {chooseSchoolId: schoolCampusId}});            
        }
      },
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
    .home_title{
        @include center;
        width: 50%;
        color: #fff;
        text-align: center;
        margin-left: -0.5rem;
        .title_text{
            @include sc(0.8rem, #fff);
            text-align: center;
            display: block;
        }
    }
    .city_nav{
        padding-top: 2.35rem;
        border-top: 1px solid $bc;
        background-color: #fff;
        margin-bottom: 0.4rem;
        .city_tip{
            @include fj;
            line-height: 1.45rem;
            padding: 0 0.45rem;
            span:nth-of-type(1){
                @include sc(0.55rem, #666);
            }
            span:nth-of-type(2){
                font-weight: 900;
                @include sc(0.475rem, #9f9f9f);
            }

        }
        .guess_city{
            @include fj;
            align-items: center;
            height: 1.8rem;
            padding: 0 0.45rem;
            border-top: 1px solid $bc;
            border-bottom: 2px solid $bc;
            @include font(0.75rem, 1.8rem);
            span:nth-of-type(1){
                color: $blue;
            }
            .arrow_right{
                @include wh(.6rem, .6rem);
                fill: #999;
            }
        }
    }
    #hot_city_container{
        background-color: #fff;
        margin-bottom: 0.4rem;
    }
    .citylistul{
        li{
            float: left;
            text-align: center;
            color: $blue;
            border-bottom: 0.025rem solid $bc;
            border-right: 0.025rem solid $bc;
            @include wh(25%, 1.75rem);
            @include font(0.6rem, 1.75rem);
        }
        li:nth-of-type(4n){
            border-right: none;
        }
    }
    .city_title{
        color: #666;
        font-weight: 400;
        text-indent: 0.45rem;
        border-top: 2px solid $bc;
        border-bottom: 1px solid $bc;
        @include font(0.55rem, 1.45rem, "Helvetica Neue");
        span{
            @include sc(0.475rem, #999);
        }
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

    .el-fade-in-linear-enter-active,
    .el-fade-in-linear-leave-active,
    .fade-in-linear-enter-active,
    .fade-in-linear-leave-active {
        transition: opacity .2s linear;
    }

    .el-fade-in-enter,
    .el-fade-in-leave-active,
    .el-fade-in-linear-enter,
    .el-fade-in-linear-leave,
    .el-fade-in-linear-leave-active,
    .fade-in-linear-enter,
    .fade-in-linear-leave,
    .fade-in-linear-leave-active {
        opacity: 0;
    }

    .select-search {
    a {
        color: #333;
        text-decoration: none;
        padding: 5px;
    }
    ul {
      list-style: none;
      padding: 6px 0;
      margin: 0;
      overflow: visible;
      li {
        display: block;
        width: 100%;
        padding: 5px;
        font-size: 14px;
        padding: 8px 10px;
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #48576a;
        height: 36px;
        line-height: 1.5;
        box-sizing: border-box;
        cursor: pointer;
        &.active {
          background-color: #20a0ff;
          a {
            color: #fff;
          }
        }
      }
    }
    .select-header {
      position: relative;
      border-radius: 4px;
      border: 1px solid #bfcbd9;
      outline: 0;
      padding: 0 8px;
      >input {
        border: none;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        width: 100%;
        outline: 0;
        box-sizing: border-box;
        color: #1f2d3d;
        font-size: inherit;
        height: 36px;
        line-height: 1;
      }
      >i {
        transition: all .3s linear;
        display: inline-block;
        position: absolute;
        right: 3%;
        top: 50%;
        transform: translateY(-50%);
      }
    }
    .select-body {
      z-index: 1000;
      border-radius: 2px;
      background-color: #fff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      box-sizing: border-box;
      margin: 5px 0;
      padding: 8px;
      >input {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645, .045, .355, 1);
        width: 100%;
        display: inline-block;
      }
    }
    }
</style>


<!-- <template>

</template>
 -->
<!-- <script>
  export default {
    name: 'selectSearch',
    data: function () {
      return {

      }
    },
    computed: {

    },
    props: {
      
    },
    methods: {

    }
  }
</script> -->

<!-- <style scoped lang="scss">

</style> -->
