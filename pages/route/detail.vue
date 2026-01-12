<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="custom-nav">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">{{ routeName }}</text>
    </view>

    <!-- 路线地图区域 -->
    <view class="map-container">
      <!-- 动态加载对应线路的地图 -->
      <image class="route-map" :src="mapSrc" mode="widthFix"></image>
      
      <!-- 打卡点模拟 (后续可以根据数据循环渲染) -->
      <view class="poi-marker" style="top: 30%; left: 40%;"></view>
      <view class="poi-marker" style="top: 50%; left: 60%;"></view>
    </view>

    <!-- 底部详情卡片 -->
    <view class="detail-card animate-slide-up">
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
  </view>
</template>

<script>
export default {
  data() {
    return {
      routeId: '',
      routeName: '',
      mapSrc: ''
    }
  },
  onLoad(options) {
    this.routeId = options.id || 'laojie';
    this.routeName = options.name || '老街路线';
    this.setMapSrc();
  },
  methods: {
    setMapSrc() {
      // 根据 ID 设置对应的地图图片路径
      const mapMap = {
        'kafei': '/static/images/kafei_map.png',
        'binhai': '/static/images/binhai_map.png',
        'dengshan': '/static/images/dengshan_map.png',
        'laojie': '/static/images/laojie_map.png',
        'xican': '/static/images/xican_map.png'
      };
      this.mapSrc = mapMap[this.routeId] || mapMap['laojie'];
    },
    goBack() {
      uni.navigateBack();
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
}

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  
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

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}
</style>
