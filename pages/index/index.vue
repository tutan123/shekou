<template>
  <view class="container">
    <!-- 底图层：通过 movable-area 实现标准化的缩放和边界限制 -->
    <movable-area class="map-area" @mousewheel.stop.prevent="onMouseWheel">
      <movable-view 
        class="map-view" 
        direction="all" 
        :scale="true" 
        :scale-min="minScale" 
        :scale-max="4" 
        :scale-value="scaleValue"
        :x="mapX" 
        :y="mapY"
        :style="{ width: mapWidth + 'px', height: mapHeight + 'px' }"
        @scale="onScale"
        @change="onChange"
      >
        <!-- 渐进式地图层 -->
        <view class="map-wrapper" :style="{ width: mapWidth + 'px', height: mapHeight + 'px' }">
          <!-- 1. 本地模糊占位图 (改为从云端加载以减小程序包体积) -->
          <image 
            class="map-layer low-res" 
            :src="assets.images.blankMap" 
            mode="aspectFill"
          ></image>
          
          <!-- 2. 云端高清图 -->
          <image 
            class="map-layer high-res" 
            :class="{ loaded: mapLoaded }"
            :src="assets.index.bigMap" 
            mode="aspectFill"
            @load="onMapLoad"
          ></image>
        </view>
        
        <!-- 景点标记点：相对于地图定位 -->
        <view 
          class="marker" 
          v-for="(poi, index) in markers" 
          :key="index"
          :style="{ top: poi.top + '%', left: poi.left + '%' }" 
          @click="showPoiDetail(poi.name)"
        >
          <image class="marker-icon" :src="assets.images.markerPlaceholder" mode="aspectFit"></image>
        </view>
      </movable-view>
    </movable-area>
    
    <!-- 顶层：浮动控制按钮 -->
    <view class="floating-ui">
      <!-- 搜索栏 -->
      <view class="header-search animate-slide-down">
        <view class="search-box">
          <text class="search-icon">🔍</text>
          <input class="search-input" placeholder="查找地点" placeholder-style="color: #999" />
        </view>
      </view>
      
      <!-- 右侧功能键 -->
      <view class="side-controls">
        <view class="control-item animate-fade-in" @click="resetMap">
          <view class="icon-wrapper">
            <image class="ellipse-bg" :src="assets.index.ellipse" mode="aspectFit"></image>
            <image class="inner-icon" :src="assets.index.locationBtn" mode="aspectFit"></image>
          </view>
          <text class="control-label">重置视角</text>
        </view>
        
        <view class="control-item animate-fade-in" @click="goToRouteSelect">
          <view class="icon-wrapper">
            <image class="ellipse-bg" :src="assets.index.ellipse" mode="aspectFit"></image>
            <image class="inner-icon" :src="assets.index.routeBtn" mode="aspectFit"></image>
          </view>
          <text class="control-label">路线选择</text>
        </view>

        <!-- 新增：缩放控制按钮 -->
        <view class="control-item animate-fade-in" @click="zoomIn">
          <view class="icon-wrapper small">
            <image class="ellipse-bg" :src="assets.index.ellipse" mode="aspectFit"></image>
            <text class="zoom-text">+</text>
          </view>
        </view>
        <view class="control-item animate-fade-in" @click="zoomOut">
          <view class="icon-wrapper small">
            <image class="ellipse-bg" :src="assets.index.ellipse" mode="aspectFit"></image>
            <text class="zoom-text">-</text>
          </view>
        </view>
      </view>
    </view>
    
    <!-- 底部预览卡片 -->
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

    <CustomTabBar activePath="pages/index/index" />
  </view>
</template>

<script>
import CustomTabBar from '@/components/CustomTabBar.vue'
import SafeImage from '@/components/SafeImage.vue'
import { ASSETS_CONFIG, checkCloudFile } from '@/utils/assets-config.js'

export default {
  components: {
    CustomTabBar,
    SafeImage
  },
  data() {
    return {
      assets: ASSETS_CONFIG,
      selectedPoi: null,
      scaleValue: 1.5, // 仅用于控制组件缩放指令
      curScale: 1.5,   // 记录当前实际缩放比例
      minScale: 1,
      mapX: 0,
      mapY: 0,
      mapWidth: 0,
      mapHeight: 0,
      windowWidth: 0,
      windowHeight: 0,
      mapLoaded: false, // 地图是否已加载完成
      markers: [
        { name: '海上世界', top: 45, left: 52 },
        { name: '老街入口', top: 30, left: 40 }
      ]
    }
  },
  onLoad() {
    console.log('🏠 首页加载 - ASSETS_CONFIG:', this.assets);
    console.log('🏠 首页加载 - 大地图路径:', this.assets?.index?.bigMap);

    // 验证关键文件路径
    checkCloudFile('index/big_map.png', '首页大地图');
    checkCloudFile('images/marker_placeholder.png', '标记点图标');
    checkCloudFile('images/avatar_placeholder.png', '头像占位图');

    const sys = uni.getSystemInfoSync();
    this.windowWidth = sys.windowWidth;
    this.windowHeight = sys.windowHeight;
  },
  onShow() {
    uni.hideTabBar();
  },
  methods: {
    onMapLoad(e) {
      console.log('✅ 高清大地图加载完成');
      this.mapLoaded = true;
      const { width, height } = e.detail;
      this.mapWidth = this.windowWidth * 3; 
      this.mapHeight = (this.mapWidth * height) / width;
      
      const minScaleW = this.windowWidth / this.mapWidth;
      const minScaleH = this.windowHeight / this.mapHeight;
      this.minScale = Math.max(minScaleW, minScaleH);
      
      this.curScale = this.minScale * 1.5;
      this.scaleValue = this.curScale;
      this.resetMap();
    },
    resetMap() {
      this.curScale = this.minScale * 1.5;
      this.scaleValue = this.curScale;
      // 延迟计算位置，确保缩放已应用
      this.$nextTick(() => {
        this.mapX = (this.windowWidth - this.mapWidth * this.curScale) / 2;
        this.mapY = (this.windowHeight - this.mapHeight * this.curScale) / 2;
      });
    },
    onScale(e) {
      // 只记录当前比例，绝不在此处修改 scaleValue
      this.curScale = e.detail.scale;
    },
    onChange(e) {
      // 仅记录位置，不回流修改 mapX/mapY
      if (e.detail.source === '') {
        this.mapX = e.detail.x;
        this.mapY = e.detail.y;
      }
    },
    onMouseWheel(e) {
      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      this.updateScale(this.curScale + delta);
    },
    zoomIn() {
      this.updateScale(this.curScale + 0.4);
    },
    zoomOut() {
      this.updateScale(this.curScale - 0.4);
    },
    updateScale(newScale) {
      let targetScale = Math.min(Math.max(newScale, this.minScale), 4);
      // 强制触发更新：先变再变回
      this.scaleValue = targetScale + 0.0001;
      this.$nextTick(() => {
        this.scaleValue = targetScale;
        this.curScale = targetScale;
      });
    },
    goToRouteSelect() {
      uni.navigateTo({ url: '/pages/route/select' });
    },
    showPoiDetail(name) {
      this.selectedPoi = {
        name: name,
        desc: '探索蛇口艺术地图，点击查看详情...',
        img: this.assets.images.avatarPlaceholder
      }
    },
    goToDetail() {
      uni.showToast({ title: '跳转详情页', icon: 'none' });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background-color: #FFF9E6;
  overflow: hidden;
}

.map-area {
  width: 100%;
  height: 100%;
  background-color: #FFF9E6; 
}

.map-view {
  .map-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    
    .map-layer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transition: opacity 0.8s ease-in-out;
      
      &.low-res {
        z-index: 1;
        filter: blur(10px); // 增加模糊感，掩盖低清细节
      }
      
      &.high-res {
        z-index: 2;
        opacity: 0;
        
        &.loaded {
          opacity: 1;
        }
      }
    }
  }
  
  .marker {
    position: absolute;
    width: 60rpx;
    height: 60rpx;
    z-index: 5;
    transform: translate(-50%, -50%);
    .marker-icon { 
      width: 100%; height: 100%; 
      filter: drop-shadow(0 4rpx 8rpx rgba(0,0,0,0.3));
    }
  }
}

.floating-ui {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 10;
  pointer-events: none;
  padding-top: calc(var(--status-bar-height) + 20rpx);
  
  .header-search {
    padding: 20rpx 40rpx;
    pointer-events: auto;
    .search-box {
      background: #fff; height: 90rpx; border-radius: 45rpx;
      display: flex; align-items: center; padding: 0 40rpx;
      box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.08);
      .search-icon { margin-right: 20rpx; font-size: 32rpx; }
      .search-input { flex: 1; font-size: 28rpx; }
    }
  }
  
  .side-controls {
    position: absolute; top: 240rpx; right: 30rpx;
    display: flex; flex-direction: column; gap: 40rpx;
    pointer-events: auto;
    .control-item {
      display: flex; flex-direction: column; align-items: center; gap: 8rpx;
      .icon-wrapper {
        position: relative; width: 110rpx; height: 110rpx;
        display: flex; align-items: center; justify-content: center;
        &.small { width: 80rpx; height: 80rpx; }
        .ellipse-bg { position: absolute; width: 100%; height: 100%; top: 0; left: 0; filter: drop-shadow(0 8rpx 20rpx rgba(0,0,0,0.15)); }
        .inner-icon { position: relative; z-index: 1; width: 42rpx; height: 42rpx; }
        .zoom-text { position: relative; z-index: 1; font-size: 40rpx; font-weight: bold; color: #333; }
        &:active { transform: scale(0.9); transition: transform 0.2s; }
      }
      .control-label {
        font-size: 20rpx; color: #333; font-weight: 900;
        background: rgba(255,255,255,0.85); padding: 4rpx 16rpx; border-radius: 20rpx; backdrop-filter: blur(4px);
      }
    }
  }
}

.poi-preview-card {
  position: absolute;
  bottom: calc(160rpx + env(safe-area-inset-bottom));
  left: 30rpx; right: 30rpx; z-index: 100;
  animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  .card-content {
    background: #fff; border-radius: 40rpx; padding: 24rpx;
    display: flex; align-items: center; box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.12);
    .poi-avatar { width: 120rpx; height: 120rpx; border-radius: 24rpx; flex-shrink: 0; }
    .poi-text { flex: 1; margin: 0 24rpx; overflow: hidden;
      .poi-name { font-size: 34rpx; font-weight: 800; color: #333; display: block; margin-bottom: 6rpx; }
      .poi-desc { font-size: 24rpx; color: #999; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    }
    .detail-btn { display: flex; align-items: center; gap: 6rpx; font-size: 24rpx; color: #0088CC; font-weight: bold; .arrow { font-size: 28rpx; } }
  }
}

@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
