<template>
    <div class="SubmitRepair">
      <el-row type="flex">
        <el-form ref="submitRepairForm" label-width="120px" style="margin-top: 30px"
                 :rules="rules" :model="submitRepairInfo">
          <el-form-item label="电脑编号:" prop="computerNum">
            <el-input v-model="submitRepairInfo.computerNum" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属实训室:" prop="className">
            <el-input v-model="submitRepairInfo.className" disabled></el-input>
          </el-form-item>
          <el-form-item label="所属实训楼:" prop="buildingName">
            <el-input v-model="submitRepairInfo.buildingName" disabled></el-input>
          </el-form-item>
          <el-form-item label="问题描述:" prop="problem">
            <el-input type="textarea" :row="4" v-model="submitRepairInfo.problem"></el-input>
          </el-form-item>
          <el-form-item label="图片上传:" prop="file">
            <el-upload
              class="upload-demo"
              ref="upload"
              action="/doUpload"
              :auto-upload="false"
              accept="image/jpeg,image/jpg,image/png"
              :file-list="imagelist"
              :multiple="false"
              :on-change="handleChange">
              <el-button slot="trigger" size="small" type="primary" >上传图片</el-button>
            </el-upload>
          </el-form-item>
          <el-form-item>
          </el-form-item>
          <el-form-item label="报修人姓名:" prop="userName">
            <el-input v-model="submitRepairInfo.userName"></el-input>
          </el-form-item>
          <el-form-item label="报修人手机号:" prop="userPhone">
            <el-input v-model="submitRepairInfo.userPhone"></el-input>
          </el-form-item>
          <el-form-item label="报修人邮箱:" prop="userEmail">
            <el-input v-model="submitRepairInfo.userEmail"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button>重置</el-button>
            <el-button type="primary" @click="submitRepair">提交维修工单</el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
</template>

<script>
export default {
  name: 'SubmitRepair',
  data () {
    return {
      submitRepairInfo: {
        buildingId: '',
        buildingName: '',
        classId: '',
        className: '',
        computerNum: '',
        problem: '',
        userName: '',
        userPhone: '',
        userEmail: '',
        file: undefined
      },
      imagelist: [],
      rules: {
        problem: [
          {required: true, message: '请填写报修问题', trigger: 'blur'}
        ],
        userName: [
          {required: true, message: '请输入报修人姓名', trigger: 'blur'}
        ],
        userPhone: [
          {required: true, message: '请输入报修人电话号码', trigger: 'blur'},
          {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        userEmail: [
          {required: true, message: '请输入报修人邮箱地址', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    handleChange (file, fileList) {
      this.submitRepairInfo.file = file
      console.log(file)
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
    },
    getLinkParams () {
      let params = this.$route.query
      this.submitRepairInfo.computerNum = params.computerNum
      this.submitRepairInfo.classId = params.classId
      this.submitRepairInfo.className = params.className
      this.submitRepairInfo.buildingId = params.buildingId
      this.submitRepairInfo.buildingName = params.buildingName
    },
    submitRepair () {
      this.$refs['submitRepairForm'].validate((valid) => {
        if (valid) {
          let formData = {}
          if (this.submitRepairInfo.file !== undefined) {
            formData = {
              file: this.submitRepairInfo.file,
              problem: this.submitRepairInfo.problem,
              computerNumber: this.submitRepairInfo.computerNum,
              classId: this.submitRepairInfo.classId,
              buildingId: this.submitRepairInfo.buildingId,
              userName: this.submitRepairInfo.userName,
              userPhone: this.submitRepairInfo.userPhone,
              userEmail: this.submitRepairInfo.userEmail
            }
          } else {
            formData = {
              problem: this.submitRepairInfo.problem,
              computerNumber: this.submitRepairInfo.computerNum,
              classId: this.submitRepairInfo.classId,
              buildingId: this.submitRepairInfo.buildingId,
              userName: this.submitRepairInfo.userName,
              userPhone: this.submitRepairInfo.userPhone,
              userEmail: this.submitRepairInfo.userEmail
            }
          }
          this.axios.post('/api/orders/saveOrders', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Accept: 'application/json'
            }
          })
        } else {
          this.$message({
            message: '请按照提示正确输入信息',
            type: 'warning'
          })
          return false
        }
      })
    }
  },
  mounted () {
    this.getLinkParams()
  }
}
</script>

<style scoped>

</style>
