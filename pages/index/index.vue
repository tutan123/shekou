<template>
  <view class="container">
    <!-- 底图层：全屏艺术地图 -->
    <view class="map-layer">
      <image class="main-map" src="/static/index/main_map.png" mode="aspectFill"></image>
      
      <!-- 模拟标记点 (后续可通过数据循环生成) -->
      <view class="marker" style="top: 45%; left: 52%;" @click="showPoiDetail('海上世界')">
        <image class="marker-icon" src="/static/images/marker_placeholder.png" mode="aspectFit"></image>
      </view>
    </view>
    
    <!-- 顶层：浮动控制按钮 -->
    <view class="floating-ui">
      <!-- 顶部搜索栏 - 高保真样式 -->
      <view class="header-search animate-slide-down">
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <input class="search-input" placeholder="查找地点" placeholder-style="color: #999" />
        </view>
      </view>
      
      <!-- 右侧功能键 - 高保真样式 -->
      <view class="side-controls">
        <view class="control-item animate-fade-in" style="animation-delay: 0.2s;" @click="getLocation">
          <image class="control-img" src="/static/index/location_btn.png" mode="aspectFit"></image>
          <text class="control-label">我的位置</text>
        </view>
        
        <view class="control-item animate-fade-in" style="animation-delay: 0.4s;" @click="goToRouteSelect">
          <image class="control-img" src="/static/index/route_btn.png" mode="aspectFit"></image>
          <text class="control-label">路线选择</text>
        </view>
      </view>
    </view>
    
    <!-- 底部预览卡片 - 修复位置问题并匹配高保真 -->
    <view class="poi-preview-card" v-if="selectedPoi" @click="goToDetail">
      <view class="card-content">
        <image class="poi-avatar" :src="selectedPoi.img" mode="aspectFill"></image>
        <view class="poi-text">
          <text class="poi-name">{{ selectedPoi.name }}</text>
          <text class="poi-desc">{{ selectedPoi.desc }}</text>
        </view>
        <view class="detail-btn">
          <text>查看详情</text>
          <text class="arrow">></text>
        </view>
      </view>
    </view>

    <!-- 自定义底部导航 -->
    <CustomTabBar activePath="pages/index/index" />
  </view>
</template>

<script>
import CustomTabBar from '@/components/CustomTabBar.vue'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      selectedPoi: null
    }
  },
  onLoad() {
    console.log('首页加载完成');
  },
  onShow() {
    uni.hideTabBar();
  },
  methods: {
    getLocation() {
      uni.showLoading({ title: '定位中...' });
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          uni.hideLoading();
          uni.showToast({ title: '已定位到当前位置', icon: 'none' });
        },
        fail: () => {
          uni.hideLoading();
          uni.showToast({ title: '定位失败', icon: 'none' });
        }
      });
    },
    goToRouteSelect() {
      uni.navigateTo({
        url: '/pages/route/select'
      });
    },
    showPoiDetail(name) {
      this.selectedPoi = {
        name: name,
        desc: '这里是蛇口的标志性建筑，融合了文化、艺术与商业...',
        img: '/static/images/avatar_placeholder.png'
      }
    },
    goToDetail() {
      uni.showToast({ title: '跳转到详情...', icon: 'none' });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  position: relative;
  background-color: #FFF9E6;
  overflow: hidden;
}

.map-layer {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 1;
  
  .main-map {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .marker {
    position: absolute;
    width: 80rpx;
    height: 80rpx;
    z-index: 5;
    transform: translate(-50%, -50%);
    
    .marker-icon {
      width: 100%;
      height: 100%;
      filter: drop-shadow(0 4rpx 10rpx rgba(0,0,0,0.2));
    }
  }
}

.floating-ui {
  position: relative;
  z-index: 10;
  padding-top: calc(var(--status-bar-height) + 20rpx);
  pointer-events: none; // 允许点击到底图
  
  .header-search {
    padding: 20rpx 40rpx;
    pointer-events: auto;
    
    .search-box {
      background: #fff;
      height: 90rpx;
      border-radius: 45rpx;
      display: flex;
      align-items: center;
      padding: 0 40rpx;
      box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.08);
      
      .search-icon { margin-right: 20rpx; font-size: 32rpx; }
      .search-input { flex: 1; font-size: 28rpx; }
    }
  }
  
  .side-controls {
    position: absolute;
    top: 240rpx;
    right: 30rpx;
    display: flex;
    flex-direction: column;
    gap: 40rpx;
    pointer-events: auto;
    
    .control-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8rpx;
      
      .control-img {
        width: 110rpx;
        height: 110rpx;
        filter: drop-shadow(0 8rpx 20rpx rgba(0,0,0,0.15));
        transition: transform 0.2s;
        
        &:active { transform: scale(0.9); }
      }
      
      .control-label {
        font-size: 20rpx;
        color: #333;
        font-weight: 900;
        background: rgba(255,255,255,0.85);
        padding: 4rpx 16rpx;
        border-radius: 20rpx;
        backdrop-filter: blur(4px);
      }
    }
  }
}

.poi-preview-card {
  position: absolute;
  bottom: calc(160rpx + env(safe-area-inset-bottom)); // 避开自定义Tabbar
  left: 30rpx;
  right: 30rpx;
  z-index: 100;
  animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  
  .card-content {
    background: #fff;
    border-radius: 40rpx;
    padding: 24rpx;
    display: flex;
    align-items: center;
    box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.12);
    
    .poi-avatar {
      width: 120rpx;
      height: 120rpx;
      border-radius: 24rpx;
      flex-shrink: 0;
    }
    
    .poi-text {
      flex: 1;
      margin: 0 24rpx;
      overflow: hidden;
      
      .poi-name {
        font-size: 34rpx;
        font-weight: 800;
        color: #333;
        display: block;
        margin-bottom: 6rpx;
      }
      
      .poi-desc {
        font-size: 24rpx;
        color: #999;
        display: block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    
    .detail-btn {
      display: flex;
      align-items: center;
      gap: 6rpx;
      font-size: 24rpx;
      color: #0088CC;
      font-weight: bold;
      
      .arrow { font-size: 28rpx; }
    }
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideDown {
  from { transform: translateY(-100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slide-down { animation: slideDown 0.6s ease-out both; }
.animate-fade-in { animation: fadeIn 0.6s ease-out both; }
</style>
