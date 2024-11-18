<template>
  <el-container style="height: 100vh;">
    <el-header>
      <div class="header-content">
        <h1 class="title">云管平台</h1>
        <div class="user-info">用户: {{ username }}</div>
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
import AppSidebar from './components/Sidebar.vue';

export default {
  components: {
    AppSidebar
  },
  data() {
    return {
      username: '张三' // 假设这是登录用户的名称
    };
  }
};
</script>

<style>
.header-content {
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  align-items: center; /* 垂直居中 */
  padding: 0 20px; /* 添加内边距 */
  background-color: #f0f2f5; /* 设置背景颜色 */
}

.title {
  margin: 0; /* 去掉默认的 margin */
}

.user-info {
  font-weight: bold; /* 加粗用户信息 */
}
</style>
