<template>
  <div class="building">
    <el-row type="flex" style="height: 50px;">
      <el-col :span="19"><span style="font-size: 40px">实训楼管理</span></el-col>
      <el-col :span="4">
        <el-input type="text" placeholder="请输入实训楼ID或者实训楼名称" v-model="buildingSearchBar"/>
      </el-col>
      <el-col :span="1">
        <el-button type="primary" @click="buildingSearchEvent(1)">搜索</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="end">
      <el-col :span="1" :pull="4">
        <el-button type="primary" @click="addBuildingEvent">添加实训楼</el-button>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center" style="margin-top: 20px">
      <el-table
        :data="Info"
        stripe
        style="width: 100%;">
        <el-table-column
          prop="buildingId"
          label="实训楼ID">
        </el-table-column>
        <el-table-column
          prop="buildingName"
          label="实训楼名称">
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" round @click="updateBuildingEvent(scope.row)" size="mini">修改
            </el-button>
            <el-button type="danger" icon="el-icon-circle-close" round
                       @click="deleteBuildingEvent(scope.row.buildingId)" size="mini">删除
            </el-button>
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
      title="添加实训楼"
      :visible.sync="dialogVisible.addBuilding">
      <el-form ref="buildingAddForm" :model="buildingAddInfo" label-width="100px" :rules="rules" style="width: 400px;">
        <el-form-item label="实训楼名称:" prop="buildingName">
          <el-input type="text" v-model="buildingAddInfo.buildingName" placeholder="请输入实训楼名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetBuildingAddForm">重置</el-button>
    <el-button type="primary" @click="buildingAddSubmit">确认添加</el-button>
  </span>
    </el-dialog>
    <el-dialog
      title="修改实训楼"
      :visible.sync="dialogVisible.updateBuilding">
      <el-form ref="buildingUpdateForm" :model="buildingUpdateInfo" label-width="100px" :rules="rules" style="width: 400px;">
        <el-form-item label="实训楼名称:" prop="buildingName">
          <el-input type="text" v-model="buildingUpdateInfo.buildingName" placeholder="请输入实训楼名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="resetUpdateBuildingForm">重置</el-button>
    <el-button type="danger" @click="buildingUpdateSubmit">确认修改</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Building',
  data () {
    return {
      Info: [],
      pageMap: [],
      buildingSearchBar: '',
      dialogVisible: {
        addBuilding: false,
        updateBuilding: false
      },
      buildingAddInfo: {
        buildingName: ''
      },
      buildingUpdateInfo: {
        buildingId: '',
        buildingName: ''
      },
      rules: {
        buildingName: [
          {required: true, message: '请输入实训楼名称', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    queryBuildingAllInfo (page) {
      this.axios.get('/api/building/getAllBuildingInfo', {
        params: {
          page: page
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
        } else {
          this.$message.error('服务器出现错误，无法获取实训楼信息，请稍后再试！')
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    },
    addBuildingEvent () {
      this.buildingAddInfo.buildingName = ''
      this.dialogVisible.addBuilding = true
      this.$refs['buildingAddForm'].resetFields()
    },
    buildingAddSubmit () {
      this.$refs['buildingAddForm'].validate((valid) => {
        if (valid) {
          this.axios.post('/api/building/saveBuildingInfo', this.buildingAddInfo, {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.$message({
                message: '添加实训楼成功！',
                type: 'success'
              })
              this.queryBuildingAllInfo(1)
            } else {
              this.$message.error('服务器出现异常，添加实训楼失败，请稍后再试！')
            }
          }.bind(this))
          this.$refs['buildingAddForm'].clearValidate()
          this.dialogVisible.addBuilding = false
        } else {
          this.$message({
            message: '请按照提示正确输入实训楼信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    updateBuildingEvent (rowInfo) {
      this.dialogVisible.updateBuilding = true
      this.buildingUpdateInfo = {
        buildingId: rowInfo.buildingId,
        buildingName: rowInfo.buildingName
      }
      // this.$refs['buildingUpdateForm'].clearValidate()
      this.$refs['buildingUpdateForm'].resetFields()
    },
    buildingUpdateSubmit () {
      this.$refs['buildingUpdateForm'].validate((valid) => {
        if (valid) {
          this.axios.post('/api/building/updateBuildingInfo', this.buildingUpdateInfo, {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.$message({
                message: '修改实训楼成功！',
                type: 'success'
              })
              this.queryBuildingAllInfo(1)
            } else {
              this.$message.error('服务器出现异常，修改实训楼失败，请稍后再试！')
            }
          }.bind(this))
          this.$refs['buildingUpdateForm'].clearValidate()
          this.dialogVisible.updateBuilding = false
        } else {
          this.$message({
            message: '请按照提示正确输入实训楼信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    deleteBuildingEvent (buildingId) {
      this.$confirm('此操作将永久删除该实训楼信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.get('/api/building/deleteBuildingInfo', {
          params: {
            buildingId: buildingId
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }
          this.queryBuildingAllInfo(1)
        }.bind(this)).catch(function (error) {
          console.log(error)
          this.$message.error('服务器出现问题，删除实训楼失败，请稍后重试')
        }.bind(this))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    buildingSearchEvent (val) {
      let searchContext = this.buildingSearchBar
      let reg = /^[0-9]*$/
      let path = ''
      let params = {}
      if (reg.test(searchContext)) {
        path = '/api/building/getBuildingInfoById'
        params = {
          page: val,
          buildingId: searchContext
        }
      } else {
        path = '/api/building/getBuildingInfoByName'
        params = {
          page: val,
          buildingName: searchContext
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
    handleCurrentChange (val) {
      if (this.buildingSearchBar === '') {
        this.queryBuildingAllInfo(val)
      } else {
        this.buildingSearchEvent(val)
      }
    },
    resetBuildingAddForm () {
      this.$refs['buildingAddForm'].resetFields()
      this.$refs['buildingAddForm'].clearValidate()
      this.buildingAddInfo.buildingName = ''
    },
    resetUpdateBuildingForm () {
      this.$refs['buildingUpdateForm'].resetFields()
      this.$refs['buildingUpdateForm'].clearValidate()
      this.buildingUpdateInfo.buildingName = ''
    }
  },
  mounted () {
    this.queryBuildingAllInfo(1)
  }
}
</script>

<style scoped>

</style>
