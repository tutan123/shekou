<template>
  <view class="container">
    <view class="category-tabs">
      <view 
        v-for="(tab, index) in tabs" 
        :key="index" 
        :class="['tab', activeTab === index ? 'active' : '']"
        @click="activeTab = index"
      >
        {{ tab }}
      </view>
    </view>

    <scroll-view scroll-y class="atlas-grid">
      <view class="atlas-item" v-for="i in 12" :key="i">
        <view class="item-card">
          <view class="item-img-box">
            <!-- 未解锁状态 -->
            <view class="lock-overlay" v-if="i > 4">🔒</view>
          </view>
          <text class="item-name">{{ i > 4 ? '???' : '景点 ' + i }}</text>
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 0,
      tabs: ['历史', '咖啡', '西餐', '滨海', '登山']
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFF9E6;
  padding: 30rpx;
}

.category-tabs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 40rpx;
  
  .tab {
    padding: 12rpx 30rpx;
    background: #fff;
    border-radius: 30rpx;
    font-size: 24rpx;
    color: #666;
    border: 2rpx solid #eee;
    
    &.active {
      background: #FFCC00;
      color: #333;
      border-color: #FFCC00;
      font-weight: bold;
    }
  }
}

.atlas-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  
  .atlas-item {
    width: 48%;
    margin-bottom: 30rpx;
    
    .item-card {
      background: #fff;
      border-radius: 30rpx;
      padding: 20rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.03);
      
      .item-img-box {
        width: 100%;
        height: 200rpx;
        background: #f9f9f9;
        border-radius: 20rpx;
        margin-bottom: 16rpx;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .lock-overlay {
          font-size: 40rpx;
          opacity: 0.3;
        }
      }
      
      .item-name {
        font-size: 26rpx;
        color: #333;
        font-weight: 500;
      }
    }
  }
}
</style>
