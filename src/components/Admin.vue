<template>
  <div class="admin">
    <el-row type="flex" style="height: 50px;">
      <el-col :span="19"><span style="font-size: 40px">管理员管理</span></el-col>
      <el-col :span="4">
        <el-input type="text" placeholder="请输入管理员ID或者姓名" v-model="adminSearchBar"/>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="searchEvent()">搜索</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="1" :pull="4">
        <el-button type="primary" @click="addAdminEvent">添加管理员</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-table
        :data="Info"
        stripe
        style="width: 100%;">
        <el-table-column
          prop="adminId"
          label="管理员ID"
          width="180">
        </el-table-column>
        <el-table-column
          prop="adminName"
          label="管理员姓名"
          width="180">
        </el-table-column>
        <el-table-column
          prop="adminPhone"
          label="管理员手机号">
        </el-table-column>
        <el-table-column
          label="管理员权限">
          <template slot-scope="scope">
            <el-tag :type="scope.row.roleId == '0' ? '':'danger'">
              {{scope.row.roleId=='0' ? '普通管理员' : '超级管理员'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="adminEmail"
          label="管理员邮件地址">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" round @click="updateAdminEvent(scope.row)" size="mini">修改</el-button>
            <el-button type="warning" icon="el-icon-warning" round @click="resetAdminPasswordEvent(scope.row.adminId)" size="mini">密码重置</el-button>
            <el-button type="danger" icon="el-icon-circle-close" round @click="deleteAdminEvent(scope.row.adminId)" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row justify="center" type="flex" style="background-color: white;padding-top: 40px">
      <el-pagination
        background
        @current-change="handleCurrentChange"
        :current-page.sync="pageMap.page"
        :page-size="10"
        layout="total, prev, pager, next"
        :total="pageMap.count">
      </el-pagination>
    </el-row>
    <el-dialog
      title="添加管理员"
      :visible.sync="dialogVisible.addAdmin"
      width="30%">
      <el-form :model="addAdminInfo" status-icon :rules="rules" ref="addAdminForm" style="width: 400px;">
        <el-form-item label="管理员姓名" label-width="100px" prop="adminName">
          <el-input v-model="addAdminInfo.adminName" placeholder="请输入管理员姓名"></el-input>
        </el-form-item>
        <el-form-item label="管理员密码" label-width="100px" prop="adminPassword">
          <el-input v-model="addAdminInfo.adminPassword" type="password" placeholder="请输入管理员密码"></el-input>
        </el-form-item>
        <el-form-item label="管理员手机号" label-width="100px" prop="adminPhone">
          <el-input v-model="addAdminInfo.adminPhone" placeholder="请输入管理员密手机号"></el-input>
        </el-form-item>
        <el-form-item label="管理员邮箱" label-width="100px" prop="adminEmail">
          <el-input v-model="addAdminInfo.adminEmail" placeholder="请输入管理员邮箱"></el-input>
        </el-form-item>
        <el-form-item label="管理员权限" label-width="100px" prop="roleId">
          <el-select v-model="addAdminInfo.roleId" placeholder="请选择管理员权限">
            <el-option label="普通管理员" value="0"></el-option>
            <el-option label="超级管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="addAdminReset">重置</el-button>
    <el-button type="primary" @click="addAdminSubmit">提交</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="修改管理员"
      :visible.sync="dialogVisible.updateAdmin"
      width="30%">
      <el-form :model="updateAdminInfo" status-icon :rules="rules" ref="updateAdminForm" style="width: 400px;">
        <el-form-item label="管理员姓名" label-width="100px" prop="adminName">
          <el-input v-model="updateAdminInfo.adminName" placeholder="请输入管理员姓名"></el-input>
        </el-form-item>
        <el-form-item label="管理员手机号" label-width="100px" prop="adminPhone">
          <el-input v-model="updateAdminInfo.adminPhone" placeholder="请输入管理员密手机号"></el-input>
        </el-form-item>
        <el-form-item label="管理员邮箱" label-width="100px" prop="adminEmail">
          <el-input v-model="updateAdminInfo.adminEmail" placeholder="请输入管理员邮箱"></el-input>
        </el-form-item>
        <el-form-item label="管理员权限" label-width="100px" prop="roleId">
          <el-select v-model="updateAdminInfo.roleId" placeholder="请选择管理员权限">
            <el-option label="普通管理员" value="0"></el-option>
            <el-option label="超级管理员" value="1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="updateAdminReset">重置</el-button>
    <el-button type="primary" @click="updateAdminSubmit">更改</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="重置管理员密码"
      :visible.sync="dialogVisible.resetAdminPassword"
      width="30%">
      <el-form :model="resetAdminPasswordInfo" status-icon :rules="resetRules" ref="resetAdminPasswordForm" style="width: 400px;">
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="resetAdminPasswordInfo.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="resetAdminPasswordInfo.checkPass" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetAdminPasswordReset">重置</el-button>
    <el-button type="danger" @click="resetAdminPasswordSubmit">重置密码</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.resetAdminPasswordInfo.checkPass !== '') {
          this.$refs.resetAdminPasswordForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.resetAdminPasswordInfo.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      adminSearchBar: '',
      Info: [],
      pageMap: {},
      dialogVisible: {
        addAdmin: false,
        updateAdmin: false,
        resetAdminPassword: false
      },
      addAdminInfo: {
        adminEmail: '',
        adminName: '',
        adminPassword: '',
        adminPhone: '',
        roleId: ''
      },
      updateAdminInfo: {
        adminEmail: '',
        adminId: '',
        adminName: '',
        adminPhone: '',
        roleId: ''
      },
      resetAdminPasswordInfo: {
        adminId: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        adminName: [
          {required: true, message: '请输入管理员姓名', trigger: 'blur'}
        ],
        adminPassword: [
          {required: true, message: '请输入管理员密码', trigger: 'blur'}
        ],
        adminPhone: [
          {required: true, message: '请输入管理员手机号', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        adminEmail: [
          {required: true, message: '请输入管理员邮箱地址', trigger: 'blur'}
        ],
        roleId: [
          {required: true, message: '请选择管理员权限', trigger: 'blur'}
        ]
      },
      resetRules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    adminInit () {
      // let qs = require('qs')
      this.axios.get('/api/admin/getAllAdminInfo', {
        params: {
          page: 1
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          this.Info = res.data.data.Info
          this.pageMap = res.data.data.pageMap
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('获取管理员列表失败，服务器出现问题，请稍后重试')
      }.bind(this))
    },
    handleCurrentChange (val) {
      this.axios.get('/api/admin/getAllAdminInfo', {
        params: {
          page: val
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          this.Info = res.data.data.Info
          this.pageMap = res.data.data.pageMap
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('获取管理员列表失败，疑似服务器出现问题，请稍后重试')
      }.bind(this))
    },
    addAdminEvent () {
      this.dialogVisible.addAdmin = true
      this.$refs['addAdminForm'].resetFields()
    },
    updateAdminEvent (updateRowInfo) {
      this.dialogVisible.updateAdmin = true
      this.updateAdminInfo = {
        adminEmail: updateRowInfo.adminEmail,
        adminId: updateRowInfo.adminId,
        adminName: updateRowInfo.adminName,
        adminPhone: updateRowInfo.adminPhone,
        roleId: updateRowInfo.roleId
        // console.log(updateRowInfo)
      }
      this.$refs['updateAdminForm'].clearValidate()
    },
    resetAdminPasswordEvent (adminId) {
      this.resetAdminPasswordInfo = {
        adminId: '',
        pass: '',
        checkPass: ''
      }
      this.dialogVisible.resetAdminPassword = true
      this.resetAdminPasswordInfo.adminId = adminId
      console.log(this.resetAdminPasswordInfo.adminId)
      // this.$refs['resetAdminPasswordForm'].resetFields()
      this.$refs['resetAdminPasswordForm'].clearValidate()
    },
    addAdminSubmit () {
      this.$refs['addAdminForm'].validate((valid) => {
        if (valid) {
          this.axios.post('/api/admin/saveAdministratorInfo', this.addAdminInfo, {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.$message({
                message: '添加管理员成功！',
                type: 'success'
              })
              this.adminInit()
            } else {
              this.$message.error('服务器出现异常，添加管理员失败，请稍后再试！')
            }
          }.bind(this))
          this.$refs['addAdminForm'].clearValidate()
          this.dialogVisible.addAdmin = false
        } else {
          this.$message({
            message: '请按照提示正确输入管理员信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    addAdminReset () {
      this.$refs['addAdminForm'].resetFields()
      this.$refs['addAdminForm'].clearValidate()
    },
    updateAdminSubmit () {
      this.$refs['updateAdminForm'].validate((valid) => {
        if (valid) {
          this.axios.post('/api/admin/updateAdministratorInfo', this.updateAdminInfo, {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.$message({
                message: '修改管理员成功！',
                type: 'success'
              })
              this.adminInit()
            } else {
              this.$message.error('服务器出现异常，修改管理员失败，请稍后再试！')
            }
          }.bind(this))
          this.dialogVisible.updateAdmin = false
        } else {
          this.$message({
            message: '请按照提示正确修改管理员信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    updateAdminReset () {
      this.$refs['updateAdminForm'].resetFields()
      this.$refs['updateAdminForm'].clearValidate()
      this.updateAdminInfo = {
        adminEmail: '',
        adminId: '',
        adminName: '',
        adminPhone: '',
        roleId: ''
      }
    },
    resetAdminPasswordSubmit () {
      this.$refs['resetAdminPasswordForm'].validate((valid) => {
        if (valid) {
          let resetInfo = this.resetAdminPasswordInfo
          let resetPassword = {
            adminId: resetInfo.adminId,
            adminPassword: resetInfo.checkPass
          }
          this.axios.post('/api/admin/updateAdministratorInfo', resetPassword, {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.$message({
                message: '修改管理员密码成功！',
                type: 'success'
              })
              this.adminInit()
            } else {
              this.$message.error('服务器出现异常，修改管理员密码失败，请稍后再试！')
            }
          }.bind(this))
          this.dialogVisible.resetAdminPassword = false
        } else {
          this.$message({
            message: '请按照提示正确修改管理员信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    resetAdminPasswordReset () {
      this.resetAdminPasswordInfo = {}
      this.$refs['resetAdminPasswordForm'].resetFields()
      this.$refs['resetAdminPasswordForm'].clearValidate()
    },
    deleteAdminEvent (adminId) {
      // console.log(adminId)
      this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.get('/api/admin/deleteAdministratorInfo', {
          params: {
            adminId: adminId
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.adminInit()
        }.bind(this)).catch(function (error) {
          console.log(error)
          this.$message.error('服务器出现问题，删除管理员失败，请稍后重试')
        }.bind(this))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    searchEvent () {
      let reg = /^[0-9]*$/
      let path = ''
      let searchContext = this.adminSearchBar
      let params = {}
      if (reg.test(searchContext)) {
        path = '/api/admin/getAdminInfoById'
        params = {
          page: 1,
          id: searchContext
        }
      } else {
        path = '/api/admin/getAdminInfoByName'
        params = {
          page: 1,
          adminName: searchContext
        }
      }
      this.axios.get(path, {
        params: params
      }).then(function (res) {
        // console.log(res)
        if (res.data.status === 200) {
          let info = res.data.data.Info
          if (info instanceof Array) {
            // console.log('是数组')
            this.Info = info
          } else {
            // console.log('非数组')
            let tempArray = []
            tempArray.push(info)
            this.Info = tempArray
          }
          this.pageMap = res.data.data.pageMap
        }
        // console.log(res.data.data.Info)
        // console.log(this.Info)
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
      // console.log(path)
    }
  },
  mounted () {
    this.adminInit()
  }
}
</script>

<style scoped>
</style>
