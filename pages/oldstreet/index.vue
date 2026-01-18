<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="custom-nav">
      <view class="back-btn" @click="goBack">←</view>
      <text class="nav-title">老街线路</text>
    </view>
    
    <!-- 地图底图层 -->
    <view class="map-container">
      <image 
        class="base-map" 
        :src="assets.oldstreet.map" 
        mode="widthFix"
      ></image>
      
      <!-- 景点图标层 - 使用绝对定位叠加在地图上 -->
      <view 
        v-for="(poi, index) in poiList" 
        :key="index"
        class="poi-marker"
        :style="{
          top: poi.top + '%',
          left: poi.left + '%'
        }"
      >
        <!-- 景点图标 -->
        <view class="poi-icon-wrapper" @click="showPoiDetail(poi)">
          <image 
            class="poi-icon" 
            :src="poi.iconSrc" 
            mode="aspectFit"
          ></image>
        </view>
        
        <!-- 去打卡按钮 -->
        <view class="checkin-btn" @click="handleCheckIn(poi)">
          去打卡
        </view>
      </view>
    </view>

    <!-- 景点详情弹窗 -->
    <view class="modal-mask" v-if="selectedPoi" @click="selectedPoi = null">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-title">{{ selectedPoi.name || '景点详情' }}</text>
          <text class="modal-close" @click="selectedPoi = null">×</text>
        </view>
        <view class="modal-body">
          <image 
            class="modal-image" 
            :src="selectedPoi.iconSrc" 
            mode="aspectFit"
          ></image>
          <text class="modal-desc">{{ selectedPoi.desc || '点击下方按钮进行打卡' }}</text>
        </view>
        <view class="modal-footer">
          <view class="modal-checkin-btn" @click="handleCheckIn(selectedPoi)">
            去打卡
          </view>
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
      selectedPoi: null,
      // 景点列表 - 位置需要根据实际地图调整
      poiList: []
    }
  },
  created() {
    // 在组件创建时初始化 poiList
    this.poiList = [
      {
        name: '景点1',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本_画板 1.png',
        top: 20,
        left: 30,
        desc: '这是第一个景点的描述信息'
      },
      {
        name: '景点2',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-02.png',
        top: 35,
        left: 50,
        desc: '这是第二个景点的描述信息'
      },
      {
        name: '景点3',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-03.png',
        top: 50,
        left: 25,
        desc: '这是第三个景点的描述信息'
      },
      {
        name: '景点4',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-04.png',
        top: 60,
        left: 45,
        desc: '这是第四个景点的描述信息'
      },
      {
        name: '景点5',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-05.png',
        top: 40,
        left: 70,
        desc: '这是第五个景点的描述信息'
      },
      {
        name: '景点6',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-06.png',
        top: 55,
        left: 15,
        desc: '这是第六个景点的描述信息'
      },
      {
        name: '景点7',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-07.png',
        top: 70,
        left: 35,
        desc: '这是第七个景点的描述信息'
      },
      {
        name: '景点8',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-08.png',
        top: 25,
        left: 65,
        desc: '这是第八个景点的描述信息'
      },
      {
        name: '景点9',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-10.png',
        top: 45,
        left: 80,
        desc: '这是第九个景点的描述信息'
      },
      {
        name: '景点10',
        iconSrc: this.assets.CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-11.png',
        top: 65,
        left: 60,
        desc: '这是第十个景点的描述信息'
      }
    ];
  },
  onLoad() {
    console.log('老街线路页面加载完成');
  },
  onShow() {
    uni.hideTabBar();
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    showPoiDetail(poi) {
      this.selectedPoi = poi;
    },
    handleCheckIn(poi) {
      // 打卡逻辑暂时不实现，只显示提示
      uni.showToast({
        title: `打卡功能开发中`,
        icon: 'none',
        duration: 2000
      });
      
      // 关闭弹窗
      if (this.selectedPoi) {
        this.selectedPoi = null;
      }
      
      // TODO: 未来实现打卡逻辑，同步到图鉴点亮
      // 1. 保存打卡记录
      // 2. 更新图鉴状态
      // 3. 显示打卡成功提示
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFF9E6;
  position: relative;
}

.custom-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 88rpx;
  padding-top: env(safe-area-inset-top);
  background: rgba(255, 249, 230, 0.95);
  backdrop-filter: blur(10rpx);
  display: flex;
  align-items: center;
  padding-left: 30rpx;
  z-index: 1000;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.05);
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx;
    color: #333;
    font-weight: bold;
  }
  
  .nav-title {
    flex: 1;
    text-align: center;
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-right: 60rpx; // 平衡左侧返回按钮
  }
}

.map-container {
  position: relative;
  width: 100%;
  min-height: 100vh;
  padding-top: calc(88rpx + env(safe-area-inset-top));
  
  .base-map {
    width: 100%;
    display: block;
  }
  
  .poi-marker {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(-50%, -50%);
    z-index: 10;
    
    .poi-icon-wrapper {
      position: relative;
      width: 200rpx;
      height: auto;
      margin-bottom: 20rpx;
      
      .poi-icon {
        width: 100%;
        height: auto;
        display: block;
      }
    }
    
    .checkin-btn {
      background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
      color: #fff;
      padding: 12rpx 40rpx;
      border-radius: 50rpx;
      font-size: 24rpx;
      font-weight: bold;
      box-shadow: 0 8rpx 20rpx rgba(255, 107, 107, 0.4);
      white-space: nowrap;
      transition: all 0.3s;
      
      &:active {
        transform: scale(0.95);
        box-shadow: 0 4rpx 10rpx rgba(255, 107, 107, 0.3);
      }
    }
  }
}

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease-out;
}

.modal-content {
  width: 85%;
  max-width: 600rpx;
  background: #fff;
  border-radius: 40rpx;
  overflow: hidden;
  animation: slideUp 0.3s ease-out;
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 40rpx;
    border-bottom: 1rpx solid #f0f0f0;
    
    .modal-title {
      font-size: 36rpx;
      font-weight: bold;
      color: #333;
    }
    
    .modal-close {
      font-size: 50rpx;
      color: #999;
      line-height: 1;
      width: 60rpx;
      height: 60rpx;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .modal-body {
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    
    .modal-image {
      width: 100%;
      max-height: 400rpx;
      margin-bottom: 30rpx;
      border-radius: 20rpx;
    }
    
    .modal-desc {
      font-size: 28rpx;
      color: #666;
      line-height: 1.6;
      text-align: center;
    }
  }
  
  .modal-footer {
    padding: 0 40rpx 40rpx;
    
    .modal-checkin-btn {
      width: 100%;
      background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
      color: #fff;
      padding: 28rpx;
      border-radius: 50rpx;
      font-size: 32rpx;
      font-weight: bold;
      text-align: center;
      box-shadow: 0 10rpx 30rpx rgba(255, 107, 107, 0.4);
      
      &:active {
        transform: scale(0.98);
      }
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(100rpx);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
