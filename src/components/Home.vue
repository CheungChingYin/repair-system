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
                  <el-badge :value="showOrderCount" class="item">
                    <span>维修工单管理</span>
                  </el-badge>
                </template>
                <el-menu-item-group>
                  <el-menu-item index="/Home/Orders" @click="showOrderCount = ''">
                    <el-badge :value="showOrderCount" class="item">
                      <span>受理工单</span>
                    </el-badge>
                  </el-menu-item>
                  <el-menu-item index="/Home/CompleteOrder">工单历史</el-menu-item>
                </el-menu-item-group>
              </el-submenu>
              <el-menu-item index="3">
                <i class="el-icon-menu"></i>
                <span slot="title">实训室管理</span>
              </el-menu-item>
              <el-menu-item index="/Home/Building">
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
      showOrderCount: ''
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
    },
    orderCountChange () {
      this.axios.get('/api/orders/getAllOrdersInfo', {
        params: {
          page: 1
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          let oldCount = this.$cookies.get('orderCountCookie')
          let newCount = res.data.data.pageMap.count
          if (oldCount === '') {
            this.$cookies.set('orderCountCookie', newCount, 30 * 24 * 3600)
          } else {
            if (oldCount < newCount) {
              let showFlag = false
              let showCount = newCount - oldCount
              if (this.showOrderCount < showCount) {
                showFlag = true
              }
              this.showOrderCount = showCount
              if (showFlag) {
                this.$notify({
                  title: '新的维修工单',
                  message: '有' + showCount + '条新的维修工单，请及时查阅！'
                })
              }
            } else {
              this.showOrderCount = ''
            }
          }
        } else {
          this.$message.error('服务器出现错误，请重新登陆再试')
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    }
  },
  mounted () {
    // this.adminInfo = this.$store.state.adminInfo
    this.init()
    this.orderCountChange()
    setInterval(this.orderCountChange, 30 * 1000)
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
    height: 1024px;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
</style>
