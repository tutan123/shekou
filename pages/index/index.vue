<template>
  <view class="container">
    <!-- 底图层：全屏艺术地图 -->
    <view class="map-layer">
      <image class="main-map" src="/static/images/main_map.png" mode="aspectFill"></image>
      
      <!-- 模拟标记点 (后续可通过数据循环生成) -->
      <view class="marker" style="top: 45%; left: 52%;" @click="showPoiDetail('海上世界')">
        <image class="marker-icon" src="/static/images/marker_placeholder.png" mode="aspectFit"></image>
      </view>
    </view>
    
    <!-- 顶层：浮动控制按钮 -->
    <view class="floating-ui">
      <!-- 搜索框 -->
      <view class="search-bar animate-slide-down">
        <text class="icon">🔍</text>
        <input class="input" placeholder="查找地点" placeholder-style="color: #999" />
      </view>
      
      <!-- 右侧功能键 -->
      <view class="right-controls">
        <view class="control-btn animate-fade-in" style="animation-delay: 0.2s;" @click="getLocation">
          <view class="icon-box">
            <image class="icon" src="/static/images/location_icon.png" mode="aspectFit"></image>
          </view>
          <text class="label">我的位置</text>
        </view>
        
        <view class="control-btn animate-fade-in" style="animation-delay: 0.4s;" @click="goToRouteSelect">
          <view class="icon-box route-box">
            <image class="icon" src="/static/images/route_icon.png" mode="aspectFit"></image>
          </view>
          <text class="label">路线选择</text>
        </view>
      </view>
    </view>
    
    <!-- 底部卡片预览 (点击标记点后弹出) -->
    <view class="poi-preview-card" v-if="selectedPoi" @click="goToDetail">
      <image class="poi-img" :src="selectedPoi.img" mode="aspectFill"></image>
      <view class="poi-info">
        <text class="poi-name">{{ selectedPoi.name }}</text>
        <text class="poi-desc">{{ selectedPoi.desc }}</text>
      </view>
      <text class="arrow">></text>
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
        img: '/static/images/avatar_placeholder.png' // 使用已有图片避免报错
      }
    },
    goToDetail() {
      // 以后跳往详情页
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  position: relative;
  background-color: #FFF9E6; /* 确保有一个底色，而不是纯白 */
}

.map-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: #e5e5e5; /* 地图加载前显示灰色 */
  
  .main-map {
    width: 100%;
    height: 100%;
    display: block;
  }
  
  .marker {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
    z-index: 5;
    .marker-icon { width: 100%; height: 100%; }
  }
}

.floating-ui {
  position: relative;
  z-index: 10;
  padding: 100rpx 30rpx 0;
  
  .search-bar {
    background: #fff;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    padding: 0 40rpx;
    box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.1);
    
    .icon { font-size: 32rpx; margin-right: 20rpx; }
    .input { flex: 1; font-size: 30rpx; }
  }
  
  .right-controls {
    position: absolute;
    top: 240rpx;
    right: 30rpx;
    display: flex;
    flex-direction: column;
    gap: 30rpx;
    
    .control-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10rpx;
      
      .icon-box {
        width: 120rpx;
        height: 120rpx;
        background: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.12);
        border: 2rpx solid #FFCC00;
        
        &.route-box {
          background: #0088CC;
          border-color: #0088CC;
          .icon { filter: brightness(0) invert(1); }
        }
        
        .icon { width: 60rpx; height: 60rpx; }
      }
      
      .label {
        font-size: 20rpx;
        color: #333;
        font-weight: 800;
        background: rgba(255,255,255,0.8);
        padding: 4rpx 12rpx;
        border-radius: 20rpx;
      }
    }
  }
}

.poi-preview-card {
  position: absolute;
  bottom: 60rpx;
  left: 40rpx;
  right: 40rpx;
  height: 160rpx;
  background: #fff;
  border-radius: 40rpx;
  z-index: 100;
  display: flex;
  align-items: center;
  padding: 20rpx;
  box-shadow: 0 20rpx 50rpx rgba(0,0,0,0.15);
  animation: slideUp 0.4s ease-out;
  
  .poi-img { width: 120rpx; height: 120rpx; border-radius: 24rpx; flex-shrink: 0; }
  .poi-info {
    flex: 1;
    margin: 0 24rpx;
    overflow: hidden;
    .poi-name { font-size: 32rpx; font-weight: bold; display: block; margin-bottom: 4rpx; }
    .poi-desc { font-size: 22rpx; color: #999; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  }
  .arrow { font-size: 32rpx; color: #ccc; }
}

@keyframes slideDown {
  from { transform: translateY(-100rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-slide-down { animation: slideDown 0.6s ease-out both; }
.animate-fade-in { animation: fadeIn 0.6s ease-out both; }
</style>
