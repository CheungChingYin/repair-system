<template>
  <div id="app">
    <el-row type="flex" justify="center">
      <div id="login-form">
        <h2 class="login-form-title">机房报修管理系统</h2>
        <el-form ref="loginForm" label-width="150px" class="login-form-container"
                 :rules="rules" :model="loginInfo">
          <el-form-item label="管理员手机号:" prop="adminPhoneNum" class="">
            <el-input v-model="loginInfo.adminPhoneNum" placeholder="请输入管理员手机号"></el-input>
          </el-form-item>
          <el-form-item label="管理员密码:" prop="adminPassword">
            <el-input v-model="loginInfo.adminPassword" type="password" placeholder="请输入管理员密码"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('loginForm')">登陆</el-button>
            <el-button @click="resetForm('loginForm')">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'App',
  data () {
    return {
      loginInfo: {
        adminPhoneNum: '',
        adminPassword: ''
      },
      rules: {
        adminPhoneNum: [
          {required: true, message: '请输入管理员手机号'},
          {min: 11, max: 11, message: '请输入正确的手机号', trigger: 'blur'}
        ],
        adminPassword: {required: true, message: '请输入管理员密码'}
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          // alert(this.loginInfo.adminPhoneNum)
          // alert(this.loginInfo.adminPassword)
          var qs = require('qs')
          this.axios.post('/api/admin/login', qs.stringify({
            adminPhoneNum: this.loginInfo.adminPhoneNum,
            adminPassword: this.loginInfo.adminPassword
          }), {
            headers: {
              'Accept': '*/*'
            }
          }).then(function (res) {
            if (res.data.status === 200) {
              alert('登录成功！')
            }
          }).catch(function (error) {
            console.log('EXCEPTION' + error)
            alert(error)
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style>
  body {
    background-image: url(assets/login_bg.jpg);
  }

  #login-form {
    background: hsla(0, 0%, 100%, .3);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.7);
    z-index: 100;
    width: 600px;
    height: 400px;
    margin-top: 15%;
    border-radius: 20px;
  }

  .login-form-container {
    margin-top: 40px;
    margin-left: 40px;
    width: 400px;
    height: 400px;
  }

  .login-form-title {
    text-align: center;
    color: #606266;
    margin-top: 50px;
  }

  .el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before {
    content: '';
  }
</style>
