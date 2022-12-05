<template>
  <div class="login">
       <!-- 登录注册盒子 -->
     <div class="login_box">
          <!-- 圆形盒子 -->
         <div class="avatar_box">
             <img src="@/assets/logo.png" alt="">
         </div>
        <!-- 表单 -->
         <el-form label-width="0px" class="login_form" :model="form" :rules="loginFormRules" ref="ruleForm">
             <!-- 用户名 -->
           <el-form-item prop="username">
           <el-input prefix-icon="el-icon-user-solid" v-model="form.username" placeholder="请输入用户名"></el-input>
           </el-form-item> 
             <!-- 密码 -->
             <el-form-item prop="password">
           <el-input prefix-icon="el-icon-lock" v-model="form.password" type="password" placeholder="请输入密码"></el-input>
           </el-form-item>     
           <!-- 按钮 -->
            <el-form-item class="btns">
            <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
            <el-button type="info" @click="resetForm('ruleForm')">重置</el-button>
           </el-form-item>         
         </el-form>
     </div>
  </div>
</template>

<script>
export default {
 data() {
      return {
        form: {
          username: 'admin',
          password: '123456',
        },
       loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
          password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
        }
      }
    },
    methods:{
        // 重置表单
          resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    //   登录认证
         submitForm(formName) {
        this.$refs[formName].validate(async valid => {
            // 点击登录，账号密码规则认证通过，发送axios
          if (valid) {
       let {data:res} = await this.$http.post('login',this.form)
             // 认证输入的用户名密码是否正确
               if(res.meta.status==200){
                   this.$message({
                     message: '登录成功',
                     type: 'success'
                      });
                // 将服务器的token挂载到浏览器会话存储中
                 sessionStorage.setItem('token',res.data.token)
                //  跳转到home页面
                this.$router.push('/home')
                  
               }else{
                  this.$message.error('登录失败,账号密码有误');
               }
          }
           // 点击登录，账号密码不通过
           else {
            return false;
          }
        });
      },
    }
}
</script>

<style lang="less" scoped>

.login{
    background-color: #2b4b6b;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
  .login_box{
          width: 450px;
          height: 300px;
          background-color: white;
          border-radius: 3px;
          position: relative;
    .avatar_box{
         width: 130px;
         height: 130px;
         border: 1px solid #eee;
         border-radius: 50%;
         padding: 10px;
         box-shadow: 0 0 10px #ddd;
         position: absolute;
         left: 50%;
         transform: translate(-50%,-50%);   
         background-color: #fff;   
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
     }
  }
}
// element ui 样式修改
 .btns{
        display: flex;
        justify-content: center;
    }
 .login_form{
     position: absolute;
     bottom: 0;
     width: 100%;
     box-sizing: border-box;
     padding: 0 40px;
 }

</style>