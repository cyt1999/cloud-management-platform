<template>
  <el-menu @select="handleSelect" class="sidebar">
    <el-menu-item index="/customers">客户管理</el-menu-item>
    <el-menu-item index="/cloud-servers">云服务器</el-menu-item>
    <el-menu-item index="/domains">域名管理</el-menu-item>
    <el-menu-item index="/alert-rules">告警规则</el-menu-item>
  </el-menu>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'AppSidebar',
  setup() {
    const router = useRouter()
    
    const handleSelect = (index) => {
      router.push(index)
    }

    return {
      handleSelect
    }
  }
};
</script>

<style>
.sidebar {
  height: 100%; /* 使侧边栏高度为100% */
}
</style> 