<template>
  <view class="container">
    <view class="nav-header">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">个人资料</text>
    </view>

    <view class="content">
      <view class="info-card">
        <view class="info-item avatar-item">
          <text class="label">头像</text>
          <view class="value">
            <image class="avatar" src="/static/images/avatar_placeholder.png" mode="aspectFill"></image>
            <text class="arrow">></text>
          </view>
        </view>
        
        <view class="info-item">
          <text class="label">名字</text>
          <view class="value">
            <text class="text">DWQ</text>
            <text class="arrow">></text>
          </view>
        </view>
        
        <view class="info-item">
          <text class="label">电话</text>
          <view class="value">
            <text class="text">19106572834</text>
            <text class="arrow">></text>
          </view>
        </view>
        
        <view class="info-item">
          <text class="label">地址</text>
          <view class="value">
            <text class="text">广东省深圳市深圳大学</text>
            <text class="arrow">></text>
          </view>
        </view>
      </view>
      
      <view class="logout-btn-box">
        <view class="logout-btn" @click="handleLogout">退出登录</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    goBack() {
      uni.navigateBack();
    },
    handleLogout() {
      uni.reLaunch({
        url: '/pages/login/login'
      });
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
  
  .back-btn {
    font-size: 40rpx;
    margin-right: 20rpx;
  }
  
  .title {
    font-size: 34rpx;
    font-weight: bold;
  }
}

.content {
  padding: 30rpx;
  
  .info-card {
    background: #fff;
    border-radius: 40rpx;
    padding: 0 40rpx;
    box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05);
    
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 40rpx 0;
      border-bottom: 2rpx solid #f9f9f9;
      
      &:last-child {
        border-bottom: none;
      }
      
      .label {
        font-size: 30rpx;
        color: #333;
      }
      
      .value {
        display: flex;
        align-items: center;
        
        .avatar {
          width: 80rpx;
          height: 80rpx;
          border-radius: 20rpx;
          margin-right: 20rpx;
        }
        
        .text {
          font-size: 28rpx;
          color: #666;
          margin-right: 10rpx;
        }
        
        .arrow {
          font-size: 24rpx;
          color: #ccc;
        }
      }
    }
    
    .avatar-item {
      padding: 30rpx 0;
    }
  }
}

.logout-btn-box {
  margin-top: 100rpx;
  padding: 0 40rpx;
  
  .logout-btn {
    background: #00A99D;
    color: #fff;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
  }
}
</style>
