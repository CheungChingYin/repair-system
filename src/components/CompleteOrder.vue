<template>
  <div class="completeOrder">
    <el-row type="flex" style="height: 100px;">
      <el-col :span="19"><span style="font-size: 40px">工单历史管理</span></el-col>
      <el-col :span="4">
        <el-input type="text" placeholder="请输入历史工单ID或是问题关键词" v-model="completeOrderSearchBar"/>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="completeOrderSearchEvent(1)">搜索</el-button>
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
              <el-form-item label="工单备注：">
                <span>{{ props.row.remark }}</span>
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
              <el-form-item label="工单完成日期：">
                <span>{{ props.row.completeTime }}</span>
              </el-form-item>
              <el-form-item label="详情图片：">
                <span>
                  <!--{{ props.row.imagesPath }}-->
                  <el-button v-if="props.row.imagePath != ''" type="primary" size="mini" round @click="watchImage(props.row.imagePath)">查看图片</el-button>
                  <span v-if="props.row.imagePath == ''">无</span>
                </span>
              </el-form-item>
              <el-form-item label="受理工单管理员：">
                <span v-if="props.row.adminName != ''">{{ props.row.adminName }}</span>
                <span v-if="props.row.adminName == ''">无</span>
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
              <el-button type="primary" icon="el-icon-edit" round  size="mini"  @click="completeOrderUpdateEvent(scope.row)">修改工单</el-button>
              <el-button type="danger" icon="el-icon-circle-close" round  size="mini" @click="deleteCompleteOrder(scope.row.orderId)">删除</el-button>
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
      :visible.sync="dialogVisible.showImage">
      <!--<image :src="imageSrc"/>-->
      <img :src="imageSrc" style="width: 900px; height: 900px;" @click="imageClick"/>
    </el-dialog>
    <el-dialog
      title="历史工单修改"
      :visible.sync="dialogVisible.completeOrderUpdate">
      <el-form ref="completeOrderUpdateForm" :model="updateCompleteOrderInfo" label-width="80px">
        <el-form-item label="问题详情:">
          <el-input type="textarea" v-model="updateCompleteOrderInfo.problem" placeholder="请输入问题"></el-input>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input type="textarea" v-model="updateCompleteOrderInfo.remark" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetCompleteOrderForm">重置</el-button>
    <el-button type="danger" @click="completeOrderUpdateSubmit">确认修改</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CompleteOrder',
  data () {
    return {
      Info: [],
      pageMap: {},
      completeOrderSearchBar: '',
      dialogVisible: {
        showImage: false,
        completeOrderUpdate: false
      },
      imageSrc: '',
      updateCompleteOrderInfo: {
        orderId: '',
        problem: '',
        remark: ''
      }
    }
  },
  methods: {
    completeOrderInit () {
      this.axios.get('/api/completeOrders/getAllCompleteOrderInfo', {
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
    completeOrderUpdateEvent (orderContext) {
      this.updateCompleteOrderInfo.orderId = orderContext.orderId
      this.updateCompleteOrderInfo.problem = orderContext.problem
      this.updateCompleteOrderInfo.remark = orderContext.remark
      this.dialogVisible.completeOrderUpdate = true
    },
    completeOrderUpdateSubmit () {
      this.axios.post('/api/completeOrders/updateCompleteOrder', this.updateCompleteOrderInfo, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json'
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          this.$message({
            message: '修改历史工单成功！',
            type: 'success'
          })
          this.dialogVisible.completeOrderUpdate = false
          this.completeOrderInit()
        } else {
          this.$message.error('服务器出现异常，请稍后再试！')
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现异常，请稍后再试！')
      })
    },
    handleCurrentChange (val) {
      if (this.completeOrderSearchBar === '') {
        this.axios.get('/api/completeOrders/getAllCompleteOrderInfo', {
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
      } else {
        this.completeOrderSearchEvent(val)
      }
    },
    deleteCompleteOrder (orderId) {
      this.$confirm('此操作将永久删除该工单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.get('/api/completeOrders/deleteCompleteOrder', {
          params: {
            completeOrderId: orderId
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            this.$message({
              message: '删除工单成功！',
              type: 'success'
            })
            this.completeOrderInit()
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
    completeOrderSearchEvent (val) {
      let searchContext = this.completeOrderSearchBar
      let reg = /^[0-9]*$/
      let path = ''
      let params = {}
      if (reg.test(searchContext)) {
        path = '/api/completeOrders/getCompleteOrderInfoById'
        params = {
          page: val,
          completeOrderId: searchContext
        }
      } else {
        path = '/api/completeOrders/getCompleteOrderInfoByKeyWord'
        params = {
          page: val,
          keyWord: searchContext
        }
      }
      this.axios.get(path, {
        params: params
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
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    },
    imageClick () {
      let url = this.imageSrc
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
    },
    resetCompleteOrderForm () {
      this.$refs['completeOrderUpdateForm'].resetFields()
      this.$refs['completeOrderUpdateForm'].clearValidate()
      this.updateCompleteOrderInfo.problem = ''
      this.updateCompleteOrderInfo.remark = ''
    }
  },
  mounted () {
    this.completeOrderInit()
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
