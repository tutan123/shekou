<template>
  <view class="container">
    <view class="nav-header">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">个人收藏</text>
    </view>

    <scroll-view scroll-y class="favorite-list">
      <view v-if="collectedItems.length === 0" class="empty-state">
        <text class="empty-icon">📭</text>
        <text>你还没有点亮任何图鉴哦</text>
      </view>
      
      <view 
        class="fav-card" 
        v-for="(item, index) in collectedItems" 
        :key="index"
        @click="showDetail(item)"
      >
        <view class="card-left">
          <image class="poi-img" :src="item.img" mode="aspectFit"></image>
        </view>
        <view class="card-content">
          <view class="poi-title">
            {{ item.name }}
            <text class="arrow">≫</text>
          </view>
          <text class="cat-tag">{{ item.catName }}路线</text>
          
          <view class="path-decoration">
            <view class="dot" v-for="i in 5" :key="i"></view>
          </view>
        </view>
        <view class="card-right">
          <view class="status-btn">
            {{ item.status }}
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 详情弹窗 -->
    <view v-if="detailVisible" class="detail-popup-mask" @click="hideDetail">
      <view class="detail-popup-content" @click.stop>
        <view class="close-btn" @click="hideDetail">✕</view>
        <image class="detail-image" :src="currentPoi.detailImg" mode="widthFix"></image>
        <view class="check-in-btn-container">
          <image class="btn-bg" :src="assets.route.checkinBtn" mode="scaleToFill"></image>
          <text class="btn-text">已点亮</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { CATEGORIES } from '@/utils/poi-config.js';
import { ASSETS_CONFIG } from '@/utils/assets-config.js';

export default {
  data() {
    return {
      assets: ASSETS_CONFIG,
      checkInData: { history: [], binhai: [], dengshan: [], coffee: [], western: [] },
      collectedItems: [],
      detailVisible: false,
      currentPoi: {}
    }
  },
  onShow() {
    this.loadCollectedItems();
  },
  methods: {
    loadCollectedItems() {
      const data = uni.getStorageSync('shekou_checkin');
      if (data) {
        this.checkInData = data;
      }
      
      const items = [];
      // 遍历所有分类
      Object.keys(CATEGORIES).forEach(catKey => {
        const category = CATEGORIES[catKey];
        const checkedNames = this.checkInData[catKey] || [];
        
        checkedNames.forEach(name => {
          const poiInfo = category.items[name];
          if (poiInfo) {
            items.push({
              name: name,
              catName: category.name,
              img: poiInfo.icon || poiInfo.pic,
              detailImg: poiInfo.detailImg,
              status: '已打卡'
            });
          }
        });
      });
      
      this.collectedItems = items;
    },
    goBack() {
      uni.navigateBack();
    },
    showDetail(item) {
      this.currentPoi = item;
      this.detailVisible = true;
    },
    hideDetail() {
      this.detailVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFF9E6;
}

.nav-header {
  height: 88rpx;
  padding: 80rpx 30rpx 20rpx;
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
  
  .back-btn { font-size: 40rpx; margin-right: 20rpx; }
  .title { font-size: 34rpx; font-weight: bold; }
}

.favorite-list {
  padding: 0 30rpx;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 200rpx;
  color: #999;
  font-size: 28rpx;
  .empty-icon { font-size: 80rpx; margin-bottom: 20rpx; }
}

.fav-card {
  background: #FFCC00;
  border-radius: 30rpx;
  display: flex;
  padding: 24rpx;
  margin-bottom: 30rpx;
  position: relative;
  box-shadow: 0 8rpx 20rpx rgba(255, 204, 0, 0.2);
  
  &:active { transform: scale(0.98); transition: transform 0.1s; }
  
  .card-left {
    width: 140rpx;
    height: 140rpx;
    background: #fff;
    border-radius: 20rpx;
    margin-right: 20rpx;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .poi-img { width: 100%; height: 100%; }
  }
  
  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    
    .poi-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      margin-bottom: 6rpx;
      .arrow { font-size: 20rpx; margin-left: 10rpx; }
    }
    .cat-tag {
      font-size: 20rpx;
      color: #666;
      background: rgba(255,255,255,0.4);
      padding: 2rpx 12rpx;
      border-radius: 10rpx;
      align-self: flex-start;
    }
    
    .path-decoration {
      display: flex;
      gap: 6rpx;
      margin-top: 15rpx;
      .dot { width: 6rpx; height: 6rpx; background: rgba(255,255,255,0.6); border-radius: 50%; }
    }
  }
  
  .card-right {
    display: flex;
    align-items: center;
    
    .status-btn {
      padding: 10rpx 24rpx;
      border-radius: 30rpx;
      font-size: 20rpx;
      font-weight: bold;
      background: #FF9900;
      color: #fff;
      box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
    }
  }
}

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
    position: absolute;
    bottom: -48rpx;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
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
