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
        :inertia="true"
        :damping="40"
        :friction="1"
        :style="{ width: (mapWidth + mapPadding * 2) + 'px', height: (mapHeight + mapPadding * 2) + 'px' }"
        @scale="onScale"
        @change="onChange"
      >
        <!-- 地图容器：增加边距实现留白效果 -->
        <view 
          class="map-inner-container"
          :style="{ 
            width: mapWidth + 'px', 
            height: mapHeight + 'px',
            padding: mapPadding + 'px'
          }"
        >
          <!-- 渐进式地图层 -->
          <view class="map-wrapper" :style="{ width: mapWidth + 'px', height: mapHeight + 'px' }" @click="onMapClick">
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
            @click.stop="showPoiDetail(poi)"
          >
            <image class="marker-icon" :src="assets.images.markerPlaceholder" mode="aspectFit"></image>
          </view>

          <!-- 用户当前位置标记点 -->
          <view 
            class="user-marker" 
            v-if="userLocation"
            :style="{ top: userLocation.top + '%', left: userLocation.left + '%' }"
          >
            <image class="user-avatar" :src="assets.images.avatarPlaceholder" mode="aspectFit"></image>
          </view>
        </view>
      </movable-view>
    </movable-area>
    
    <!-- 顶层：浮动控制按钮 -->
    <view class="floating-ui">
      <!-- 区域外提示横栏 -->
      <view class="out-of-bounds-banner" v-if="outOfBounds">
        <text class="warning-icon">📍</text>
        <text class="warning-text">当前不在蛇口手绘地图区域内</text>
      </view>

      <!-- 搜索栏 -->
      <view class="header-search animate-slide-down" :class="{ 'with-banner': outOfBounds }">
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
import { projectCoordinates } from '@/utils/map-projection.js'

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
      lastX: 0, // 记录当前实际 X 坐标，不直接同步到 mapX
      lastY: 0, // 记录当前实际 Y 坐标，不直接同步到 mapY
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
      currentDetailImg: '',
      userLocation: null, // { top, left } 百分比坐标
      outOfBounds: false,
      locationWatcher: null,
      mapPadding: 100 // 地图四周留白的像素值
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

    this.startLocationTracking();
  },
  onUnload() {
    if (this.locationWatcher) {
      uni.stopLocationUpdate();
    }
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
      
      const minScaleW = this.windowWidth / (this.mapWidth + this.mapPadding * 2);
      const minScaleH = this.windowHeight / (this.mapHeight + this.mapPadding * 2);
      this.minScale = Math.max(minScaleW, minScaleH);
      
      // 记录初始视角状态 (居中，且略微放大)
      const startScale = this.minScale * 1.5;
      const centerX = (this.mapWidth / 2) + this.mapPadding;
      const centerY = (this.mapHeight / 2) + this.mapPadding;

      this.initialState = {
        scale: startScale,
        x: (this.windowWidth / 2) - (centerX * startScale),
        y: (this.windowHeight / 2) - (centerY * startScale)
      };
      
      this.resetMap();
    },
    resetMap() {
      if (!this.mapLoaded || !this.initialState) return;
      
      // 如果用户在区域内，重置时优先居中用户
      if (this.userLocation && !this.outOfBounds) {
        this.focusPoi({ 
          left: this.userLocation.left, 
          top: this.userLocation.top, 
          name: '当前位置' 
        });
        return;
      }

      const { scale, x, y } = this.initialState;
      console.log('🔄 重置视角到初始状态:', { scale, x, y });
      
      // 1. 强制触发缩放更新
      this.scaleValue = scale + 0.001;
      
      this.$nextTick(() => {
        this.scaleValue = scale;
        this.curScale = scale;
        
        // 2. 强制触发位置更新
        // 在缩放指令下发后，延迟设置坐标，防止被组件内部的缩放焦点偏移覆盖
        this.lastX = x;
        this.lastY = y;
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
      // 缩放时位置也会变，记录下来
      this.lastX = e.detail.x;
      this.lastY = e.detail.y;
    },
    onChange(e) {
      // 始终记录当前位置
      this.lastX = e.detail.x;
      this.lastY = e.detail.y;
      
      // 只有当 source 为空（程序触发）时，才同步 mapX/mapY
      // 如果 source 不为空（touch, friction 等），则不要修改 mapX/mapY
      // 这样可以彻底解决单指拖拽时的“闪烁/抖动”问题
      if (e.detail.source === '') {
        this.mapX = e.detail.x;
        this.mapY = e.detail.y;
      }
    },
    onMouseWheel(e) {
      // 增加防抖或简单的频率控制，防止滚轮过快
      if (this._wheelTimer) return;
      this._wheelTimer = true;
      setTimeout(() => this._wheelTimer = false, 50);

      const delta = e.deltaY < 0 ? 0.2 : -0.2;
      this.updateScale(this.curScale + delta);
    },
    zoomIn() {
      this.updateScale(this.curScale + 0.5);
    },
    zoomOut() {
      this.updateScale(this.curScale - 0.5);
    },
    updateScale(newScale) {
      let targetScale = Math.min(Math.max(newScale, this.minScale), 4);
      
      // 重要：在改变 scaleValue 前，先同步当前坐标到 mapX/mapY
      // 否则 movable-view 会跳回到上一次绑定的坐标点
      this.mapX = this.lastX;
      this.mapY = this.lastY;
      
      this.$nextTick(() => {
        // 强制触发更新：先变再变回
        this.scaleValue = targetScale + 0.0001;
        this.$nextTick(() => {
          this.scaleValue = targetScale;
          this.curScale = targetScale;
        });
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
      const poiX = (this.mapWidth * poi.left) / 100 + this.mapPadding;
      const poiY = (this.mapHeight * poi.top) / 100 + this.mapPadding;
      
      const targetX = (this.windowWidth / 2) - (poiX * targetScale);
      const targetY = (this.windowHeight / 2) - (poiY * targetScale);
      
      console.log('🎯 聚焦地点:', poi.name, { targetScale, targetX, targetY });
      
      this.updateScale(targetScale);
      
      this.$nextTick(() => {
        // 使用微小偏移强制位置更新
        this.lastX = targetX;
        this.lastY = targetY;
        this.mapX = targetX + 0.01;
        this.mapY = targetY + 0.01;
        
        this.$nextTick(() => {
          this.mapX = targetX;
          this.mapY = targetY;
        });
      });
    },
    showPoiDetail(poi) {
      // 打印相对坐标用于调试
      console.log(`📍 标记点点击: ${poi.name} - 相对坐标: top=${poi.top}%, left=${poi.left}%`);

      this.selectedPoi = poi;
    },
    onMapClick(e) {
      // 点击地图空白区域时关闭弹窗和预览卡片
      this.hideDetail();
      this.selectedPoi = null;

      // 在小程序环境中使用uni.createSelectorQuery获取元素信息
      const query = uni.createSelectorQuery().in(this);
      query.select('.map-view').boundingClientRect(data => {
        if (data) {
          // 获取点击位置相对于页面的坐标 (兼容小程序 detail.x 和 touch.pageX)
          let x = 0;
          let y = 0;
          
          if (e.detail && typeof e.detail.x !== 'undefined') {
            // 小程序 click/tap 事件
            x = e.detail.x;
            y = e.detail.y;
          } else {
            // 触摸事件
            const touch = (e.touches && e.touches[0]) || (e.changedTouches && e.changedTouches[0]);
            if (touch) {
              x = touch.pageX || touch.clientX;
              y = touch.pageY || touch.clientY;
            }
          }

          // data.left/top 是地图相对于视口的当前位置（包含滚动和缩放后的偏移）
          // data.width/height 是地图当前的实际渲染尺寸
          const clickX = x - data.left - (this.mapPadding * this.curScale);
          const clickY = y - data.top - (this.mapPadding * this.curScale);

          // 计算相对于地图完整内容的百分比
          const relativeLeft = Math.round((clickX / (this.mapWidth * this.curScale)) * 100);
          const relativeTop = Math.round((clickY / (this.mapHeight * this.curScale)) * 100);

          if (!isNaN(relativeLeft) && !isNaN(relativeTop)) {
            console.log(`🗺️ 修正后的地图点击坐标: left=${relativeLeft}%, top=${relativeTop}%`);
            
            // 计算点击位置对应的经纬度 (逆向投影)
            this.printLngLatFromRelative(relativeLeft, relativeTop);
          } else {
            console.log('🗺️ 坐标计算失败:', { x, y, data });
          }
        } else {
          console.log('🗺️ 未找到地图容器元素');
        }
      }).exec();
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
    },
    startLocationTracking() {
      console.log('📍 开启位置追踪...');
      // 1. 先尝试获取一次位置
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          this.updateUserPosition(res.longitude, res.latitude);
        },
        fail: (err) => {
          console.error('❌ 获取位置失败:', err);
          // 提示用户开启权限
          if (err.errMsg.includes('auth deny')) {
            uni.showModal({
              title: '提示',
              content: '请开启位置权限，以便在手绘地图上定位你的位置',
              success: (res) => {
                if (res.confirm) uni.openSetting();
              }
            });
          }
        }
      });

      // 2. 开启持续监听 (仅在小程序环境有效)
      // #ifdef MP-WEIXIN
      uni.startLocationUpdate({
        success: () => {
          uni.onLocationChange((res) => {
            this.updateUserPosition(res.longitude, res.latitude);
          });
        },
        fail: (err) => {
          console.warn('⚠️ 持续定位开启失败:', err);
        }
      });
      // #endif
    },
    updateUserPosition(lng, lat) {
      const result = projectCoordinates(lng, lat);
      this.userLocation = {
        top: result.top,
        left: result.left
      };
      this.outOfBounds = !result.inBounds;
      
      if (this.outOfBounds) {
        console.log('🚫 用户当前在蛇口区域外');
      } else {
        console.log('📍 用户位置更新:', this.userLocation);
      }
    },
    // 逆向投影：根据地图百分比坐标估算经纬度 (用于调试)
    printLngLatFromRelative(left, top) {
      // 获取参考点
      const points = [
        { lng: 113.918, lat: 22.505, left: 40, top: 6 },   // 花园城
        { lng: 113.912, lat: 22.486, left: 27, top: 55 },  // 明华轮
        { lng: 113.923, lat: 22.493, left: 44, top: 24 }   // 四海公园
      ];
      
      // 简单的线性插值估算 (仅用于开发调试参考)
      // 计算经度：基于花园城(40%)和明华轮(27%)的横向跨度
      const dLeft = 40 - 27;
      const dLng = 113.918 - 113.912;
      const estimatedLng = 113.912 + (left - 27) * (dLng / dLeft);
      
      // 计算纬度：基于花园城(6%)和明华轮(55%)的纵向跨度
      const dTop = 55 - 6;
      const dLat = 22.486 - 22.505;
      const estimatedLat = 22.505 + (top - 6) * (dLat / dTop);
      
      console.log(`🌐 估算经纬度 (GCJ-02): 经度=${estimatedLng.toFixed(6)}, 纬度=${estimatedLat.toFixed(6)}`);
      console.log(`💡 你可以在传感器面板输入这两个值来模拟点击位置`);
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  background-color: #FFCB32;
  overflow: hidden;
}

.map-area {
  width: 100%;
  height: 100%;
  background-color: #FFCB32; 
}

.map-view {
  .map-inner-container {
    position: relative;
    background-color: transparent;
  }
  
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
    transition: transform 0.3s ease;
    
    &.with-banner {
      transform: translateY(60rpx);
    }

    .search-box {
      background: #fff; 
      height: 96rpx; 
      // 不规则圆角：给四个角不同的弧度，打破 AI 的那种完美对称感
      border-radius: 40rpx 60rpx 45rpx 55rpx;
      display: flex; 
      align-items: center; 
      padding: 0 40rpx;
      // 增加深色硬核边框，呼应地图的插画勾边风格
      border: 5rpx solid #222;
      // 更有“插画感”的偏置阴影，而不是模糊的渐变阴影
      box-shadow: 10rpx 10rpx 0rpx rgba(0,0,0,0.1);
      
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
      }
      .clear-icon { padding: 10rpx; font-size: 30rpx; color: #666; font-weight: bold; }
    }

    .search-results {
      margin-top: 15rpx;
      background: #fff;
      border: 4rpx solid #222;
      border-radius: 35rpx 50rpx 40rpx 45rpx;
      max-height: 400rpx;
      box-shadow: 12rpx 12rpx 0rpx rgba(0,0,0,0.1);
      overflow: hidden;
      
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
  
  .side-controls {
    position: absolute; top: 260rpx; right: 30rpx;
    display: flex; flex-direction: column; gap: 45rpx;
    pointer-events: auto;
    .control-item {
      display: flex; flex-direction: column; align-items: center; gap: 12rpx;
      .icon-wrapper {
        position: relative; width: 110rpx; height: 110rpx;
        display: flex; align-items: center; justify-content: center;
        &.small { width: 85rpx; height: 85rpx; }
        .ellipse-bg { position: absolute; width: 100%; height: 100%; top: 0; left: 0; filter: drop-shadow(4rpx 8rpx 0rpx rgba(0,0,0,0.1)); }
        .inner-icon { position: relative; z-index: 1; width: 48rpx; height: 48rpx; }
        .zoom-text { 
          position: relative; 
          z-index: 1; 
          font-size: 44rpx; 
          font-weight: 900; 
          color: #222; 
        }
        &:active { transform: scale(0.9) rotate(5deg); transition: transform 0.2s; }
      }
      .control-label {
        font-size: 24rpx; 
        color: #222; 
        font-weight: 900;
        background: #fff; 
        border: 4rpx solid #222;
        padding: 6rpx 20rpx; 
        border-radius: 15rpx 25rpx 18rpx 22rpx;
        box-shadow: 6rpx 6rpx 0rpx rgba(0,0,0,0.1);
      }
    }
  }
}

.out-of-bounds-banner {
  position: absolute;
  top: calc(var(--status-bar-height) + 10rpx);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 75, 75, 0.95);
  padding: 12rpx 30rpx;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  gap: 12rpx;
  z-index: 100;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.15);
  border: 4rpx solid #fff;
  pointer-events: auto;
  animation: slideInDown 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
  
  .warning-icon { font-size: 28rpx; }
  .warning-text { 
    font-size: 24rpx; 
    color: #fff; 
    font-weight: 900;
    white-space: nowrap;
  }
}

@keyframes slideInDown {
  from { transform: translate(-50%, -100%); opacity: 0; }
  to { transform: translate(-50%, 0); opacity: 1; }
}

.user-marker {
  position: absolute;
  width: 64rpx;
  height: 64rpx;
  z-index: 10;
  transform: translate(-50%, -50%);
  pointer-events: none;
  
  .user-avatar {
    width: 100%;
    height: 100%;
    // 移除多余的白色背景和边框，直接显示头像本身
    // 头像本身通常已经自带了圆圈背景
    filter: drop-shadow(0 4rpx 10rpx rgba(0,0,0,0.3));
  }
}

.poi-preview-card {
  position: absolute;
  bottom: calc(160rpx + env(safe-area-inset-bottom));
  left: 30rpx; right: 30rpx; z-index: 100;
  animation: slideUp 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  .card-content {
    background: #fff; 
    border-radius: 40rpx 50rpx 35rpx 45rpx; // 同样使用不规则圆角
    padding: 24rpx;
    display: flex; 
    align-items: center; 
    border: 5rpx solid #222; // 增加边框
    box-shadow: 15rpx 15rpx 0rpx rgba(0,0,0,0.1); // 增加厚重感的偏置阴影
    
    .poi-avatar { 
      width: 130rpx; 
      height: 130rpx; 
      border-radius: 30rpx; 
      flex-shrink: 0; 
      border: 4rpx solid #222;
    }
    .poi-text { 
      flex: 1; 
      margin: 0 24rpx; 
      overflow: hidden;
      .poi-name { 
        font-size: 36rpx; 
        font-weight: 900; 
        color: #222; 
        display: block; 
        margin-bottom: 6rpx; 
      }
      .poi-desc { 
        font-size: 24rpx; 
        color: #666; 
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
    top: 20rpx;
    right: 20rpx;
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
    margin-top: -120rpx; // 向上移动，叠在卡片内容上，更靠近详情图片
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
