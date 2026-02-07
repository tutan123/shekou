<template>
  <view class="container" :class="{ 'western-theme': routeId === 'xican' }">
    <!-- 顶部导航 -->
    <view class="custom-nav">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">{{ routeName }}</text>
    </view>

    <!-- 路线地图区域 -->
    <movable-area class="map-container full-map" @mousewheel.stop.prevent="onMouseWheel">
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
        :style="{ width: mapWidth + 'px', height: mapHeight + 'px' }"
        @scale="onScale"
        @change="onChange"
      >
        <!-- 动态加载对应线路的地图 -->
        <image class="route-map" :src="mapSrc" mode="aspectFill" @load="onMapLoad" :style="{ width: mapWidth + 'px', height: mapHeight + 'px' }"></image>
        
        <!-- 所有路线的交互响应区域 (多边形热区) -->
        <view v-for="(item, index) in currentRoutePois" :key="index" 
              class="poi-hotspot" 
              :class="{ 'debug-visible': debugMode }"
              :data-name="item.name"
              :style="{ 
                top: item.top + '%', 
                left: item.left + '%', 
                width: (item.hotWidth || 150) + 'rpx', 
                height: (item.hotHeight || 150) + 'rpx',
                'clip-path': item.polygon ? 'polygon(' + item.polygon + ')' : 'none',
                '-webkit-clip-path': item.polygon ? 'polygon(' + item.polygon + ')' : 'none'
              }"
              @click="showDetail(item)">
        </view>
      </movable-view>
    </movable-area>

    <!-- 浮动控制按钮 -->
    <view class="floating-ui">
      <!-- 右侧功能键 -->
      <view class="side-controls">
        <view class="control-item" @click="focusRouteArea">
          <view class="icon-wrapper">
            <image class="ellipse-bg" :src="assets.index.ellipse" mode="aspectFit"></image>
            <image class="inner-icon" :src="assets.index.locationBtn" mode="aspectFit"></image>
          </view>
          <text class="control-label">重置视角</text>
        </view>
        
        <view class="control-item" @click="zoomIn">
          <view class="icon-wrapper small">
            <image class="ellipse-bg" :src="assets.index.ellipse" mode="aspectFit"></image>
            <text class="zoom-text">+</text>
          </view>
        </view>
        <view class="control-item" @click="zoomOut">
          <view class="icon-wrapper small">
            <image class="ellipse-bg" :src="assets.index.ellipse" mode="aspectFit"></image>
            <text class="zoom-text">-</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 详情弹窗 -->
    <view v-if="detailVisible" class="detail-popup-mask" @click="hideDetail">
      <view class="detail-popup-content">
        <image class="detail-image" :src="currentPoi.detailImg" mode="widthFix"></image>
        <view class="check-in-btn-container" @click.stop="handleCheckIn" :class="{ 'checked-in': isCheckedIn(currentPoi.name) }">
          <image class="btn-bg" :src="assets.route.checkinBtn" mode="scaleToFill"></image>
          <text class="btn-text">{{ isCheckedIn(currentPoi.name) ? '已打卡' : '去打卡' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ASSETS_CONFIG } from '@/utils/assets-config.js'
import { CATEGORIES } from '@/utils/poi-config.js'
import { getDistance } from '@/utils/map-projection.js'

// 所有路线的坐标和多边形配置 (放在组件外避免初始化顺序问题)
const ROUTE_COORDS = {
  'laojie': [
    { id: '01', name: '"空谈误国,实干兴邦"标语牌', top: 30, left: 70, hotWidth: 320, hotHeight: 260, polygon: '0% 15%, 100% 0%, 100% 85%, 0% 100%' },
    { id: '02', name: '南玻集团', top: 34, left: 58, hotWidth: 280, hotHeight: 300, polygon: '20% 0%, 80% 0%, 100% 100%, 0% 100%' },
    { id: '03', name: '育才中学', top: 38, left: 72, hotWidth: 300, hotHeight: 240, polygon: '0% 20%, 100% 0%, 100% 80%, 0% 100%' },
    { id: '04', name: 'G&G创意社区', top: 44, left: 40, hotWidth: 340, hotHeight: 280, polygon: '10% 0%, 90% 10%, 100% 90%, 0% 100%' },
    { id: '05', name: '水湾源华实业股份有限公司', top: 47, left: 65, hotWidth: 260, hotHeight: 220, polygon: '0% 0%, 100% 20%, 100% 100%, 0% 80%' },
    { id: '06', name: '1979水湾村史馆', top: 52, left: 63, hotWidth: 240, hotHeight: 200, polygon: '10% 0%, 90% 0%, 100% 100%, 0% 100%' },
    { id: '07', name: '水湾炮楼', top: 59, left: 46, hotWidth: 240, hotHeight: 280, polygon: '20% 0%, 80% 0%, 100% 100%, 0% 100%' },
    { id: '08', name: '荔枝公园', top: 60, left: 22, hotWidth: 340, hotHeight: 320, polygon: '0% 30%, 100% 0%, 100% 70%, 0% 100%' },
    { id: '09', name: '南海意库', top: 70, left: 45, hotWidth: 320, hotHeight: 280, polygon: '0% 0%, 100% 0%, 90% 100%, 10% 100%' },
    { id: '10', name: '海滨花园', top: 78, left: 55, hotWidth: 300, hotHeight: 260, polygon: '0% 20%, 100% 0%, 100% 80%, 0% 100%' }
  ],
  'dengshan': [
    { id: '17', name: '"时间就是金钱,效率就是生命"标语牌', top: 28, left: 40, hotWidth: 360, hotHeight: 320, polygon: '15% 0%, 85% 10%, 100% 85%, 0% 100%' },
    { id: '18', name: '微波山', top: 43, left: 52, hotWidth: 320, hotHeight: 280, polygon: '30% 0%, 70% 0%, 100% 100%, 0% 100%' },
    { id: '19', name: '招商局历史博物馆', top: 58, left: 55, hotWidth: 380, hotHeight: 320, polygon: '0% 20%, 100% 0%, 100% 80%, 0% 100%' }
  ],
  'binhai': [
    { id: '11', name: '海上世界明华轮', top: 48, left: 40, hotWidth: 380, hotHeight: 280, polygon: '0% 40%, 100% 0%, 90% 100%, 10% 90%' },
    { id: '12', name: '女娲补天雕像', top: 48, left: 65, hotWidth: 280, hotHeight: 340, polygon: '20% 0%, 80% 0%, 100% 100%, 0% 100%' },
    { id: '13', name: '海上世界文化艺术中心', top: 60, left: 60, hotWidth: 400, hotHeight: 300, polygon: '0% 0%, 100% 30%, 100% 100%, 0% 70%' },
    { id: '14', name: '袁庚铜像', top: 62, left: 75, hotWidth: 220, hotHeight: 200, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
    { id: '15', name: '南海酒店', top: 65, left: 38, hotWidth: 340, hotHeight: 280, polygon: '10% 0%, 90% 0%, 100% 100%, 0% 100%' },
    { id: '16', name: '碧涛苑别墅群', top: 55, left: 25, hotWidth: 300, hotHeight: 260, polygon: '0% 0%, 100% 20%, 100% 100%, 0% 80%' }
  ],
  'xican': [
    { id: '00', name: 'Benji Bakery', top: 43, left: 15, hotWidth: 280, hotHeight: 240, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
    { id: '01', name: 'Birol Bistronomy', top: 76, left: 55, hotWidth: 320, hotHeight: 280, polygon: '15% 0%, 85% 0%, 100% 100%, 0% 100%' },
    { id: '02', name: 'minimal', top: 68, left: 35, hotWidth: 280, hotHeight: 240, polygon: '0% 25%, 100% 0%, 100% 75%, 0% 100%' },
    { id: '03', name: 'alla', top: 56, left: 26, hotWidth: 280, hotHeight: 240, polygon: '0% 10%, 100% 0%, 100% 90%, 0% 100%' },
    { id: '04', name: 'doors', top: 52, left: 76, hotWidth: 280, hotHeight: 240, polygon: '0% 0%, 90% 10%, 100% 100%, 10% 90%' },
    { id: '05', name: 'madloba', top: 66, left: 22, hotWidth: 280, hotHeight: 240, polygon: '0% 0%, 100% 15%, 100% 100%, 0% 85%' },
    { id: '06', name: 'commune', top: 72, left: 78, hotWidth: 320, hotHeight: 240, polygon: '10% 0%, 100% 10%, 90% 100%, 0% 90%' },
    { id: '07', name: 'Gecko Pub', top: 58, left: 46, hotWidth: 340, hotHeight: 360, polygon: '20% 0%, 80% 0%, 100% 50%, 100% 100%, 0% 100%, 0% 50%' },
    { id: '08', name: 'baker', top: 60, left: 80, hotWidth: 280, hotHeight: 240, polygon: '0% 0%, 100% 0%, 100% 100%, 0% 100%' },
    { id: '09', name: 'the_flames', top: 68, left: 62, hotWidth: 280, hotHeight: 240, polygon: '0% 20%, 100% 0%, 100% 80%, 0% 100%' }
  ],
  'kafei': [
    { id: '01', name: 'KUDDO', top: 15.5, left: 45.5, hotWidth: 380, hotHeight: 380, polygon: '10% 0%, 90% 5%, 95% 85%, 50% 100%, 5% 85%' },
    { id: '02', name: '绿木', top: 25.5, left: 38.5, hotWidth: 320, hotHeight: 220, polygon: '0% 20%, 60% 10%, 100% 30%, 100% 90%, 40% 100%, 0% 80%' },
    { id: '03', name: 'NewPark', top: 31.5, left: 51.5, hotWidth: 320, hotHeight: 200, polygon: '0% 30%, 50% 15%, 100% 25%, 100% 95%, 40% 100%, 0% 80%' },
    { id: '04', name: '查理', top: 36.5, left: 18.5, hotWidth: 340, hotHeight: 360, polygon: '15% 0%, 85% 10%, 100% 90%, 50% 100%, 0% 85%' },
    { id: '05', name: 'Wavve', top: 41.5, left: 37.5, hotWidth: 350, hotHeight: 320, polygon: '5% 15%, 95% 0%, 100% 85%, 60% 100%, 0% 90%' },
    { id: '06', name: '365', top: 37.5, left: 51.5, hotWidth: 280, hotHeight: 180, polygon: '0% 40%, 60% 20%, 100% 40%, 100% 90%, 50% 100%, 0% 80%' },
    { id: '07', name: '艾米丽', top: 43.5, left: 50.5, hotWidth: 300, hotHeight: 300, polygon: '10% 0%, 90% 10%, 100% 90%, 50% 100%, 0% 85%' },
    { id: '08', name: '正在生活', top: 46.5, left: 28.5, hotWidth: 340, hotHeight: 320, polygon: '5% 15%, 95% 5%, 100% 90%, 50% 100%, 0% 85%' },
    { id: '09', name: '山池', top: 73.5, left: 58.5, hotWidth: 460, hotHeight: 440, polygon: '10% 0%, 90% 5%, 100% 85%, 55% 100%, 0% 80%' },
    { id: '10', name: 'JOJO', top: 88.5, left: 46.5, hotWidth: 450, hotHeight: 420, polygon: '10% 10%, 90% 5%, 100% 90%, 50% 100%, 0% 90%' }
  ]
};

export default {
  data() {
    return {
      assets: ASSETS_CONFIG,
      routeId: '',
      routeName: '',
      mapSrc: '',
      detailVisible: false,
      currentPoi: {},
      debugMode: true, // 设置为 true 可视化点击热区
      // 交互地图相关状态
      scaleValue: 1.0,
      curScale: 1.0,
      minScale: 0.5,
      mapX: 0,
      mapY: 0,
      lastX: 0, // 记录当前实际 X 坐标，不直接同步到 mapX
      lastY: 0, // 记录当前实际 Y 坐标，不直接同步到 mapY
      mapWidth: 0,
      mapHeight: 0,
      windowWidth: 0,
      windowHeight: 0,
      mapLoaded: false,
      checkInData: { history: [], binhai: [], dengshan: [], coffee: [], western: [] },
      // POI 数据通过计算属性获取
    }
  },
  computed: {
    currentRoutePois() {
      // 映射配置中的 items 到数组格式供页面循环
      let catKey = '';
      const routeToCatMap = {
        'laojie': 'history',
        'dengshan': 'dengshan',
        'binhai': 'binhai',
        'xican': 'western',
        'kafei': 'coffee'
      };
      catKey = routeToCatMap[this.routeId] || 'history';
      
      const catData = CATEGORIES[catKey];
      if (!catData) return [];

      // 获取原始坐标和多边形配置
      const originalCoords = ROUTE_COORDS[this.routeId] || [];
      
      return originalCoords.map(coord => {
        // 优先通过 id 匹配，如果找不到再尝试用 name 匹配（兼容旧配置）
        const itemInfo = catData.items[coord.id] || catData.items[coord.name] || {};
        return {
          ...itemInfo,
          ...coord
        };
      });
    },
    atlasCat() {
      const routeToAtlasMap = {
        'laojie': 'history',
        'dengshan': 'dengshan',
        'binhai': 'binhai',
        'xican': 'western',
        'kafei': 'coffee'
      };
      return routeToAtlasMap[this.routeId] || 'history';
    }
  },
  onLoad(options) {
    this.routeId = options.id || 'laojie';
    this.loadCheckInData();
    
    // 获取屏幕尺寸
    const sys = uni.getSystemInfoSync();
    this.windowWidth = sys.windowWidth;
    this.windowHeight = sys.windowHeight;
    
    // 根据 ID 写死对应的路线名称，避免编码转换导致的乱码
    const nameMap = {
      'laojie': '老街路线',
      'dengshan': '登山路线',
      'binhai': '滨海路线',
      'xican': '西餐路线',
      'kafei': '咖啡路线'
    };
    this.routeName = nameMap[this.routeId] || options.name || '路线详情';
    
    this.setMapSrc();
  },
  onShow() {
    this.loadCheckInData();
  },
  methods: {
    loadCheckInData() {
      const data = uni.getStorageSync('shekou_checkin');
      if (data) {
        this.checkInData = data;
      }
    },
    isCheckedIn(name) {
      const cat = this.atlasCat;
      return (this.checkInData[cat] || []).includes(name);
    },
    onMapLoad(e) {
      console.log('✅ 路线地图加载完成');
      this.mapLoaded = true;
      const { width, height } = e.detail;
      
      // 设置地图宽度为屏幕宽度的 3 倍，以支持大范围拖拽
      this.mapWidth = this.windowWidth * 3; 
      this.mapHeight = (this.mapWidth * height) / width;
      
      // 计算最小缩放比例，确保地图至少能填满屏幕
      const minScaleW = this.windowWidth / this.mapWidth;
      const minScaleH = this.windowHeight / this.mapHeight;
      this.minScale = Math.max(minScaleW, minScaleH);
      
      // 默认聚焦到 POI 聚集区（登山路线默认聚焦左下角）
      this.focusRouteArea();
    },
    focusRouteArea() {
      if (!this.mapLoaded) return;

      let targetScale = 1.0;
      let focusX = 50;
      let focusY = 50;

      if (this.routeId === 'dengshan') {
        targetScale = 1.2;
        focusX = 50;
        focusY = 40;
      } else if (this.routeId === 'laojie') {
        targetScale = 1.1;
        focusX = 50;
        focusY = 45;
      } else if (this.routeId === 'binhai') {
        targetScale = 1.2;
        focusX = 50;
        focusY = 55;
      } else if (this.routeId === 'xican') {
        targetScale = 1.0;
        focusX = 50;
        focusY = 60;
      } else if (this.routeId === 'kafei') {
        targetScale = 1.1;
        focusX = 50;
        focusY = 40;
      }
      
      const poiX = (this.mapWidth * focusX) / 100;
      const poiY = (this.mapHeight * focusY) / 100;
      
      const targetX = (this.windowWidth / 2) - (poiX * targetScale);
      const targetY = (this.windowHeight / 2) - (poiY * targetScale);
      
      // 使用 index.vue 的强制更新逻辑
      this.scaleValue = targetScale + 0.001;
      
      this.$nextTick(() => {
        this.scaleValue = targetScale;
        this.curScale = targetScale;
        
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
    onMouseWheel(e) {
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
      
      // 同步当前位置到 mapX/mapY 避免跳动
      this.mapX = this.lastX;
      this.mapY = this.lastY;

      this.$nextTick(() => {
        // 强制触发更新
        this.scaleValue = targetScale + 0.0001;
        this.$nextTick(() => {
          this.scaleValue = targetScale;
          this.curScale = targetScale;
        });
      });
    },
    onScale(e) {
      this.curScale = e.detail.scale;
      this.lastX = e.detail.x;
      this.lastY = e.detail.y;
    },
    onChange(e) {
      this.lastX = e.detail.x;
      this.lastY = e.detail.y;
      
      if (e.detail.source === '') {
        this.mapX = e.detail.x;
        this.mapY = e.detail.y;
      }
    },
    setMapSrc() {
      const mapMap = {
        'kafei': this.assets.route.coffee.map,
        'binhai': this.assets.route.binhai.map,
        'dengshan': this.assets.route.dengshan.map,
        'laojie': this.assets.route.laojie.map,
        'xican': this.assets.route.western.map
      };
      this.mapSrc = mapMap[this.routeId] || mapMap['laojie'];
    },
    goBack() {
      uni.navigateBack();
    },
    showDetail(poi) {
      this.currentPoi = poi;
      this.detailVisible = true;
    },
    hideDetail() {
      this.detailVisible = false;
    },
    handleCheckIn() {
      const poiName = this.currentPoi.name;
      const cat = this.atlasCat;
      
      if (this.isCheckedIn(poiName)) {
        uni.showToast({
          title: '已经打过卡啦',
          icon: 'none'
        });
        return;
      }

      // --- 新增：地理围栏判断 (300米) ---
      // 获取用户当前位置 (这里假设页面已经开启了位置监听或可以实时获取)
      uni.getLocation({
        type: 'gcj02',
        success: (res) => {
          const dist = getDistance(
            res.latitude, 
            res.longitude,
            this.currentPoi.lat,
            this.currentPoi.lng
          );
          
          console.log(`📏 路线打卡距离判断: 用户距离 [${poiName}] 约 ${Math.round(dist)} 米`);
          
          if (dist > 300) {
            uni.showModal({
              title: '打卡失败',
              content: `当前您不在点位附近（约${Math.round(dist)}米），请靠近后再试。`,
              showCancel: false,
              confirmText: '我知道了'
            });
            return;
          }

          // 距离校验通过，执行打卡
          this.executeCheckIn(poiName, cat);
        },
        fail: () => {
          uni.showToast({ title: '请开启定位以进行打卡', icon: 'none' });
        }
      });
    },
    executeCheckIn(poiName, cat) {
      if (!this.checkInData[cat]) {
        this.checkInData[cat] = [];
      }
      
      this.checkInData[cat].push(poiName);
      uni.setStorageSync('shekou_checkin', this.checkInData);
      
      uni.showToast({
        title: '打卡成功！',
        icon: 'success'
      });
      
      // 延迟关闭，让用户看到成功提示
      setTimeout(() => {
        this.detailVisible = false;
      }, 1500);
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #FFCB32;
  position: relative;
  display: flex;
  flex-direction: column;
  
  &.western-theme {
    background-color: #003366; 
  }
}

.custom-nav {
  position: absolute;
  top: 80rpx;
  left: 30rpx;
  right: 30rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  z-index: 100;
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
    font-size: 32rpx;
    margin-right: 20rpx;
  }
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    text-shadow: 0 2rpx 4rpx rgba(255,255,255,0.8);
  }
  
  // 西餐主题下的标题颜色
  .western-theme & .title {
    color: #fff;
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
  }
}

.map-container {
  flex: 1;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: #004b91;
  
  .map-view {
    position: relative;
    
    .route-map {
      display: block;
    }
  }
  
  .poi-hotspot {
    position: absolute;
    z-index: 10;
    transform: translate(-50%, -50%); // 以中心点定位
    pointer-events: auto;
    
    // 默认透明，仅在 debugMode 下可见
    background-color: transparent;
    border: 2rpx solid transparent;

    &.debug-visible {
      background-color: rgba(255, 0, 0, 0.3);
      border: 2rpx solid #ff0000;
      
      &::after {
        content: attr(data-name);
        position: absolute;
        bottom: -30rpx;
        left: 50%;
        transform: translateX(-50%);
        font-size: 20rpx;
        color: #ff0000;
        white-space: nowrap;
      }
    }

    &:active {
      background-color: rgba(255, 255, 255, 0.2);
    }
  }
}

.floating-ui {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  z-index: 10;
  pointer-events: none;
  
  .side-controls {
    position: absolute; top: 200rpx; right: 30rpx;
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

.detail-card {
  height: 500rpx;
  background: #fff;
  border-radius: 60rpx 60rpx 0 0;
  padding: 40rpx;
  box-shadow: 0 -10rpx 30rpx rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40rpx;
    
    .route-info {
      display: flex;
      flex-direction: column;
      .label { font-size: 24rpx; color: #999; }
      .name { font-size: 40rpx; font-weight: bold; color: #333; }
    }
    
    .progress-text {
      font-size: 24rpx;
      color: #FF9900;
      font-weight: bold;
    }
  }
  
  .poi-list {
    flex: 1;
    .poi-item {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      
      .poi-img-box {
        width: 100rpx;
        height: 100rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
        margin-right: 20rpx;
      }
      
      .poi-info {
        flex: 1;
        .poi-name { font-size: 28rpx; font-weight: bold; display: block; }
        .poi-desc { font-size: 22rpx; color: #999; }
      }
      
      .check-btn {
        background: #FFCC00;
        font-size: 22rpx;
        padding: 10rpx 24rpx;
        border-radius: 30rpx;
        font-weight: bold;
      }
    }
  }
}

.detail-popup-mask {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.85);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
  pointer-events: auto;
}

.detail-popup-content {
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: zoomIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  .detail-image {
    width: 110%; // 放大到 110%
    height: auto;
    display: block;
    max-height: 90vh;
    object-fit: contain;
  }
  
  .check-in-btn-container {
    width: 320rpx;
    height: 96rpx;
    margin-top: -120rpx; // 叠在图片底部
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    position: relative;
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
    
    &.checked-in {
      opacity: 0.8;
      filter: grayscale(0.5);
    }
    
    &:active {
      transform: scale(0.95);
    }
  }
}

@keyframes zoomIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}
</style>
