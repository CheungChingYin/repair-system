<template>
  <div class="QRCode">
    <el-row type="flex" style="height: 50px;">
      <el-col :span="19">
        <span style="font-size: 40px">报修二维码生成</span>
      </el-col>
    </el-row>
    <el-row type="flex" justify="center">
      <el-col :span="10">
        <el-form ref="QRCodeForm" :model="QRCodeInfo" label-width="100px" :rules="rules" style="width: 400px;">
          <el-form-item label="实训楼名称:" prop="buildingName">
            <el-select v-model="QRCodeInfo.buildingId" placeholder="请选择实训楼" @change="buildingChangeEvent">
              <el-option
                v-for="item in buildingInfo"
                :key="item.buildingId"
                :label="item.buildingName"
                :value="item.buildingId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="实训室名称:" prop="classId">
            <el-select v-model="QRCodeInfo.classId" placeholder="请选择实训室" @change="classChangeEvent">
              <el-option
                v-for="item in classInfo"
                :key="item.classId"
                :label="item.className"
                :value="item.classId">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电脑开始编号:" prop="computerStartNum">
            <el-input-number v-model="QRCodeInfo.computerStartNum" @change="handleChange" :min="1" :max="classTotalComputer" label="电脑开始编号"></el-input-number>
          </el-form-item>
          <el-form-item label="电脑结束编号:" prop="computerEndNum">
            <el-input-number v-model="QRCodeInfo.computerEndNum" @change="handleChange" :min="QRCodeInfo.computerStartNum" :max="classTotalComputer" label="电脑结束编号"></el-input-number>
          </el-form-item>
          <span>*注意：如果"电脑开始编号"和"电脑结束编号"一致，则视为打印一台电脑的二维码</span>
          <el-form-item>
            <el-button style="margin-right: 50px" @click="resetQRCodeInfo">重置</el-button>
            <el-button type="primary" @click="QRCodeSubmit">开始生成</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'QRCode',
  data () {
    return {
      QRCodeInfo: {
        domain: '',
        buildingId: '',
        buildingName: '',
        classId: '',
        className: '',
        computerStartNum: '',
        computerEndNum: '',
        rules: {
          buildingName: [
            {required: true, message: '请选择实训楼名称', trigger: 'blur'}
          ],
          classId: [
            {required: true, message: '请输入实训室名称', trigger: 'blur'}
          ],
          computerStartNum: [
            {required: true, message: '请输入开始电脑编号', trigger: 'blur'}
          ],
          computerEndNum: [
            {required: true, message: '请输入结束电脑编号', trigger: 'blur'}
          ]
        }
      },
      buildingInfo: [],
      classInfo: [],
      classTotalComputer: ''
    }
  },
  methods: {
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
    queryClassAllInfoByBuildingId (buildingId) {
      this.axios.get('/api/class/getClassInfoByBuildingId', {
        params: {
          buildingId: buildingId
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          let info = res.data.data.Info
          if (info instanceof Array) {
            this.classInfo = info
          } else {
            let tempArray = []
            tempArray.push(info)
            this.classInfo = tempArray
          }
        } else {
          this.$message.error('服务器出现错误，无法获取实训室所有信息，请稍后再试！')
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    },
    queryClassInfoByClassId () {
      let classId = this.QRCodeInfo.classId
      this.axios.get('/api/class/getClassInfoById', {
        params: {
          page: 1,
          classId: classId
        }
      }).then(function (res) {
        if (res.data.status === 200) {
          let resultTotal = res.data.data.Info.computerTotal
          this.classTotalComputer = resultTotal
          this.QRCodeInfo.computerEndNum = resultTotal
        } else {
          this.$message.error('服务器出现错误，无法获取实训室电脑数量信息，请稍后再试！')
        }
      }.bind(this)).catch(function (error) {
        console.log(error)
        this.$message.error('服务器出现错误，请稍后再试！')
      }.bind(this))
    },
    buildingChangeEvent () {
      let buildingId = this.QRCodeInfo.buildingId
      this.QRCodeInfo.classId = ''
      let obj = {}
      obj = this.buildingInfo.find((item) => {
        return item.buildingId === buildingId
      })
      // console.log(obj.buildingName)
      this.QRCodeInfo.buildingName = obj.buildingName
      this.queryClassAllInfoByBuildingId(buildingId)
    },
    classChangeEvent () {
      let classId = this.QRCodeInfo.classId
      let obj = {}
      obj = this.classInfo.find((item) => {
        return item.classId === classId
      })
      console.log(obj.className)
      // this.queryClassInfoByClassId()
      this.classTotalComputer = obj.computerTotal
      this.QRCodeInfo.className = obj.className
      this.QRCodeInfo.computerEndNum = obj.computerTotal
    },
    QRCodeSubmit () {
      this.$refs['QRCodeForm'].validate((valid) => {
        if (valid) {
          this.QRCodeInfo.domain = this.$store.state.repairFormPath
          console.log(this.QRCodeInfo.domain)
          let url = this.$store.state.ServerDomain + '/QRCode/QRCodeDownLoad?domain=' + this.QRCodeInfo.domain + '&buildingId=' + this.QRCodeInfo.buildingId + '&buildingName=' + this.QRCodeInfo.buildingName + '&classId=' + this.QRCodeInfo.classId + '&className=' + this.QRCodeInfo.className + '&computerStartNum=' + this.QRCodeInfo.computerStartNum + '&computerEndNum=' + this.QRCodeInfo.computerEndNum
          this.download(url)
        } else {
          this.$message({
            message: '请按照提示正确输入信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    download (url) {
      if (!url) {
        return
      }
      let link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      document.body.appendChild(link)
      link.click()
    },
    resetQRCodeInfo () {
      this.$refs['QRCodeForm'].resetFields()
      this.$refs['QRCodeForm'].clearValidate()
    }
  },
  mounted () {
    this.queryBuildingAllInfo()
  }
}
</script>

<style scoped>

</style>
