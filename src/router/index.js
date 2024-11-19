import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '../layouts/MainLayout.vue';
import LoginLayout from '../layouts/LoginLayout.vue';
import CustomerManagement from '../components/CustomerManagement.vue';
import CloudServer from '../components/CloudServer.vue';
import DomainManagement from '../components/DomainManagement.vue';
import ServerDetail from '../components/ServerDetail.vue';
import Login from '../components/Login.vue';

const routes = [
  { path: '/', redirect: '/login' }, // 根路径重定向到登录页面
  {
    path: '/login', // 登录页面路径
    component: LoginLayout, // 使用登录布局组件
    children: [
      { path: '', component: Login } // 登录页面的子路由
    ]
  },
  {
    path: '/', // 主页面路径
    component: MainLayout, // 使用主布局组件
    children: [
      { path: 'customers', component: CustomerManagement }, // 客户管理页面
      { path: 'cloud-servers', component: CloudServer }, // 云服务器页面
      { path: 'domains', component: DomainManagement }, // 域名管理页面
      { path: 'server-detail/:id', component: ServerDetail } // 服务器详情页面，带有动态参数
    ]
  }
];

const router = createRouter({
  // 使用history模式
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  // 假设你有一个方法来检查用户是否已登录
  const isAuthenticated = checkUserAuthentication(); // 替换为实际的认证检查逻辑

  if (to.path !== '/login' && !isAuthenticated) {
    next('/login'); // 如果未登录，重定向到登录页面
  } else {
    next(); // 否则允许访问
  }
});

// 这是一个示例函数，你需要根据实际情况实现
function checkUserAuthentication() {
  // 例如，从本地存储中获取 token 或从 Vuex 中获取状态
  const token = localStorage.getItem('authToken');
  return !!token; // 如果 token 存在，返回 true，否则返回 false
}

export default router; 