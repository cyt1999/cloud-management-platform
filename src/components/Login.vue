<template>
  <div class="login-container">
    <h2 class="login-title">欢迎登录</h2>
    <p class="login-description">请输入您的用户名和密码以继续</p>
    <el-form :model="loginForm" @submit.native.prevent="handleLogin">
      <el-form-item label="用户名">
        <el-input v-model="loginForm.username" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="密码">
        <el-input v-model="loginForm.password" type="password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios';
import { ElMessage } from 'element-plus';

export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await axios.post('/api/login/', this.loginForm);
        if (response.data.refresh && response.data.access) {
          // 将 token 存储到本地存储
          localStorage.setItem('authToken', response.data.access);
          this.$router.push('/cloud-servers'); // 登录成功后重定向
          ElMessage.success('登录成功');
        } else {
          ElMessage.error('登录失败，请检查用户名和密码');
        }
      } catch (error) {
        ElMessage.error('登录请求失败');
      }
    }
  }
};
</script>

<style>
.login-container {
  width: 300px;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.login-title {
  text-align: center;
  margin-bottom: 10px;
}

.login-description {
  text-align: center;
  margin-bottom: 20px;
}
</style> 