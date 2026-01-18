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
        :style="{ width: mapWidth + 'px', height: mapHeight + 'px' }"
        @scale="onScale"
        @change="onChange"
      >
        <!-- 动态加载对应线路的地图 -->
        <image class="route-map" :src="mapSrc" mode="aspectFill" @load="onMapLoad" :style="{ width: mapWidth + 'px', height: mapHeight + 'px' }"></image>
        
        <!-- 所有路线的交互响应区域 (透明热区) -->
        <view v-for="(item, index) in currentRoutePois" :key="index" 
              class="poi-hotspot" 
              :class="{ 'debug-visible': debugMode }"
              :data-name="item.name"
              :style="{ top: item.top + '%', left: item.left + '%', width: (item.hotWidth || 120) + 'rpx', height: (item.hotHeight || 120) + 'rpx' }"
              @click="showDetail(item)">
          <!-- 不再渲染图片和标题，直接作为点击热区 -->
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
      <view class="detail-popup-content" @click.stop>
        <image class="detail-image" :src="currentPoi.detailImg" mode="widthFix"></image>
        <view class="check-in-btn-container" @click="handleCheckIn" :class="{ 'checked-in': isCheckedIn(currentPoi.name) }">
          <image class="btn-bg" :src="assets.route.checkinBtn" mode="scaleToFill"></image>
          <text class="btn-text">{{ isCheckedIn(currentPoi.name) ? '已打卡' : '去打卡' }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { ASSETS_CONFIG } from '@/utils/assets-config.js'

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
      mapWidth: 0,
      mapHeight: 0,
      windowWidth: 0,
      windowHeight: 0,
      mapLoaded: false,
      checkInData: { history: [], binhai: [], dengshan: [], coffee: [], western: [] },
      // 老街路线
      laojiePois: [],
      // 登山路线
      dengshanPois: [],
      // 滨海路线
      binhaiPois: [],
      // 西餐路线坐标点映射 (百分比定位)
      westernPois: [],
      // 咖啡路线
      kafeiPois: []
    }
  },
  created() {
    // 在组件创建时初始化所有 POI 数据
    const baseUrl = this.assets.CLOUD_BASE_URL + 'route/';
    
    // 助手函数：生成完整路径
    const getPaths = (route, fileName, options = { hasPic: true, hasTitle: true, hasDetail: true }) => {
      const paths = {};
      if (options.hasDetail) paths.detailImg = `${baseUrl}${route}/${fileName}_detail.png`;
      if (options.hasPic) paths.pic = `${baseUrl}${route}/${fileName}_pic.png`;
      if (options.hasTitle) paths.titleImg = `${baseUrl}${route}/${fileName}_title.png`;
      
      // 特殊处理：老街 09 的图片名有个 typo
      if (route === 'laojie' && fileName === '09_nanhaiyiku' && options.hasPic) {
        paths.pic = `${baseUrl}laojie/09_nanhaiyiku_piv.png`;
      }
      return paths;
    };

    // 设置各路线配置
    const hasNoTitle = { hasPic: true, hasTitle: false, hasDetail: true };

    this.laojiePois = [
      { id: '01', name: '空谈误国', top: 30, left: 70, hotWidth: 180, hotHeight: 120, ...getPaths('laojie', '01_biaoyupai') },
      { id: '02', name: '南玻集团', top: 34, left: 58, hotWidth: 150, hotHeight: 120, ...getPaths('laojie', '02_nanbo') },
      { id: '03', name: '育才一小', top: 38, left: 72, hotWidth: 150, hotHeight: 120, ...getPaths('laojie', '03_yucai') },
      { id: '04', name: 'G&G', top: 44, left: 40, hotWidth: 200, hotHeight: 150, ...getPaths('laojie', '04_gg') },
      { id: '05', name: '水湾源华', top: 47, left: 65, hotWidth: 180, hotHeight: 100, ...getPaths('laojie', '05_shuiwanyuanhua') },
      { id: '06', name: '水湾村史馆', top: 52, left: 63, hotWidth: 150, hotHeight: 100, ...getPaths('laojie', '06_shuiwancunshiguan') },
      { id: '07', name: '水湾炮楼', top: 59, left: 46, hotWidth: 120, hotHeight: 150, ...getPaths('laojie', '07_shuiwanpaolou') },
      { id: '08', name: '荔枝公园', top: 60, left: 22, hotWidth: 200, hotHeight: 180, ...getPaths('laojie', '08_lizhigongyuan') },
      { id: '09', name: '南海意库', top: 70, left: 45, hotWidth: 200, hotHeight: 150, ...getPaths('laojie', '09_nanhaiyiku') },
      { id: '10', name: '海滨花园', top: 78, left: 55, hotWidth: 180, hotHeight: 120, ...getPaths('laojie', '10_haibinhuayuan') }
    ];

    this.dengshanPois = [
      { id: '17', name: '时间标语', top: 28, left: 40, hotWidth: 220, hotHeight: 180, ...getPaths('dengshan', '17_shijianbiaoyu') },
      { id: '18', name: '微波山', top: 43, left: 52, hotWidth: 180, hotHeight: 150, ...getPaths('dengshan', '18_weiboshan') },
      { id: '19', name: '招商局历史博物馆', top: 58, left: 55, hotWidth: 220, hotHeight: 180, ...getPaths('dengshan', '19_zhaoshangjulishi') }
    ];

    this.binhaiPois = [
      { id: '11', name: '明华轮', top: 48, left: 40, hotWidth: 220, hotHeight: 150, ...getPaths('binhai', '11_minghualun') },
      { id: '12', name: '女娲像', top: 48, left: 65, hotWidth: 150, hotHeight: 180, ...getPaths('binhai', '12_nvwaxiang') },
      { id: '13', name: '海上世界', top: 60, left: 60, hotWidth: 250, hotHeight: 150, ...getPaths('binhai', '13_haishangshijie') },
      { id: '14', name: '原耕', top: 62, left: 75, hotWidth: 120, hotHeight: 100, ...getPaths('binhai', '14_yuangeng', { hasPic: false, hasTitle: true, hasDetail: false }) },
      { id: '15', name: '南海酒店', top: 65, left: 38, hotWidth: 200, hotHeight: 150, ...getPaths('binhai', '15_nanhaijiudian') },
      { id: '16', name: '碧涛苑', top: 55, left: 25, hotWidth: 180, hotHeight: 120, ...getPaths('binhai', '16_bitaoyuan') }
    ];

    this.westernPois = [
      { id: '00', name: 'Benji Bakery', top: 42, left: 15, hotWidth: 150, hotHeight: 120, ...getPaths('western', '00_benji') },
      { id: '01', name: 'Birol Bistronomy', top: 80, left: 55, hotWidth: 180, hotHeight: 120, ...getPaths('western', '01_birol') },
      { id: '02', name: 'minimal', top: 72, left: 35, hotWidth: 150, hotHeight: 100, ...getPaths('western', '02_minimal') },
      { id: '03', name: 'alla', top: 55, left: 25, hotWidth: 150, hotHeight: 120, ...getPaths('western', '03_alla') },
      { id: '04', name: 'doors', top: 52, left: 75, hotWidth: 150, hotHeight: 120, ...getPaths('western', '04_doors') },
      { id: '05', name: 'madloba', top: 65, left: 22, hotWidth: 150, hotHeight: 120, ...getPaths('western', '05_madloba') },
      { id: '06', name: 'commune', top: 72, left: 80, hotWidth: 150, hotHeight: 120, ...getPaths('western', '06_commune') },
      { id: '07', name: 'Gecko Pub', top: 52, left: 45, hotWidth: 150, hotHeight: 120, ...getPaths('western', '07_gecko') },
      { id: '08', name: 'baker', top: 60, left: 78, hotWidth: 150, hotHeight: 120, ...getPaths('western', '08_baker') },
      { id: '09', name: 'the_flames', top: 68, left: 60, hotWidth: 150, hotHeight: 120, ...getPaths('western', '09_flames') }
    ];

    this.kafeiPois = [
      { id: '01', name: '正在生活', top: 25, left: 28, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '01_zhengzaishenghuo', hasNoTitle) },
      { id: '02', name: '绿木', top: 38, left: 62, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '02_greenwood', hasNoTitle) },
      { id: '03', name: 'JOJO', top: 48, left: 42, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '03_jojo', hasNoTitle) },
      { id: '04', name: '查理', top: 58, left: 28, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '04_chali', hasNoTitle) },
      { id: '05', name: 'NewPark C', top: 68, left: 52, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '05_newparkcoffee', hasNoTitle) },
      { id: '06', name: 'NewPark', top: 78, left: 32, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '06_newpark', hasNoTitle) },
      { id: '07', name: 'Wavve', top: 85, left: 62, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '07_wavve', hasNoTitle) },
      { id: '08', name: '山池', top: 18, left: 48, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '08_shanchi', hasNoTitle) },
      { id: '09', name: 'KUDDO', top: 28, left: 72, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '09_kuddo', hasNoTitle) },
      { id: '10', name: '艾米丽', top: 35, left: 15, hotWidth: 150, hotHeight: 120, ...getPaths('coffee', '10_emily', hasNoTitle) }
    ];
  },
  computed: {
    currentRoutePois() {
      const poiMap = {
        'laojie': this.laojiePois,
        'dengshan': this.dengshanPois,
        'binhai': this.binhaiPois,
        'xican': this.westernPois,
        'kafei': this.kafeiPois
      };
      return poiMap[this.routeId] || [];
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
      
      let targetScale = 1.5;
      let focusX = 50; 
      let focusY = 50;
      
      if (this.routeId === 'dengshan') {
        targetScale = 1.8;
        focusX = 50;
        focusY = 40; 
      } else if (this.routeId === 'laojie') {
        targetScale = 1.6;
        focusX = 50;
        focusY = 45;
      } else if (this.routeId === 'binhai') {
        targetScale = 1.8;
        focusX = 50;
        focusY = 55;
      } else if (this.routeId === 'xican') {
        targetScale = 1.5;
        focusX = 50;
        focusY = 60;
      } else if (this.routeId === 'kafei') {
        targetScale = 1.6;
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
        
        this.mapX = targetX + 0.01;
        this.mapY = targetY + 0.01;
        
        this.$nextTick(() => {
          this.mapX = targetX;
          this.mapY = targetY;
        });
      });
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
      // 强制触发更新
      this.scaleValue = targetScale + 0.0001;
      this.$nextTick(() => {
        this.scaleValue = targetScale;
        this.curScale = targetScale;
      });
    },
    onScale(e) {
      this.curScale = e.detail.scale;
    },
    onChange(e) {
      if (e.detail.source !== '') {
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
  background-color: #FFF9E6;
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
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
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
    box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.3);
    display: block;
  }
  
  .check-in-btn-container {
    width: 320rpx;
    height: 96rpx;
    position: absolute;
    bottom: -48rpx; // 居中压在详情卡片底部边缘
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    .btn-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
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
      transform: translateX(-50%) scale(0.95);
    }
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}
</style>
