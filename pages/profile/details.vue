<template>
  <view class="container">
    <!-- 顶部背景与导航 -->
    <view class="header-section">
      <!-- 高保真地图背景 - 从云端加载 -->
      <view class="map-bg">
        <image class="map-img" :src="assets.profile.backMap" mode="aspectFill"></image>
      </view>
      
      <!-- 自定义导航栏 -->
      <view class="nav-bar">
        <view class="back-btn" @click="goBack">
          <text class="back-icon">←</text>
        </view>
        <text class="nav-title">个人资料</text>
        <view class="placeholder"></view>
      </view>
      
      <!-- 用户概览 -->
      <view class="user-summary animate-fade-in">
        <view class="avatar-box">
          <image class="avatar" :src="assets.images.avatarPlaceholder" mode="aspectFill"></image>
        </view>
        <text class="nickname">Hello, 游客</text>
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="main-content">
      <!-- 提示信息 -->
      <view class="notice-bar">
        <text class="notice-icon">i</text>
        <text class="notice-text">游客即可访问，登录注册暂不启用</text>
      </view>

      <!-- 快捷导航 -->
      <view class="link-group">
        <view class="link-item" @click="goTo('/pages/profile/settings')">
          <text class="link-label">登录设置</text>
          <text class="link-arrow">→</text>
        </view>
        <view class="link-item">
          <text class="link-label">实名认证</text>
          <text class="link-arrow">→</text>
        </view>
      </view>

      <!-- 详细信息卡片 -->
      <view class="info-card">
        <view class="info-row">
          <text class="label">头像</text>
          <view class="value-area">
            <image class="avatar-mini" :src="assets.images.avatarPlaceholder" mode="aspectFill"></image>
            <text class="arrow">〉</text>
          </view>
        </view>
        <view class="info-row">
          <text class="label">名字</text>
          <view class="value-area">
            <text class="value-text">Happy</text>
            <text class="arrow">〉</text>
          </view>
        </view>
        <view class="info-row">
          <text class="label">地址</text>
          <view class="value-area">
            <text class="value-text">广东省深圳市深圳大学</text>
            <text class="arrow">〉</text>
          </view>
        </view>
      </view>

      <!-- 退出登录按钮 -->
      <view class="logout-section">
        <view class="logout-btn" @click="handleLogout">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script>
import { ASSETS_CONFIG } from '@/utils/assets-config.js'

export default {
  data() {
    return {
      assets: ASSETS_CONFIG
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goTo(url) {
      uni.navigateTo({ url });
    },
    handleLogout() {
      uni.showModal({
        title: '提示',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.reLaunch({ url: '/pages/login/login' });
          }
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFCB32; // 对应设计稿背景色
  padding-bottom: 80rpx;
}

.header-section {
  position: relative;
  height: 520rpx;
  overflow: hidden;
  
  .map-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 520rpx;
    z-index: 1;
    .map-img { 
      width: 100%; 
      height: 100%; 
      opacity: 0.6; 
    }
  }
  
  .nav-bar {
    position: relative;
    z-index: 10;
    padding: 80rpx 40rpx 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .back-btn {
      width: 80rpx;
      height: 80rpx;
      display: flex;
      align-items: center;
      .back-icon { font-size: 44rpx; color: #333; font-weight: bold; }
    }
    
    .nav-title {
      font-size: 34rpx;
      font-weight: bold;
      color: #333;
    }
    
    .placeholder { width: 80rpx; }
  }
  
  .user-summary {
    position: relative;
    z-index: 10;
    margin-top: 20rpx;
    padding: 0 60rpx;
    display: flex;
    align-items: center;
    
    .avatar-box {
      width: 160rpx;
      height: 160rpx;
      background: #fff;
      border-radius: 50%;
      padding: 6rpx;
      box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
      
      .avatar { width: 100%; height: 100%; border-radius: 50%; }
    }
    
    .nickname {
      margin-left: 35rpx;
      font-size: 50rpx;
      font-weight: bold;
      color: #000;
    }
  }
}

.main-content {
  padding: 0 45rpx;
  margin-top: 10rpx;
}

.notice-bar {
  background: rgba(0, 0, 0, 0.6);
  border-radius: 40rpx;
  padding: 15rpx 30rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 30rpx;
  
  .notice-icon {
    width: 32rpx;
    height: 32rpx;
    background: #00CCFF;
    color: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22rpx;
    font-weight: bold;
    margin-right: 15rpx;
  }
  
  .notice-text {
    color: #fff;
    font-size: 26rpx;
    font-weight: bold;
  }
}

.link-group {
  margin-bottom: 50rpx;
  border-top: 1rpx solid #DCD8C8;
  
  .link-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 38rpx 0;
    border-bottom: 1rpx solid #DCD8C8;
    
    .link-label {
      font-size: 34rpx;
      font-weight: 500;
      color: #000;
    }
    
    .link-arrow {
      font-size: 32rpx;
      color: #666;
    }
    
    &:active { opacity: 0.7; }
  }
}

.info-card {
  background: #fff;
  border-radius: 45rpx;
  padding: 10rpx 40rpx;
  box-shadow: 0 8rpx 30rpx rgba(0,0,0,0.03);
  margin-bottom: 80rpx;
  
  .info-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 35rpx 0;
    border-bottom: 1rpx solid #F2F2F2;
    
    &:last-child { border-bottom: none; }
    
    .label {
      font-size: 32rpx;
      color: #333;
    }
    
    .value-area {
      display: flex;
      align-items: center;
      
      .avatar-mini {
        width: 88rpx;
        height: 88rpx;
        border-radius: 20rpx;
        margin-right: 20rpx;
      }
      
      .value-text {
        font-size: 30rpx;
        color: #333;
        margin-right: 12rpx;
        
        &.bold { font-weight: bold; }
      }
      
      .arrow {
        font-size: 26rpx;
        color: #CCC;
      }
    }
  }
}

.logout-section {
  padding: 0 10rpx;
  
  .logout-btn {
    background: #00A99D;
    color: #fff;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    font-weight: bold;
    box-shadow: 0 10rpx 30rpx rgba(0, 169, 157, 0.2);
    
    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
