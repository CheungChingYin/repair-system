<template>
    <div class="SelfInfo">
      <el-row type="flex" style="height: 50px;">
        <el-col :span="19">
          <span style="font-size: 40px">账户信息</span>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center">
        <el-col :span="10">
          <el-form :model="loginAdminInfo" status-icon :rules="rules" ref="selfInfoForm" style="width: 400px;">
            <el-form-item label="管理员ID" label-width="100px" prop="adminName">
              <el-input v-model="loginAdminInfo.adminId" placeholder="请输入管理员Id"></el-input>
            </el-form-item>
            <el-form-item label="管理员姓名" label-width="100px" prop="adminName">
              <el-input v-model="loginAdminInfo.adminName" placeholder="请输入管理员姓名"></el-input>
            </el-form-item>
            <el-form-item label="管理员手机号" label-width="100px" prop="adminPhone">
              <el-input v-model="loginAdminInfo.adminPhone" placeholder="请输入管理员密手机号"></el-input>
            </el-form-item>
            <el-form-item label="管理员邮箱" label-width="100px" prop="adminEmail">
              <el-input v-model="loginAdminInfo.adminEmail" placeholder="请输入管理员邮箱"></el-input>
            </el-form-item>
            <el-form-item label="管理员权限" label-width="100px" prop="roleId">
              <el-tag :type="loginAdminInfo.roleId == '0' ? '':'danger'">
                {{loginAdminInfo.roleId=='0' ? '普通管理员' : '超级管理员'}}
              </el-tag>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </div>
</template>

<script>
export default {
  name: 'SelfInfo',
  data () {
    return {
      loginAdminInfo: {}
    }
  },
  methods: {
    init () {
      this.loginAdminInfo = this.$store.state.adminInfo
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style scoped>

</style>
