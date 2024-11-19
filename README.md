# 云管理平台 (Cloud Management Platform)

## 技术栈
- **Node.js**: 18.20.2
- **Vue.js**: 3.2.13
- **Element Plus**: 用于UI组件
- **Vue Router**: 用于路由管理
- **Axios**: 用于HTTP请求
- **ECharts**: 用于数据可视化

## 项目功能
- **用户认证**: 用户可以通过登录界面进行身份验证。
- **客户管理**: 提供客户信息的增删改查功能。
- **云服务器管理**: 显示云服务器的详细信息，并提供监控数据的可视化。
- **域名管理**: 管理域名信息及其状态。

## 项目目录结构
cloud-management-platform/  
```
├── public/
│ └── index.html
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── CloudServer.vue
│ │ ├── CustomerManagement.vue
│ │ ├── DomainManagement.vue
│ │ ├── Login.vue
│ │ ├── ServerDetail.vue
│ │ └── Sidebar.vue
│ ├── layouts/
│ │ ├── MainLayout.vue
│ │ └── LoginLayout.vue
│ ├── router/
│ │ └── index.js
│ ├── App.vue
│ └── main.js
├── .gitignore
├── babel.config.js
├── jsconfig.json
├── package.json
├── README.md
└── vue.config.js
```