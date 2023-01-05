<template>
  <div class="home">
    <el-container>
      <el-header height="80px" style="font-size: 24px">
        <el-row type="flex">
          <el-col :span="22"><span>广州商学院机房管理团队</span></el-col>
          <el-col :span="3">
            <el-dropdown @command="navigateToHandler">
              <i class="el-icon-setting" style="margin-right: 10px;color: #fff;"></i>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="SelfInfo">账户设置</el-dropdown-item>
                <el-dropdown-item command="logout">登出</el-dropdown-item>
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
              <el-menu-item index="/Home/Admin" v-if="$store.state.adminInfo.roleId == 1">
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
              <el-menu-item index="/Home/Clazz">
                <i class="el-icon-menu"></i>
                <span slot="title">实训室管理</span>
              </el-menu-item>
              <el-menu-item index="/Home/Building">
                <i class="el-icon-location-outline"></i>
                <span slot="title">实训楼管理</span>
              </el-menu-item>
              <el-menu-item index="/Home/QRCode">
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
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
var stompClient = null
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
    // 新建webSocket连接
    createWebSocketConnect () {
      let that = this
      // 建立WebSocket
      let socket = new SockJS(that.$store.state.webSocketPath)
      stompClient = Stomp.over(socket)
      stompClient.connect({}, function (frame) {
        stompClient.subscribe('/topic/receiveOrder', function (response) {
          console.log(response)
          if (response != null && response.body != null) {
            that.$notify({
              title: '新的维修工单',
              message: response.body
            })
          } else {
            that.$notify({
              title: '建立WebSocket通讯',
              message: '建立WebSocket通讯，暂时无法进行新增工单提醒'
            })
          }
        })
      })
    },
    // 断开webSocket连接
    disconnectWebSocket () {
      if (stompClient != null) {
        stompClient.disconnect()
      }
    },
    navigateToHandler (command) {
      console.log(command)
      if (command === 'logout') {
        this.$confirm('此操作将登出管理员账户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios.post('/api/admin/logout')
          this.disconnectWebSocket()
          this.$router.push({
            name: 'Login'
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
        return
      }
      this.$router.push({
        name: command
      })
    }
  },
  mounted () {
    // this.adminInfo = this.$store.state.adminInfo
    this.init()
    this.createWebSocketConnect()
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
    height: 100vh;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }

  body > .el-container {
    margin-bottom: 40px;
  }
</style>
