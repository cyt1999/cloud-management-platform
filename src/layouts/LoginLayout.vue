<template>
  <div class="login-layout">
    <div class="left-section">
      <!-- 背景图 -->
    </div>
    <div class="right-section">
      <router-view />
    </div>
  </div>
</template>

<style>

/* 解决了登陆页面右侧出现滚动条的问题 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box; /* 确保边框和填充不会影响元素的总高度 */
}

.login-layout {
  display: flex;
  height: 100vh;
}

.left-section {
  flex: 3; /* 占5分之3 */
  background: url('../assets/loginBackground.jpg') no-repeat center center;
  background-size: cover;
}

.right-section {
  flex: 2; /* 占5分之2 */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
}
</style> 