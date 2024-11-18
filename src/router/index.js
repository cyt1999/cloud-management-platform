import { createRouter, createWebHistory } from 'vue-router';
import CustomerManagement from '../components/CustomerManagement.vue';
import CloudServer from '../components/CloudServer.vue';
import DomainManagement from '../components/DomainManagement.vue';
import ServerDetail from '../components/ServerDetail.vue';

const routes = [
  { path: '/customers', component: CustomerManagement },
  { path: '/cloud-servers', component: CloudServer },
  { path: '/domains', component: DomainManagement },
  { path: '/server-detail/:id', component: ServerDetail } // 使用路由参数
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router; 