<template>
  <div class="home">
    <el-container>
      <el-header height="80px" style="font-size: 24px">
        <el-row type="flex">
          <el-col :span="22"><span>佛山职业技术学院机房管理团队</span></el-col>
          <el-col :span="2">
            <el-dropdown>
              <i class="el-icon-setting" style="margin-right: 10px;color: #fff;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>管理员信息</el-dropdown-item>
                <el-dropdown-item>账户设置</el-dropdown-item>
                <el-dropdown-item>登出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <span>{{$store.state.adminInfo.adminName}}</span>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="300px">
          <el-scrollbar>
            <el-menu
              default-active="/Home/Admin"
              @open="handleOpen"
              @close="handleClose"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router="true">
              <el-menu-item index="/Home/Admin">
                <template slot="title">
                  <i class="el-icon-info"></i>
                  <span>管理员管理</span>
                </template>
              </el-menu-item>
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-document"></i>
                  <span>维修工单管理</span>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="1-1">受理工单</el-menu-item>
                  <el-menu-item index="1-2">工单历史</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="3">
                <i class="el-icon-menu"></i>
                <span slot="title">实训室管理</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-location-outline"></i>
                <span slot="title">实训楼管理</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-picture-outline"></i>
                <span slot="title">二维码管理</span>
              </el-menu-item>
            </el-menu>
          </el-scrollbar>
        </el-aside>
        <el-main>
          <router-view/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // adminInfo: {}
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    init () {
      this.$router.push({
        name: 'Admin'
      })
    }
  },
  mounted () {
    // this.adminInfo = this.$store.state.adminInfo
    this.init()
  }
}
</script>

<style scoped>
  .el-header, .el-footer {
    background-color: #545c64;
    color: #fff;
    line-height: 60px;
  }

  .el-aside {
    background-color: #545c64;
    color: #333;
    text-align: left;
    line-height: 200px;
    height: 1024px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    line-height: 80px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
