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
              ref='upload'
              class="avatar-uploader"
              :action="$store.state.uploadImagePath"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :headers="headers"
              :on-change="handleChange"
              :file-list="imagelist">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
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
            <el-button @click="resetForm">重置</el-button>
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
        imagePath: ''
      },
      imagelist: [],
      imageUrl: '',
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
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
          let formData = {
            file: this.submitRepairInfo.file,
            problem: this.submitRepairInfo.problem,
            computerNumber: this.submitRepairInfo.computerNum,
            classId: this.submitRepairInfo.classId,
            buildingId: this.submitRepairInfo.buildingId,
            userName: this.submitRepairInfo.userName,
            userPhone: this.submitRepairInfo.userPhone,
            userEmail: this.submitRepairInfo.userEmail,
            imagePath: this.submitRepairInfo.imagePath
          }
          var qs = require('qs')
          this.axios.post('/api/orders/saveOrders', qs.stringify(formData), {
            headers: {
              Accept: 'application/json'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              this.resetForm()
              this.$message({
                message: '提交工单成功！',
                type: 'success'
              })
            } else {
              this.$message.error('服务器出现异常，添加工单失败，请稍后再试！')
            }
          }.bind(this))
        } else {
          this.$message({
            message: '请按照提示正确输入信息',
            type: 'warning'
          })
          return false
        }
      })
    },
    handleAvatarSuccess (res, file) {
      this.imageUrl = this.$store.state.ServerDomain + res.data
      this.submitRepairInfo.imagePath = res.data
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt10M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 格式!')
      }
      if (!isLt10M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isJPG && isLt10M
    },
    resetForm () {
      this.$refs.upload.clearFiles()
      this.submitRepairInfo.userName = ''
      this.submitRepairInfo.userPhone = ''
      this.submitRepairInfo.userEmail = ''
      this.submitRepairInfo.imagePath = ''
      this.submitRepairInfo.problem = ''
      this.imageUrl = ''
      this.$refs['submitRepairForm'].clearValidate()
    }
  },
  mounted () {
    this.getLinkParams()
  }
}
</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
