<template>
    <div class="clazz">
      <el-row type="flex" style="height: 50px;">
        <el-col :span="19"><span style="font-size: 40px">实训室管理</span></el-col>
        <el-col :span="4">
          <el-input type="text" placeholder="请输入实训室ID或者实训室名称" v-model="clazzSearchBar"/>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="clazzSearchEvent(1)">搜索</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end">
        <el-col :span="1" :pull="4">
          <el-button type="primary" @click="addClazzEvent">添加实训室</el-button>
        </el-col>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 20px">
        <el-table
          :data="Info"
          stripe
          style="width: 100%;">
          <el-table-column
            prop="classId"
            label="实训室ID">
          </el-table-column>
          <el-table-column
            prop="className"
            label="实训室名称">
          </el-table-column>
          <el-table-column
            prop="buildingName"
            label="所属实训楼">
          </el-table-column>
          <el-table-column
            prop="computerTotal"
            label="电脑总数">
          </el-table-column>
          <el-table-column
            prop="computerEnable"
            label="可用电脑数">
          </el-table-column>
          <el-table-column
            prop="computerDisable"
            label="损坏电脑数">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-edit" round @click="updateClazzEvent(scope.row)" size="mini">修改
              </el-button>
              <el-button type="danger" icon="el-icon-circle-close" round
                         @click="deleteClazzEvent(scope.row.classId)" size="mini">删除
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
        title="添加实训室"
        :visible.sync="dialogVisible.addClazz">
        <el-form ref="clazzAddForm" :model="ClazzAddInfo" label-width="120px" :rules="rules" style="width: 400px;">
          <el-form-item label="实训室名称:" prop="className">
            <el-input type="text" v-model="ClazzAddInfo.className" placeholder="请输入实训室名称"></el-input>
          </el-form-item>
          <el-form-item label="所属实训楼:" prop="buildingId">
            <el-select v-model="ClazzAddInfo.buildingId" placeholder="请选择所属实训楼">
              <el-option
                v-for="item in buildingInfo"
                :key="item.buildingId"
                :label="item.buildingName"
                :value="item.buildingId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电脑总数:" prop="computerTotal">
            <el-input-number v-model="ClazzAddInfo.computerTotal" label="请输入实训室电脑总数" @change="disableComputerChangeEvent"></el-input-number>
          </el-form-item>
          <el-form-item label="可用电脑总数:" prop="computerEnable">
            <el-input-number v-model="ClazzAddInfo.computerEnable" label="请输入实训室可用电脑数" :min="0" :max="ClazzAddInfo.computerTotal" @change="enableComputerChangeEvent"></el-input-number>
          </el-form-item>
          <el-form-item label="损坏电脑总数:" prop="computerDisable">
            <el-input-number v-model="ClazzAddInfo.computerDisable" label="请输入实训室损坏电脑数" :min="0" :max="ClazzAddInfo.computerTotal" @change="disableComputerChangeEvent"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="resetClazzAddForm">重置</el-button>
    <el-button type="primary" @click="clazzAddSubmit">确认添加</el-button>
  </span>
      </el-dialog>
      <el-dialog
        title="修改实训室"
        :visible.sync="dialogVisible.updateClazz">
        <el-form ref="clazzUpdateForm" :model="ClazzUpdateInfo" label-width="120px" :rules="rules" style="width: 400px;">
          <el-form-item label="实训室名称:" prop="className">
            <el-input type="text" v-model="ClazzUpdateInfo.className" placeholder="请输入实训室名称"></el-input>
          </el-form-item>
          <el-form-item label="所属实训楼:" prop="buildingId">
            <el-select v-model="ClazzUpdateInfo.buildingId" placeholder="请选择所属实训楼">
              <el-option
                v-for="item in buildingInfo"
                :key="item.buildingId"
                :label="item.buildingName"
                :value="item.buildingId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电脑总数:" prop="computerTotal">
            <el-input-number v-model="ClazzUpdateInfo.computerTotal" label="请输入实训室电脑总数" @change="disableComputerChangeEvent"></el-input-number>
          </el-form-item>
          <el-form-item label="可用电脑总数:" prop="computerEnable">
            <el-input-number v-model="ClazzUpdateInfo.computerEnable" label="请输入实训室可用电脑数" :min="0" :max="ClazzUpdateInfo.computerTotal" @change="enableComputerChangeEvent"></el-input-number>
          </el-form-item>
          <el-form-item label="损坏电脑总数:" prop="computerDisable">
            <el-input-number v-model="ClazzUpdateInfo.computerDisable" label="请输入实训室损坏电脑数" :min="0" :max="ClazzUpdateInfo.computerTotal" @change="disableComputerChangeEvent"></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
    <el-button @click="resetUpdateClazz">重置</el-button>
    <el-button type="primary" @click="clazzUpdateSubmit">确认修改</el-button>
  </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'Claszz',
  data () {
    return {
      Info: [],
      pageMap: [],
      clazzSearchBar: '',
      dialogVisible: {
        addClazz: false,
        updateClazz: false
      },
      ClazzAddInfo: {
        className: '',
        buildingId: '',
        computerTotal: '',
        computerEnable: '',
        computerDisable: ''
      },
      ClazzUpdateInfo: {
        classId: '',
        className: '',
        buildingId: '',
        computerTotal: '',
        computerEnable: '',
        computerDisable: ''
      },
      buildingInfo: [],
      rules: {
        className: [
          {required: true, message: '请输入实训室名称', trigger: 'blur'}
        ],
        buildingId: [
          {required: true, message: '请选择所属实训楼', trigger: 'blur'}
        ],
        computerTotal: [
          {required: true, message: '请输入实训室电脑总数', trigger: 'blur'}
        ],
        computerEnable: [
          {required: true, message: '请输入实训室可用电脑总数', trigger: 'blur'}
        ],
        computerDisable: [
          {required: true, message: '请输入实训室损坏电脑总数', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    queryClazzAllInfo (page) {
      this.axios.get('/api/class/getAllClassInfo', {
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
          this.$message.error('服务器出现错误，无法获取实训室信息，请稍后再试！')
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    },
    queryBuildingAllInfo () {
      this.axios.get('/api/building/getBuildingInfo', {
        params: {}
      }).then(function (res) {
        if (res.data.status === 200) {
          let info = res.data.data.Info
          if (info instanceof Array) {
            this.buildingInfo = info
          } else {
            let tempArray = []
            tempArray.push(info)
            this.buildingInfo = tempArray
          }
        } else {
          this.$message.error('服务器出现错误，无法获取实训楼所有信息，请稍后再试！')
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    },
    addClazzEvent () {
      this.ClazzAddInfo = {
        className: '',
        buildingId: '',
        computerTotal: '',
        computerEnable: '',
        computerDisable: ''
      }
      this.dialogVisible.addClazz = true
      this.queryBuildingAllInfo()
      this.$refs['clazzAddForm'].resetFields()
    },
    clazzAddSubmit () {
      this.$refs['clazzAddForm'].validate((valid) => {
        if (valid) {
          this.axios.post('/api/class/saveClassInfo', this.ClazzAddInfo, {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.$message({
                message: '添加实训室成功！',
                type: 'success'
              })
              this.queryClazzAllInfo(1)
            } else {
              this.$message.error('服务器出现异常，添加实训室失败，请稍后再试！')
            }
          }.bind(this))
          this.$refs['clazzAddForm'].clearValidate()
          this.dialogVisible.addClazz = false
        } else {
          this.$message({
            message: '请按照提示正确输入实训楼信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    enableComputerChangeEvent () {
      this.ClazzAddInfo.computerDisable = this.ClazzAddInfo.computerTotal - this.ClazzAddInfo.computerEnable
      this.ClazzUpdateInfo.computerDisable = this.ClazzUpdateInfo.computerTotal - this.ClazzUpdateInfo.computerEnable
    },
    disableComputerChangeEvent () {
      this.ClazzAddInfo.computerEnable = this.ClazzAddInfo.computerTotal - this.ClazzAddInfo.computerDisable
      this.ClazzUpdateInfo.computerEnable = this.ClazzUpdateInfo.computerTotal - this.ClazzUpdateInfo.computerDisable
    },
    updateClazzEvent (rowInfo) {
      console.log(rowInfo.buildingId)
      this.dialogVisible.updateClazz = true
      this.queryBuildingAllInfo()
      this.ClazzUpdateInfo = {
        classId: rowInfo.classId,
        className: rowInfo.className,
        buildingId: rowInfo.buildingId,
        computerTotal: rowInfo.computerTotal,
        computerEnable: rowInfo.computerEnable,
        computerDisable: rowInfo.computerDisable
      }
    },
    clazzUpdateSubmit () {
      this.$refs['clazzUpdateForm'].validate((valid) => {
        if (valid) {
          this.axios.post('/api/class/updateClassInfo', this.ClazzUpdateInfo, {
            headers: {
              'Accept': '*/*',
              'Content-Type': 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.$message({
                message: '修改实训室成功！',
                type: 'success'
              })
              this.queryClazzAllInfo(1)
            } else {
              this.$message.error('服务器出现异常，修改实训室失败，请稍后再试！')
            }
          }.bind(this))
          this.$refs['clazzUpdateForm'].clearValidate()
          this.dialogVisible.updateClazz = false
        } else {
          this.$message({
            message: '请按照提示正确输入实训楼信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    deleteClazzEvent (classId) {
      this.$confirm('此操作将永久删除该实训室信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.axios.get('/api/class/deleteClassInfo', {
          params: {
            classId: classId
          }
        }).then(function (res) {
          if (res.data.status === 200) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.queryClazzAllInfo(1)
          } else {
            this.$message.error(res.data.msg)
          }
        }.bind(this)).catch(function (error) {
          console.log(error)
          this.$message.error('服务器出现问题，删除实训室失败，请稍后重试')
        }.bind(this))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    clazzSearchEvent (val) {
      let searchContext = this.clazzSearchBar
      let reg = /^[0-9]*$/
      let path = ''
      let params = {}
      if (reg.test(searchContext)) {
        path = '/api/class/getClassInfoById'
        params = {
          page: val,
          classId: searchContext
        }
      } else {
        path = '/api/class/getClassInfoByName'
        params = {
          page: val,
          className: searchContext
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
      if (this.clazzSearchBar === '') {
        this.queryClazzAllInfo(val)
      } else {
        this.clazzSearchEvent(val)
      }
    },
    resetClazzAddForm () {
      this.$refs['clazzAddForm'].resetFields()
      this.$refs['clazzAddForm'].clearValidate()
    },
    resetUpdateClazz () {
      this.$refs['clazzUpdateForm'].resetFields()
      this.$refs['clazzUpdateForm'].clearValidate()
      this.ClazzUpdateInfo.className = ''
      this.ClazzUpdateInfo.buildingId = ''
      this.ClazzUpdateInfo.computerTotal = ''
      this.ClazzUpdateInfo.computerEnable = ''
      this.ClazzUpdateInfo.computerDisable = ''
    }
  },
  mounted () {
    this.queryClazzAllInfo(1)
  }
}
</script>

<style scoped>

</style>
