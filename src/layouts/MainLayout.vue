<template>
  <el-container style="height: 100vh;">
    <el-header>
      <div class="header-content">
        <h1 class="title">云管平台</h1>
        <div class="user-info">
            用户: {{ username }}
            <el-button type="primary" @click="logout">退出</el-button>
        </div>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <AppSidebar />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppSidebar from '../components/Sidebar.vue';

export default {
  components: {
    AppSidebar
  },
  data() {
    return {
      username: '张三' // 假设这是登录用户的名称
    };
  },
  methods: {
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push('/login');
    }
  }
};
</script>

<style>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  background-color: #f0f2f5;
}

.title {
  margin: 0;
}

.user-info {
  font-weight: bold;
}
</style> 