<template>
  <view class="container">
    <!-- 顶部：地图背景 + 头像区域 -->
    <view class="header-section">
      <!-- 底层：地图背景图 -->
      <view class="map-bg-layer">
        <image class="map-img" src="/static/images/login_bg.png" mode="aspectFill"></image>
        <view class="overlay"></view>
      </view>
      
      <!-- 中层：波浪装饰（上层图概念） -->
      <view class="wave-layer">
        <image class="wave-img" src="/static/images/wave.png" mode="aspectFill"></image>
      </view>
      
      <!-- 顶层：用户信息 -->
      <view class="user-content">
        <view class="avatar-box animate-scale-in">
          <image class="avatar" src="/static/images/avatar_placeholder.png" mode="aspectFill"></image>
        </view>
        <text class="nickname">Hello, DWQ</text>
      </view>
    </view>

    <!-- 下半部分内容 -->
    <view class="main-content">
      <!-- 登录设置 & 实名认证 -->
      <view class="quick-nav-card">
        <view class="nav-row" @click="goTo('/pages/profile/settings')">
          <text class="nav-label">登录设置</text>
          <text class="nav-arrow">→</text>
        </view>
        <view class="nav-divider"></view>
        <view class="nav-row">
          <text class="nav-label">实名认证</text>
          <text class="nav-arrow">→</text>
        </view>
      </view>

      <!-- 个人信息卡片 -->
      <view class="info-grid-card">
        <view class="info-item" @click="goTo('/pages/profile/details')">
          <text class="label">头像</text>
          <view class="val">
            <image class="sm-avatar" src="/static/images/avatar_placeholder.png" mode="aspectFill"></image>
            <text class="arrow">></text>
          </view>
        </view>
        <view class="info-item">
          <text class="label">名字</text>
          <view class="val">
            <text class="txt">DWQ</text>
            <text class="arrow">></text>
          </view>
        </view>
        <view class="info-item">
          <text class="label">电话</text>
          <view class="val">
            <text class="txt">19106572834</text>
            <text class="arrow">></text>
          </view>
        </view>
        <view class="info-item">
          <text class="label">地址</text>
          <view class="val">
            <text class="txt">广东省深圳市深圳大学</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>

      <!-- 退出按钮 -->
      <view class="btn-area">
        <view class="logout-btn" @click="handleLogout">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goTo(url) {
      uni.navigateTo({ url });
    },
    handleLogout() {
      uni.reLaunch({ url: '/pages/login/login' });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFF9E6;
}

.header-section {
  position: relative;
  height: 560rpx;
  overflow: hidden;
  
  .map-bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    .map-img { width: 100%; height: 100%; }
    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(180deg, rgba(255,249,230,0.1) 0%, rgba(255,249,230,0.4) 100%);
    }
  }
  
  .wave-layer {
    position: absolute;
    bottom: -2rpx;
    left: 0;
    width: 100%;
    height: 400rpx;
    z-index: 2;
    .wave-img { width: 100%; height: 100%; }
  }
  
  .user-content {
    position: relative;
    z-index: 10;
    padding-top: 160rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .avatar-box {
      width: 180rpx;
      height: 180rpx;
      background: #fff;
      border-radius: 50%;
      padding: 10rpx;
      box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.1);
      .avatar { width: 100%; height: 100%; border-radius: 50%; }
    }
    
    .nickname {
      margin-top: 24rpx;
      font-size: 48rpx;
      font-weight: 800;
      color: #333;
    }
  }
}

.main-content {
  padding: 0 40rpx 60rpx;
  margin-top: -60rpx;
  position: relative;
  z-index: 20;
}

.quick-nav-card {
  background: #FFE4B5; // 稍微深一点的黄色卡片
  border-radius: 40rpx;
  padding: 0 40rpx;
  margin-bottom: 40rpx;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.05);
  
  .nav-row {
    height: 110rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nav-label { font-size: 32rpx; font-weight: 600; color: #333; }
    .nav-arrow { font-size: 36rpx; color: #666; }
  }
  .nav-divider { height: 2rpx; background: rgba(0,0,0,0.05); }
}

.info-grid-card {
  background: #FFF9E6;
  border-radius: 40rpx;
  padding: 20rpx 40rpx;
  box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.03);
  margin-bottom: 60rpx;
  border: 4rpx solid #fff;
  
  .info-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 34rpx 0;
    border-bottom: 2rpx solid rgba(0,0,0,0.03);
    &:last-child { border-bottom: none; }
    
    .label { font-size: 30rpx; color: #666; }
    .val {
      display: flex;
      align-items: center;
      gap: 16rpx;
      .txt { font-size: 30rpx; color: #333; font-weight: 500; }
      .sm-avatar { width: 70rpx; height: 70rpx; border-radius: 16rpx; }
      .arrow { font-size: 24rpx; color: #ccc; }
    }
  }
}

.btn-area {
  .logout-btn {
    background: #00A99D;
    color: #fff;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: 800;
    box-shadow: 0 10rpx 30rpx rgba(0, 169, 157, 0.2);
    
    &:active { opacity: 0.9; transform: scale(0.98); }
  }
}

.animate-scale-in {
  animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.5); }
  to { opacity: 1; transform: scale(1); }
}
</style>
