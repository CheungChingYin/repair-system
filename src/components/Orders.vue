<template>
  <div class="orders">
    <el-row type="flex" style="height: 100px;">
      <el-col :span="19"><span style="font-size: 40px">受理工单管理</span></el-col>
      <el-col :span="4">
        <el-input type="text" placeholder="请输入工单ID" v-model="orderSearchBar"/>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="orderSearchEvent">搜索</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-table
        :data="Info"
        stripe
        style="width: 100%;">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="order-table-expand">
              <el-form-item label="工单ID：">
                <span>{{ props.row.orderId }}</span>
              </el-form-item>
              <el-form-item label="工单问题：">
                <span>{{ props.row.problem }}</span>
              </el-form-item>
              <el-form-item label="电脑编号：">
                <span>{{ props.row.computerNumber }}</span>
              </el-form-item>
              <el-form-item label="实训室名称：">
                <span>{{ props.row.className }}</span>
              </el-form-item>
              <el-form-item label="实训楼名称：">
                <span>{{ props.row.buildingName }}</span>
              </el-form-item>
              <el-form-item label="维修状态：">
                <span>
                  <el-tag :type="props.row.status == '0' ? 'danger':'success'">
                    {{props.row.status=='0' ? '未受理' : '受理中'}}
                  </el-tag>
                </span>
              </el-form-item>
              <el-form-item label="工单提交日期：">
                <span>{{ props.row.submitTime }}</span>
              </el-form-item>
              <el-form-item label="详情图片：">
                <span>
                  <!--{{ props.row.imagesPath }}-->
                  <el-button v-if="props.row.imagesPath != ''" type="primary" size="mini" round @click="watchImage(props.row.imagesPath)">查看图片</el-button>
                  <span v-if="props.row.imagesPath == ''">无</span>
                </span>
              </el-form-item>
              <el-form-item label="受理工单管理员：">
                <span v-if="props.row.adminName != ''">{{ props.row.adminName }}</span>
                <span v-if="props.row.adminName == ''">无</span>
              </el-form-item>
              <el-form-item label="报修人姓名：">
                <span>{{ props.row.userName }}</span>
              </el-form-item>
              <el-form-item label="报修人电话：">
                <span>{{ props.row.userPhone }}</span>
              </el-form-item>
              <el-form-item label="报修人邮箱：">
                <span>{{ props.row.userEmail }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          label="工单ID"
          width="100">
        </el-table-column>
        <el-table-column
          prop="problem"
          label="工单问题"
          width="300"
          :show-overflow-tooltip="true">
        </el-table-column>
        <el-table-column
          prop="status"
          label="工单状态"
          width="150">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status == '0' ? 'danger':'success'">
              {{scope.row.status=='0' ? '未受理' : '受理中'}}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="computerNumber"
          label="电脑编号"
          width="150">
        </el-table-column>
        <el-table-column
          prop="className"
          label="所属实训室"
          width="200">
        </el-table-column>
        <el-table-column
          prop="buildingName"
          label="所属实训楼"
          width="150">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <div v-if="scope.row.status == '1' && scope.row.adminId == $store.state.adminInfo.adminId || scope.row.status == '0'">
              <el-button type="primary" icon="el-icon-edit" round  size="mini" :disabled="scope.row.status == '0' ? false:true" @click="acceptOrder(scope.row.orderId)" v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在受理工单中，请稍后...">受理工单</el-button>
              <el-button type="success" icon="el-icon-check" round size="mini" :disabled="scope.row.status == '1' ? false:true" @click="completeOrderEvent(scope.row.orderId)">完成工单</el-button>
              <el-button type="danger" icon="el-icon-circle-close" round  size="mini" @click="deleteOrder(scope.row.orderId)">删除</el-button>
            </div>
            <span v-if="scope.row.status == '1' && scope.row.adminId != $store.state.adminInfo.adminId">您无权操作</span>
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
      title="图片"
      :visible.sync="dialogVisible.showImage"
      >
      <!--<image :src="imageSrc"/>-->
      <img :src="imageSrc" style="width: 900px; height: 900px;" @click="imageClick"/>
    </el-dialog>
    <el-dialog
      title="工单完成"
      :visible.sync="dialogVisible.completeOrder">
      <el-form ref="completeOrderForm" :model="completeOrderInfo" label-width="80px">
        <el-form-item label="备注">
          <el-input type="textarea" v-model="completeOrderInfo.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button >重置</el-button>
    <el-button type="primary" @click="completeOrderSubmit"  v-loading.fullscreen.lock="fullscreenLoading" element-loading-text="正在完成并迁移工单中，请稍后...">完成工单</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Orders',
  data () {
    return {
      orderSearchBar: '',
      Info: [],
      pageMap: {},
      dialogVisible: {
        showImage: false,
        completeOrder: false
      },
      imageSrc: '',
      fullscreenLoading: false,
      completeOrderInfo: {
        orderId: '',
        remark: ''
      }
    }
  },
  methods: {
    orderInit () {
      this.axios.get('/api/orders/getAllOrdersInfo', {
        params: {
          page: 1
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          this.pageMap = res.data.data.pageMap
          let info = res.data.data.Info
          if (info instanceof Array) {
            this.Info = info
          } else {
            let tempArray = []
            tempArray.push(info)
            this.Info = tempArray
          }
          this.$cookies.set('orderCountCookie', res.data.data.pageMap.count, 30 * 24 * 3600)
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    },
    watchImage (imagePath) {
      this.dialogVisible.showImage = true
      let path = this.$store.state.ServerDomain + imagePath
      this.imageSrc = path
      console.log(this.imageSrc)
    },
    acceptOrder (orderId) {
      this.$confirm('此操作将受理工单并发送邮件给报修人, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fullscreenLoading = true
        let adminId = this.$store.state.adminInfo.adminId
        console.log(adminId)
        this.axios.get('/api/orders/receiveOrder', {
          params: {
            orderId: orderId,
            adminId: adminId
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            this.fullscreenLoading = false
            this.$message({
              message: '受理工单成功！',
              type: 'success'
            })
            this.orderInit()
          } else {
            this.fullscreenLoading = false
            this.$message.error('服务器出现问题，请稍后再试！')
          }
        }.bind(this)).catch(function (error) {
          console.log(error)
          this.fullscreenLoading = false
          this.$message.error('服务器出现问题，请稍后再试！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消接收工单操作'
        })
      })
    },
    completeOrderEvent (orderId) {
      this.completeOrderInfo = {
        orderId: '',
        remark: ''
      }
      this.dialogVisible.completeOrder = true
      this.completeOrderInfo.orderId = orderId
    },
    completeOrderSubmit () {
      this.$confirm('此操作将工单迁移到完成工单中并发送邮件通知报修人完成维修, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.fullscreenLoading = true
        var qs = require('qs')
        this.axios.post('/api/orders/orderComplete', qs.stringify(this.completeOrderInfo), {
          headers: {
            'Accept': '*/*'
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            this.fullscreenLoading = false
            this.$message({
              message: '完成工单成功！',
              type: 'success'
            })
            this.dialogVisible.completeOrder = false
            this.orderInit()
          } else {
            this.fullscreenLoading = false
            this.$message.error('完成工单失败，请稍后再试！')
          }
        }.bind(this)).catch(function (error) {
          console.log(error)
          this.fullscreenLoading = false
          this.$message.error('服务器出现问题，请稍后再试！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消完成工单'
        })
      })
    },
    deleteOrder (orderId) {
      this.$confirm('此操作将永久删除该工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.get('/api/orders/deleteOrders', {
          params: {
            orderId: orderId
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            this.$message({
              message: '删除工单成功！',
              type: 'success'
            })
            this.orderInit()
          } else {
            this.$message.error('删除工单失败，请稍后再试！')
          }
        }.bind(this)).catch(function (error) {
          console.log(error)
          this.$message.error('服务器出现问题，请稍后再试！')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleCurrentChange (val) {
      this.axios.get('/api/orders/getAllOrdersInfo', {
        params: {
          page: val
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          this.pageMap = res.data.data.pageMap
          let info = res.data.data.Info
          if (info instanceof Array) {
            this.Info = info
          } else {
            let tempArray = []
            tempArray.push(info)
            this.Info = tempArray
          }
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('获取管理员列表失败，疑似服务器出现问题，请稍后重试')
      }.bind(this))
    },
    orderSearchEvent () {
      let searchContext = this.orderSearchBar
      this.axios.get('/api/orders/getOrdersInfoById', {
        params: {
          page: 1,
          orderId: searchContext
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          this.pageMap = res.data.data.pageMap
          let info = res.data.data.Info
          if (info instanceof Array) {
            this.Info = info
          } else {
            let tempArray = []
            tempArray.push(info)
            this.Info = tempArray
          }
        }
      }.bind(this))
    },
    imageClick () {
      let url = this.imageSrc
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
    }
  },
  mounted () {
    this.orderInit()
  }
}
</script>

<style scoped>
  .order-table-expand {
    font-size: 0;
  }
  .order-table-expand label {
    width: 90px;
    color: #99a9bf;
    font-size: 30px;
  }
  .order-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
</style>
