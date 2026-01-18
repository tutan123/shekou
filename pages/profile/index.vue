<template>
  <view class="container">
    <!-- 顶部：地图背景 + 头像区域 -->
    <view class="header-section">
      <!-- 底层：高保真地图背景图 -->
      <view class="map-bg-layer">
        <!-- 使用 mode="widthFix" 让图片宽度撑满并保持比例，由资产配置从云端加载 -->
        <image class="map-img" :src="assets.profile.backMap" mode="widthFix"></image>
      </view>
      
      <!-- 用户信息 -->
      <view class="user-info">
        <view class="avatar-wrapper animate-pop-in">
          <image class="avatar" :src="assets.images.avatarPlaceholder" mode="aspectFill"></image>
        </view>
        <text class="nickname">Hello, 游客</text>
      </view>
    </view>

    <!-- 主体内容 -->
    <view class="main-content">
      <!-- 搜索框 -->
      <view class="search-box">
        <view class="search-inner">
          <icon type="search" size="18" color="#999" class="search-icon" />
          <input class="search-input" placeholder="查找地点" placeholder-class="search-placeholder" />
        </view>
      </view>

      <!-- 功能按钮区域 -->
      <view class="action-grid">
        <view class="action-item" @click="goTo('/pages/profile/favorites')">
          <view class="action-icon-box">
            <image class="box-bg" :src="assets.profile.roundRect" mode="scaleToFill"></image>
            <image class="action-icon" :src="assets.profile.favIcon" mode="aspectFit"></image>
          </view>
          <text class="action-label">个人收藏</text>
        </view>
        <view class="action-item" @click="goTo('/pages/profile/details')">
          <view class="action-icon-box">
            <image class="box-bg" :src="assets.profile.roundRect" mode="scaleToFill"></image>
            <image class="action-icon" :src="assets.profile.profileIcon" mode="aspectFit"></image>
          </view>
          <text class="action-label">个人资料</text>
        </view>
        <view class="action-item" @click="goTo('/pages/profile/settings')">
          <view class="action-icon-box">
            <image class="box-bg" :src="assets.profile.roundRect" mode="scaleToFill"></image>
            <image class="action-icon" :src="assets.profile.settingIcon" mode="aspectFit"></image>
          </view>
          <text class="action-label">个人设置</text>
        </view>
      </view>

      <!-- 地图预览卡片 -->
      <view class="map-card" @click="goTo('/pages/index/index')">
        <image class="map-preview-img" :src="assets.profile.mapShortcut" mode="aspectFill"></image>
      </view>
    </view>

    <!-- 底部导航 -->
    <CustomTabBar activePath="pages/profile/index" />
  </view>
</template>

<script>
import CustomTabBar from '@/components/CustomTabBar.vue'
import { ASSETS_CONFIG } from '@/utils/assets-config.js'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      assets: ASSETS_CONFIG
    }
  },
  onShow() {
    uni.hideTabBar();
  },
  methods: {
    goTo(url) {
      uni.navigateTo({ url });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFCB32; // 高保真黄色背景
  position: relative;
  padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

.header-section {
  position: relative;
  height: 600rpx;
  background-color: #FFCB32;
  overflow: hidden; // 关键：裁切掉背景图底部
  
  .map-bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    
    .map-img { 
      width: 100%; 
      display: block;
    }
  }
  
  .user-info {
    position: relative;
    z-index: 10;
    padding-top: 260rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .avatar-wrapper {
      width: 180rpx;
      height: 180rpx;
      background: #fff;
      border-radius: 50%;
      padding: 8rpx;
      box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.1);
      margin-bottom: 24rpx;
      
      .avatar { 
        width: 100%; 
        height: 100%; 
        border-radius: 50%; 
      }
    }
    
    .nickname {
      font-size: 56rpx;
      font-weight: bold;
      color: #000;
      letter-spacing: 1rpx;
    }
  }
}

.main-content {
  padding: 0 50rpx;
  margin-top: -30rpx;
  position: relative;
  z-index: 10;
}

.search-box {
  background: #fff;
  height: 110rpx;
  border-radius: 55rpx;
  display: flex;
  align-items: center;
  padding: 0 40rpx;
  margin-bottom: 50rpx;
  box-shadow: 0 4rpx 20rpx rgba(0,0,0,0.05);
  
  .search-inner {
    display: flex;
    align-items: center;
    width: 100%;
    
    .search-icon {
      margin-right: 15rpx;
    }
    
    .search-input { 
      flex: 1; 
      font-size: 30rpx; 
      color: #333;
    }
    
    .search-placeholder { 
      color: #999; 
    }
  }
}

.action-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50rpx;
  
  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    
    .action-icon-box {
      width: 152rpx;
      height: 148rpx;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 12rpx;
      
      .box-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
      }
      
      .action-icon { 
        width: 80rpx; 
        height: 80rpx; 
        position: relative;
        z-index: 2;
      }
    }
    
    .action-label {
      font-size: 26rpx;
      color: #fff;
      font-weight: 500;
    }
    
    &:active {
      opacity: 0.8;
      transform: scale(0.96);
    }
  }
}

.map-card {
  width: 100%;
  height: 340rpx;
  border-radius: 48rpx;
  overflow: hidden;
  box-shadow: 0 12rpx 45rpx rgba(0,0,0,0.12);
  background: #fff;
  
  .map-preview-img { 
    width: 100%; 
    height: 100%; 
  }
  
  &:active {
    opacity: 0.9;
  }
}

.animate-pop-in {
  animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes popIn {
  0% { transform: scale(0.7); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
