<template>
    <el-container class="home">
       <!-- 头部区域 -->
       <el-header>
         <div>
           <img src="@/assets/heima.png" alt="">
           <span>电商后台管理系统</span>
         </div>
         <el-button type="danger" icon="el-icon-switch-button" circle @click="signOut" class="signout"></el-button>
      </el-header>
      <!-- 主体区域 -->
      <el-container>
        <!-- 侧边栏 -->
        <el-aside width="isCollapse ? '65px' : '200px'">
          <!-- 控制折叠展开按钮 -->
          <div class="toggle-button el-icon-refresh" @click="toggleCollapse"></div>
          <!-- 垂直导航栏 -->
            <el-menu
      background-color=#333744
      text-color="#fff"
      active-text-color="#409eff"
      :unique-opened="true"
      :collapse='isCollapse'
      :collapse-transition='false'
      :router="true"
      :default-active="activePath">
      <!-- 一级菜单 -->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
        <!-- 二级菜单 -->
          <el-menu-item v-for="subitem in item.children" :key="subitem.id" :index="subitem.path" @click="saveNavState(subitem.path)">
              <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{subitem.authName}}</span>
            </template>
          </el-menu-item>
      </el-submenu>

      
    </el-menu>
        </el-aside>
        <!-- 内容主体 -->
        <el-main>
          <!-- welcome路由站位 -->
          <router-view></router-view>
        </el-main>
    </el-container>
</el-container>
    

</template>

<script>
export default {
  data(){
    return{
      activePath:'',
      isCollapse:false,
      menulist:[],
      iconsObj:{
        125:'el-icon-user-solid',
        103:'el-icon-coin',
        101:'el-icon-s-goods',
        102:'el-icon-box',
        145:'el-icon-s-platform'
      }
    }
  },
 methods:{
    //  退出登录
     signOut(){
     sessionStorage.removeItem('token')
      this.$message({
                     message: '成功退出',
                     type: 'success'
                      });
     this.$router.replace('/login')
     },
    //  axios获取左侧菜单栏
  async getMenuList(){
   const {data :res} =  await this.$http.get('menus')
   if(res.meta.status !==200){  this.$message.error('左侧菜单渲染失败'); }
  this.menulist=res.data
    },
    // 点击切换菜单栏的显示状态
    toggleCollapse(){
     this.isCollapse =!this.isCollapse
    },
    // 点击二级导航栏高亮
    saveNavState(val){
      this.activePath=val
    }
 },
 created(){
  //  页面加载发送axios
   this.getMenuList()
 },
}
</script>

<style lang="less" scoped>
// element ui组件样式
  .el-header{
    background-color: #373d41;
    color: #fff;
    text-align: center;
    line-height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font: size 20px;
     div{
       display: flex;
       align-items: center;
       span{
         margin-left: 15px;
       }
     }
  }
  
  .el-aside {
    background-color: #333744;
    .el-menu{
      border: 0;
    }
    .toggle-button{
      background-color: #4A5064;
      width: 100%;
      color: #fff;
      line-height: 24px;
        text-align: center;
        cursor: pointer;
    }
  }
  
  .el-main {
    background-color: #EAEDF1;
    color: #333;
  }
  .signout{
    width: 40px;
    height: 40px;
  }
 
  .home{
    height: 100%;
  }
  
</style>