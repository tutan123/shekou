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
          @click="showPoiDetail(poi)"
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
          <text class="arrow"></text>
        </view>
      </view>
    </view>

    <CustomTabBar activePath="pages/index/index" />

    <!-- 详情弹窗 -->
    <view v-if="detailVisible" class="detail-popup-mask" @click="hideDetail">
      <view class="detail-popup-content" @click.stop>
        <view class="close-btn" @click="hideDetail">✕</view>
        <image class="detail-image" :src="currentDetailImg" mode="widthFix"></image>
        <view class="check-in-btn-container" @click="hideDetail">
          <image class="btn-bg" :src="assets.route.checkinBtn" mode="scaleToFill"></image>
          <text class="btn-text">查看详情</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import CustomTabBar from '@/components/CustomTabBar.vue'
import SafeImage from '@/components/SafeImage.vue'
import { ASSETS_CONFIG, checkCloudFile } from '@/utils/assets-config.js'
import { POI_DATA } from '@/utils/poi-data.js'
import { CATEGORIES } from '@/utils/poi-config.js'

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
      initialState: null, // 记录初始视角状态
      searchKeyword: '',
      showResults: false,
      searchResults: [],
      markers: POI_DATA,
      detailVisible: false,
      currentDetailImg: ''
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
    
    // 检查是否有搜索跳转过来的参数
    const pages = getCurrentPages();
    const curPage = pages[pages.length - 1];
    if (curPage && curPage.options && curPage.options.poiName) {
      const poiName = curPage.options.poiName;
      console.log('🔍 页面显示 - 检测到搜索参数:', poiName);
      
      // 等待地图加载完成后聚焦
      const timer = setInterval(() => {
        if (this.mapLoaded) {
          const poi = this.markers.find(m => m.name === poiName);
          if (poi) {
            this.focusPoi(poi);
          }
          clearInterval(timer);
          // 清除参数避免重复触发
          curPage.options.poiName = null;
        }
      }, 100);
      
      // 5秒后自动清理定时器防止死循环
      setTimeout(() => clearInterval(timer), 5000);
    }
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
      
      // 记录初始视角状态 (居中，且略微放大)
      const startScale = this.minScale * 1.5;
      this.initialState = {
        scale: startScale,
        x: (this.windowWidth - this.mapWidth * startScale) / 2,
        y: (this.windowHeight - this.mapHeight * startScale) / 2
      };
      
      this.resetMap();
    },
    resetMap() {
      if (!this.mapLoaded || !this.initialState) return;
      
      const { scale, x, y } = this.initialState;
      console.log('🔄 重置视角到初始状态:', { scale, x, y });
      
      // 1. 强制触发缩放更新
      this.scaleValue = scale + 0.001;
      
      this.$nextTick(() => {
        this.scaleValue = scale;
        this.curScale = scale;
        
        // 2. 强制触发位置更新
        // 在缩放指令下发后，延迟设置坐标，防止被组件内部的缩放焦点偏移覆盖
        this.mapX = x + 0.01;
        this.mapY = y + 0.01;
        
        this.$nextTick(() => {
          this.mapX = x;
          this.mapY = y;
        });
      });
    },
    onScale(e) {
      // 只记录当前比例，绝不在此处修改 scaleValue
      this.curScale = e.detail.scale;
    },
    onChange(e) {
      // 仅当用户手动操作（非程序设置）时记录坐标
      // source 为 "" 表示程序设置，不应更新 mapX/mapY，否则会干扰重置逻辑
      if (e.detail.source !== '') {
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
    onSearchInput() {
      if (!this.searchKeyword) {
        this.searchResults = [];
        this.showResults = false;
        return;
      }
      this.searchResults = this.markers.filter(item => 
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
      this.searchKeyword = poi.name;
      this.showResults = false;
      this.selectedPoi = poi;
      this.focusPoi(poi);
    },
    focusPoi(poi) {
      if (!this.mapLoaded) return;
      
      this.selectedPoi = poi;
      
      const targetScale = 2.5; // 聚焦时放大比例
      
      // 计算目标位置，使 POI 居中
      // POI 的位置是百分比，相对于 mapWidth 和 mapHeight
      const poiX = (this.mapWidth * poi.left) / 100;
      const poiY = (this.mapHeight * poi.top) / 100;
      
      const targetX = (this.windowWidth / 2) - (poiX * targetScale);
      const targetY = (this.windowHeight / 2) - (poiY * targetScale);
      
      console.log('🎯 聚焦地点:', poi.name, { targetScale, targetX, targetY });
      
      this.updateScale(targetScale);
      
      this.$nextTick(() => {
        // 使用微小偏移强制位置更新
        this.mapX = targetX + 0.01;
        this.mapY = targetY + 0.01;
        
        this.$nextTick(() => {
          this.mapX = targetX;
          this.mapY = targetY;
        });
      });
    },
    showPoiDetail(poi) {
      this.selectedPoi = poi;
    },
    goToDetail() {
      if (!this.selectedPoi) return;
      
      // 在 CATEGORIES 中查找详情图
      let detailImg = '';
      Object.keys(CATEGORIES).some(catKey => {
        const item = CATEGORIES[catKey].items[this.selectedPoi.name];
        if (item && item.detailImg) {
          detailImg = item.detailImg;
          return true;
        }
        return false;
      });

      if (detailImg) {
        this.currentDetailImg = detailImg;
        this.detailVisible = true;
      } else {
        uni.showToast({ title: '暂无详情', icon: 'none' });
      }
    },
    hideDetail() {
      this.detailVisible = false;
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
    width: 46rpx;
    height: 46rpx;
    z-index: 5;
    transform: translate(-50%, -50%);
    transition: transform 0.2s ease;
    &:active {
      transform: translate(-50%, -50%) scale(1.2);
    }
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
      .clear-icon { padding: 10rpx; font-size: 24rpx; color: #999; }
    }

    .search-results {
      margin-top: 10rpx;
      background: #fff;
      border-radius: 30rpx;
      max-height: 400rpx;
      box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.1);
      overflow: hidden;
      
      &.no-result {
        padding: 30rpx;
        text-align: center;
        font-size: 26rpx;
        color: #999;
      }

      .result-item {
        display: flex;
        align-items: center;
        padding: 20rpx 30rpx;
        border-bottom: 1rpx solid #f5f5f5;
        
        &:last-child { border-bottom: none; }
        &:active { background: #f9f9f9; }
        
        .result-icon {
          width: 60rpx;
          height: 60rpx;
          border-radius: 12rpx;
          margin-right: 20rpx;
          background: #f0f0f0;
        }
        
        .result-info {
          flex: 1;
          overflow: hidden;
          .result-name {
            font-size: 28rpx;
            font-weight: bold;
            color: #333;
            display: block;
          }
          .result-desc {
            font-size: 22rpx;
            color: #999;
            display: block;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
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
    .detail-btn { 
      display: flex; 
      align-items: center; 
      gap: 6rpx; 
      font-size: 24rpx; 
      color: #0088CC; 
      font-weight: bold; 
      .arrow { 
        width: 14rpx;
        height: 14rpx;
        border-top: 4rpx solid #0088CC;
        border-right: 4rpx solid #0088CC;
        transform: rotate(45deg);
        margin-left: 10rpx;
      } 
    }
  }
}

@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
@keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

// 详情弹窗样式
.detail-popup-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(5px);
  pointer-events: auto;
}

.detail-popup-content {
  width: 85%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .detail-image {
    width: 100%;
    border-radius: 40rpx;
    box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.4);
    display: block;
  }
  
  .close-btn {
    position: absolute;
    top: -80rpx;
    right: 0;
    width: 60rpx;
    height: 60rpx;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 40rpx;
    border: 2rpx solid rgba(255,255,255,0.3);
  }

  .check-in-btn-container {
    width: 320rpx;
    height: 96rpx;
    margin-top: -60rpx; // 向上移动，叠在卡片内容上
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    position: relative; // 使用相对定位更稳定
    left: 0;
    transform: none;
    margin-left: auto;
    margin-right: auto;
    
    .btn-bg {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      z-index: 1;
    }
    
    .btn-text {
      position: relative;
      z-index: 2;
      color: #fff;
      font-size: 32rpx;
      font-weight: bold;
      letter-spacing: 4rpx;
    }
  }
}
</style>
