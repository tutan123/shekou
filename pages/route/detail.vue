<template>
  <view class="container" :class="{ 'western-theme': routeId === 'xican' }">
    <!-- 顶部导航 -->
    <view class="custom-nav">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">{{ routeName }}</text>
    </view>

    <!-- 路线地图区域 -->
    <view class="map-container" :class="{ 'full-map': routeId === 'xican' }">
      <!-- 动态加载对应线路的地图 -->
      <image class="route-map" :src="mapSrc" mode="widthFix"></image>
      
      <!-- 西餐路线交互区域 -->
      <block v-if="routeId === 'xican'">
        <view v-for="(item, index) in westernPois" :key="index" 
              class="poi-clickable-area" 
              :style="{ top: item.top + '%', left: item.left + '%', width: item.width + 'rpx', height: item.height + 'rpx' }"
              @click="showDetail(item)">
        </view>
      </block>
      
      <!-- 其他路线打卡点模拟 (后续可以根据数据循环渲染) -->
      <block v-else>
        <view class="poi-marker" style="top: 30%; left: 40%;"></view>
        <view class="poi-marker" style="top: 50%; left: 60%;"></view>
      </block>
    </view>

    <!-- 底部详情卡片 (非西餐路线显示) -->
    <view v-if="routeId !== 'xican'" class="detail-card animate-slide-up">
      <view class="card-header">
        <view class="route-info">
          <text class="label">当前路线</text>
          <text class="name">{{ routeName }}</text>
        </view>
        <view class="progress-box">
          <text class="progress-text">已完成 0/10</text>
        </view>
      </view>
      
      <scroll-view scroll-y class="poi-list">
        <view class="poi-item" v-for="i in 3" :key="i">
          <view class="poi-img-box"></view>
          <view class="poi-info">
            <text class="poi-name">站点 {{ i }}</text>
            <text class="poi-desc">站点描述内容展示在此处...</text>
          </view>
          <view class="check-btn">去打卡</view>
        </view>
      </scroll-view>
    </view>

    <!-- 详情弹窗 -->
    <view v-if="detailVisible" class="detail-popup-mask" @click="hideDetail">
      <view class="detail-popup-content" @click.stop>
        <image class="detail-image" :src="currentPoi.detailImg" mode="widthFix"></image>
        <view class="check-in-btn-container" @click="handleCheckIn">
          <image class="btn-bg" src="/static/route/western/checkin_btn.png" mode="scaleToFill"></image>
          <text class="btn-text">去打卡</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      routeId: '',
      routeName: '',
      mapSrc: '',
      detailVisible: false,
      currentPoi: {},
      // 西餐路线坐标点映射 (百分比定位)
      westernPois: [
        { id: '00', name: 'Benji Bakery', top: 40, left: 8, width: 140, height: 140, detailImg: '/static/route/western/00_benji_detail.png' },
        { id: '01', name: 'Birol Bistronomy', top: 85, left: 52, width: 220, height: 100, detailImg: '/static/route/western/01_birol_detail.png' },
        { id: '02', name: 'Minimal', top: 82, left: 16, width: 140, height: 120, detailImg: '/static/route/western/02_minimal_detail.png' },
        { id: '03', name: 'Alla Torre', top: 52, left: 8, width: 140, height: 140, detailImg: '/static/route/western/03_alla_detail.png' },
        { id: '04', name: 'Doors', top: 48, left: 65, width: 140, height: 140, detailImg: '/static/route/western/04_doors_detail.png' },
        { id: '05', name: 'Madloba', top: 68, left: 8, width: 140, height: 140, detailImg: '/static/route/western/05_madloba_detail.png' },
        { id: '06', name: 'Commune', top: 78, left: 68, width: 200, height: 160, detailImg: '/static/route/western/06_commune_detail.png' },
        { id: '07', name: 'Gecko Pub', top: 52, left: 35, width: 180, height: 180, detailImg: '/static/route/western/07_gecko_detail.png' },
        { id: '08', name: 'Baker & Spice', top: 62, left: 70, width: 200, height: 120, detailImg: '/static/route/western/08_baker_detail.png' },
        { id: '09', name: 'The Flames', top: 70, left: 45, width: 180, height: 160, detailImg: '/static/route/western/09_flames_detail.png' }
      ]
    }
  },
  onLoad(options) {
    this.routeId = options.id || 'laojie';
    this.routeName = options.name || '老街路线';
    this.setMapSrc();
  },
  methods: {
    setMapSrc() {
      const mapMap = {
        'kafei': '/static/images/kafei_map.png',
        'binhai': '/static/images/binhai_map.png',
        'dengshan': '/static/images/dengshan_map.png',
        'laojie': '/static/images/laojie_map.png',
        'xican': '/static/route/western/西餐路线小地图.png'
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
      uni.showToast({
        title: '打卡成功！',
        icon: 'success'
      });
      // 这里可以添加实际的打卡逻辑，比如增加积分或改变状态
      this.detailVisible = false;
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
  position: relative;
  overflow: hidden;
  
  &.full-map {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #004b91;
  }
  
  .route-map {
    width: 100%;
    height: auto;
  }
  
  .poi-marker {
    position: absolute;
    width: 30rpx;
    height: 30rpx;
    background: #FFCC00;
    border: 6rpx solid #fff;
    border-radius: 50%;
    box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.2);
  }

  .poi-clickable-area {
    position: absolute;
    // background: rgba(255, 255, 255, 0.1); // 调试时取消注释可见点击区域
    z-index: 10;
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
