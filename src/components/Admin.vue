<template>
  <div class="admin">
    <el-row type="flex" justify="end" style="height: 150px;">
      <el-col span="4"><span style="font-size: 40px">管理员管理</span></el-col>
      <el-col span="15"></el-col>
      <el-col span="4">
        <el-input type="text" placeholder="请输入管理员ID或者姓名" v-model="adminSearchBar"/>
      </el-col>
      <el-col span="1">
        <el-button type="primary">搜索</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
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
          prop="roleId"
          label="管理员权限">
        </el-table-column>
        <el-table-column
          prop="adminEmail"
          label="管理员邮件地址">
        </el-table-column>
        <el-table-column
          label="操作">
        </el-table-column>
      </el-table>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data () {
    return {
      adminSearchBar: '',
      Info: []
    }
  }
}
</script>

<style scoped>
</style>
