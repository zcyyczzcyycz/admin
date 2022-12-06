<template>
<div class="user">
   <!-- 面包屑导航 -->
   <el-breadcrumb separator-class="el-icon-arrow-right">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>
 <!-- 卡片 -->
  <el-card class="card">
  
  <el-row>
      <el-col :span="7">
            <!-- 输入框 -->
      <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear='getUserList'>
    <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
  </el-input>
      </el-col>
      <el-col :span="4">
          <el-button type="primary" style="margin-left:15px;" @click="addDialogVisible=true">添加用户</el-button>   
          <!-- 对话框-->
         <el-dialog
           title="添加用户"
           :visible.sync="addDialogVisible"
           width="50%"
           @close='addDialogClosed'
           >
           <!-- 表单 -->
          <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
           <el-form-item label="用户名" prop="username">
           <el-input v-model="addForm.username"></el-input>
          </el-form-item>
           <el-form-item label="密码" prop="password">
           <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
           <el-input v-model="addForm.email"></el-input>
          </el-form-item>
             <el-form-item label="手机" prop="mobile">
           <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
          </el-form>
           <!-- 底部按钮 -->
           <span slot="footer" class="dialog-footer">
             <el-button @click="addDialogVisible = false">取 消</el-button>
             <el-button type="primary" @click="addUser">确 定</el-button>
           </span>
         </el-dialog>
      </el-col>
  </el-row>
  <!-- 表格 -->
      <el-table
      style="width: 100%"
      :data="userList"
      border
      stripe>
        <el-table-column
        label="#"
        type="index">
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="username">
      </el-table-column>
        <el-table-column
        label="邮箱"
        prop="email">
      </el-table-column>
         <el-table-column
        label="电话"
        prop="mobile">
      </el-table-column>
         <el-table-column
        label="角色"
        prop="role_name">
      </el-table-column>
         <el-table-column
        label="状态"
        prop="mg_state">
        <template slot-scope="scope">
            <el-switch
             v-model="scope.row.mg_state"
             active-color="#13ce66"
             inactive-color="#ff4949"
             @change="userStateChanged(scope.row)">
            </el-switch>
        </template>
      </el-table-column>
         <el-table-column
        label="操作"
        prop="mobile">
        <template slot-scope="scope">
            <!-- 修改按钮 -->
       <el-tooltip effect="dark" content="修改" placement="top" :enterable='false'>
         <el-button type="primary" icon="el-icon-edit" size="mini"  @click="showEditDialog(scope.row.id)" style="margin-left:10px;"></el-button>
       </el-tooltip>
        <!-- 修改对话框 -->
         <el-dialog
             title="修改用户信息"
             :visible.sync="editDialogVisible"
             width="50%"
             @close='editDialogClosed'
             >
            <!-- 表单 -->
          <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
           <el-form-item label="用户名">
           <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
           <el-input v-model="editForm.email"></el-input>
          </el-form-item>
             <el-form-item label="手机" prop="mobile">
           <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
          </el-form>
             <!-- 底部按钮 -->
             <span slot="footer" class="dialog-footer">
               <el-button @click="editDialogVisible = false">取 消</el-button>
               <el-button type="primary" @click="editUserInfo">确 定</el-button>
             </span>
         </el-dialog>
            <!-- 删除按钮 -->
             <el-tooltip effect="dark" content="删除" placement="top" :enterable='false'>
               <el-button type="danger" icon="el-icon-delete" size="mini" style="margin-left:10px;" @click="open(scope.row.id)"></el-button>
             </el-tooltip>     
            <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配角色" placement="top" :enterable='false'>
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      </el-table>
      <!-- 分页器 -->
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
</div>
  
</template>

<script>
export default {
data(){
    // 自定义手机号验证规则
    const checkMobile = (rule, value, cb) => {
 let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
         if (reg.test(value)) {
         cb()
          } else {
         cb(new Error('手机号码格式不正确'))
      }
   }

    return{
        editForm:{
        
        },
        editDialogVisible:false,
        addForm:{
            username:'',
            password:'',
            email:'',
            mobile:''
        },
        editFormRules:{
             email:[
           { required: true, message: '请输入用户邮箱', trigger: 'blur' },
           { min: 3, max: 10, message: '请输入正确的邮箱格式', trigger: 'blur',type:'email' }
          ],
            mobile:[         
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
          ]
        },
        addFormRules:{
            username:[
           { required: true, message: '请输入用户名称', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
            ],
          password:[
           { required: true, message: '请输入用户密码', trigger: 'blur' },
           { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
          ],
            email:[
           { required: true, message: '请输入用户邮箱', trigger: 'blur' },
           { min: 3, max: 10, message: '请输入正确的邮箱格式', trigger: 'blur',type:'email' }
          ],
            mobile:[         
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
          ]
        },
    addDialogVisible:false,
     queryInfo:{
         query:'',
         pagenum:1,
         pagesize:2
     },
     userList:[],
     total:0
    }
},
methods:{
    // 获取用户列表
   async getUserList(){
    const {data :res} = await this.$http.get('users', {params: this.queryInfo})
    if(res.meta.status !== 200){ this.$message.error('获取用户列表失败');}
     this.userList = res.data.users
     this.total =  res.data.total
    },
    // 监听每页/条改变触发
    handleSizeChange(val){
     this.queryInfo.pagesize=val
     this.getUserList()
    },
    //  页码发生变化触发
    handleCurrentChange(val){
        this.queryInfo.pagenum=val
     this.getUserList()
    },
    // 保存开关变化状态
   async userStateChanged(val){
    const {data :res} = await this.$http.put(`users/${val.id}/state/${val.mg_state}`)
     if(res.meta.status !== 200){
         val.mg_state = !val.mg_state
          this.$message.error('状态更新失败');
          }
    },
    // 对话框关闭触发
    addDialogClosed(){
        this.$refs.addFormRef.resetFields()
    },
    // 点击对话框确认按钮触发,校验表单
    addUser(){
   this.$refs.addFormRef.validate(async (val) => {
       if(val){
        //    如果表单验证通过，发送axios添加用户
   const {data :res} = await this.$http.post('users', this.addForm)
    if(res.meta.status !== 201){ this.$message.error('添加用户失败');
    }else{
           this.$message({
                     message: '添加成功',
                     type: 'success'
                      });
       this.addDialogVisible = false
       this.getUserList()
    }
       }else{
          return this.$message.error('请填写正确的表单数据');
       }
      
   })
    },
        // 点击修改进行操作
   async showEditDialog(val){
const {data :res} = await this.$http.get(`users/${val}`)
    if(res.meta.status !== 200){ this.$message.error('查询用户信息失败');}
    this.editForm=res.data
this.editDialogVisible=true
},
// 关闭修改对话框触发
editDialogClosed(){
    this.$refs.editFormRef.resetFields()
},
// 点击修改对话框里确认按钮触发
editUserInfo(){
 this.$refs.editFormRef.validate(async (val) => {
     if(val){
      const {data :res} = await this.$http.put(`users/${this.editForm.id}`,{
          email:this.editForm.email,
          mobile:this.editForm.mobile
      })
    this.editDialogVisible=false
    this.getUserList()
     this.$message({
                     message: '修改成功',
                     type: 'success'
                      });
       if(res.meta.status !== 200){ this.$message.error('查询用户信息失败');}
     }else{
   return this.$message.error('用户信息不合法');
     }
 })
},
// 确认删除？？
     open(val) {
        this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
        const {data :res} = await this.$http.delete(`users/${val}`)
    if(res.meta.status !== 200){ this.$message.error('删除失败');}
      this.getUserList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
    



},

created(){
this.getUserList()
},

}
</script>

<style lang="less" scoped>
.user{
    .card{
        margin-top: 15px;
        font-size: 12px;
        min-height: 0;
    }
}
.el-table,.el-pagination{
    margin-top: 15px;
}

</style>