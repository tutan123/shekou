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
      <!-- 搜索框区域 -->
      <view class="header-search">
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <input 
            class="search-input" 
            placeholder="查找地点" 
            placeholder-style="color: #999" 
            v-model="searchKeyword"
            @input="onSearchInput"
            @confirm="onSearchConfirm"
          />
          <text class="clear-icon" v-if="searchKeyword" @click="clearSearch">✕</text>
        </view>
        
        <!-- 搜索结果列表 -->
        <scroll-view class="search-results" v-if="showResults && searchResults.length > 0" scroll-y>
          <view 
            class="result-item" 
            v-for="(item, index) in searchResults" 
            :key="index"
            @click="selectSearchResult(item)"
          >
            <image class="result-icon" :src="item.img || assets.images.markerPlaceholder" mode="aspectFill"></image>
            <view class="result-info">
              <text class="result-name">{{ item.name }}</text>
              <text class="result-desc">{{ item.desc }}</text>
            </view>
          </view>
        </scroll-view>
        <view class="search-results no-result" v-else-if="showResults && searchKeyword">
          <text>未找到相关地点</text>
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
import { POI_DATA } from '@/utils/poi-data.js'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      assets: ASSETS_CONFIG,
      searchKeyword: '',
      showResults: false,
      searchResults: []
    }
  },
  onShow() {
    uni.hideTabBar();
    this.clearSearch(); // 每次进入页面清除搜索状态
  },
  methods: {
    goTo(url) {
      uni.navigateTo({ url });
    },
    onSearchInput() {
      if (!this.searchKeyword) {
        this.searchResults = [];
        this.showResults = false;
        return;
      }
      this.searchResults = POI_DATA.filter(item => 
        item.name.includes(this.searchKeyword) || 
        (item.desc && item.desc.includes(this.searchKeyword))
      );
      this.showResults = true;
    },
    onSearchConfirm() {
      if (this.searchResults.length > 0) {
        this.selectSearchResult(this.searchResults[0]);
      } else {
        uni.showToast({ title: '未找到相关地点', icon: 'none' });
      }
    },
    clearSearch() {
      this.searchKeyword = '';
      this.searchResults = [];
      this.showResults = false;
    },
    selectSearchResult(poi) {
      this.showResults = false;
      this.searchKeyword = poi.name;
      // 跳转回首页并携带地点名称参数
      uni.switchTab({
        url: '/pages/index/index',
        success: () => {
          // 由于 switchTab 不支持 query 参数，我们需要通过其它方式传递
          // 这里通过 getCurrentPages 获取页面实例来设置参数
          const pages = getCurrentPages();
          const indexPage = pages.find(p => p.route === 'pages/index/index');
          if (indexPage) {
            indexPage.options = indexPage.options || {};
            indexPage.options.poiName = poi.name;
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
      font-weight: 900;
      color: #222;
      letter-spacing: 2rpx;
      font-family: 'RuilingTi', sans-serif !important;
      text-shadow: 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.5);
    }
  }
}

.main-content {
  padding: 0 40rpx;
  margin-top: -30rpx;
  position: relative;
  z-index: 10;
}

.header-search {
  margin-bottom: 50rpx;
  
  .search-box {
    background: #fff;
    height: 96rpx;
    // 不规则圆角：给四个角不同的弧度，对齐首页款式
    border-radius: 40rpx 60rpx 45rpx 55rpx;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    // 增加深色硬核边框
    border: 5rpx solid #222;
    // 更有“插画感”的偏置阴影
    box-shadow: 10rpx 10rpx 0rpx rgba(0,0,0,0.1);
    position: relative;
    
    .search-icon { 
      margin-right: 20rpx; 
      font-size: 38rpx; 
      color: #222;
      font-weight: bold;
    }
    
    .search-input { 
      flex: 1; 
      font-size: 32rpx; 
      font-weight: 800;
      color: #222;
      // 强制使用自定义字体
      font-family: 'RuilingTi', sans-serif !important;
    }
    
    .clear-icon { 
      padding: 10rpx; 
      font-size: 30rpx; 
      color: #666; 
      font-weight: bold; 
    }
  }

  .search-results {
    margin-top: 15rpx;
    background: #fff;
    border: 4rpx solid #222;
    border-radius: 35rpx 50rpx 40rpx 45rpx;
    max-height: 400rpx;
    box-shadow: 12rpx 12rpx 0rpx rgba(0,0,0,0.1);
    overflow: hidden;
    position: absolute;
    left: 0;
    right: 0;
    z-index: 100;
    
    &.no-result {
      padding: 30rpx;
      text-align: center;
      font-size: 26rpx;
      color: #666;
      font-weight: bold;
    }

    .result-item {
      display: flex;
      align-items: center;
      padding: 25rpx 30rpx;
      border-bottom: 3rpx solid #eee;
      
      &:last-child { border-bottom: none; }
      &:active { background: #f9f9f9; }
      
      .result-icon {
        width: 70rpx;
        height: 70rpx;
        border-radius: 15rpx;
        margin-right: 20rpx;
        background: #f0f0f0;
        border: 2rpx solid #222;
      }
      
      .result-info {
        flex: 1;
        overflow: hidden;
        .result-name {
          font-size: 30rpx;
          font-weight: 900;
          color: #222;
          display: block;
        }
        .result-desc {
          font-size: 22rpx;
          color: #666;
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}

.action-grid {
  display: flex;
  justify-content: space-between;
  margin-bottom: 50rpx;
  position: relative;
  z-index: 5;
  
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
      font-size: 28rpx;
      color: #222;
      font-weight: 900;
      font-family: 'RuilingTi', sans-serif !important;
      background: #fff;
      padding: 4rpx 16rpx;
      border-radius: 12rpx;
      border: 3rpx solid #222;
      box-shadow: 4rpx 4rpx 0rpx rgba(0,0,0,0.1);
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
  // 给小地图也加个边框，更有插画成组的感觉
  border: 8rpx solid #222; // 加粗边框
  box-sizing: border-box;
  overflow: hidden;
  box-shadow: 12rpx 12rpx 0rpx rgba(0,0,0,0.1);
  background: #222; // 改为黑色背景，确保白边不漏
  
  .map-preview-img { 
    width: 100%; 
    height: 100%; 
    // 放大到 1.3 倍并向上微调，确保彻底覆盖
    transform: scale(1.3) translateY(5rpx);
    display: block;
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
