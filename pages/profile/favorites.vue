<template>
  <view class="container">
    <view class="nav-header">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">个人收藏</text>
    </view>

    <scroll-view scroll-y class="favorite-list">
      <view class="fav-card" v-for="(item, index) in favorites" :key="index">
        <view class="card-left">
          <image class="poi-img" :src="item.img" mode="aspectFill"></image>
        </view>
        <view class="card-content">
          <view class="poi-title">
            {{ item.name }}
            <text class="arrow">≫</text>
          </view>
          <text class="map-link">查看地图</text>
          
          <view class="path-decoration">
            <view class="dot" v-for="i in 5" :key="i"></view>
          </view>
        </view>
        <view class="card-right">
          <view :class="['status-btn', item.status === '已打卡' ? 'done' : 'todo']">
            {{ item.status }}
          </view>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      favorites: [
        { name: '海上世界文化艺术中心', status: '已打卡', img: '' },
        { name: 'G&G创意社区', status: '去打卡', img: '' },
        { name: '水湾炮楼', status: '去打卡', img: '' },
        { name: '招商局历史博物馆', status: '已打卡', img: '' },
        { name: '梵语私房菜', status: '去打卡', img: '' }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
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

.fav-card {
  background: #FFCC00;
  border-radius: 30rpx;
  display: flex;
  padding: 24rpx;
  margin-bottom: 30rpx;
  position: relative;
  
  .card-left {
    width: 140rpx;
    height: 140rpx;
    background: #fff;
    border-radius: 20rpx;
    margin-right: 20rpx;
    overflow: hidden;
  }
  
  .card-content {
    flex: 1;
    .poi-title {
      font-size: 28rpx;
      font-weight: bold;
      color: #333;
      .arrow { font-size: 20rpx; margin-left: 10rpx; }
    }
    .map-link {
      font-size: 20rpx;
      color: #666;
      text-decoration: underline;
      margin-top: 10rpx;
      display: block;
    }
    .path-decoration {
      display: flex;
      gap: 6rpx;
      margin-top: 20rpx;
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
      
      &.done {
        background: #FF9900;
        color: #333;
        opacity: 0.8;
      }
      &.todo {
        background: #fff;
        color: #666;
      }
    }
  }
}
</style>
