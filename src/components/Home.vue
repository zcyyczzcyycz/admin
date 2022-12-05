<template>
  <div class="home">
       <el-button type="danger" icon="el-icon-switch-button" circle @click="signOut"></el-button>
  </div>
</template>

<script>
export default {
 methods:{
    //  退出登录
     signOut(){
     sessionStorage.removeItem('token')
      this.$message({
                     message: '成功退出',
                     type: 'success'
                      });
     this.$router.replace('/login')
     }
 }
}
</script>

<style lang="less" scoped>

</style>