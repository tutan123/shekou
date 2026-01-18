<template>
  <view class="container">
    <view class="nav-header">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">个人设置</text>
    </view>

    <!-- 提示告示 -->
    <view v-if="showNotice" class="notice-toast">
      <text class="notice-icon">ℹ️</text>
      <text class="notice-text">游客即可访问，登录注册暂不启用</text>
    </view>

    <view class="content">
      <view class="settings-card">
        <view class="form-item">
          <text class="label">邮箱</text>
          <input class="input" type="text" placeholder="请输入您的邮箱进行验证" placeholder-style="color: #ccc" disabled />
        </view>
        
        <view class="form-item">
          <view class="label-row">
            <text class="label">当前密码</text>
            <text class="forgot">忘记密码？</text>
          </view>
          <input class="input" type="password" disabled />
        </view>
        
        <view class="form-item">
          <text class="label">新密码</text>
          <input class="input" type="password" placeholder="请输入您的新密码" placeholder-style="color: #ccc" disabled />
        </view>
        
        <view class="form-item">
          <text class="label">再次输入</text>
          <input class="input" type="password" placeholder="请再输入您的新密码" placeholder-style="color: #ccc" disabled />
        </view>
      </view>
      
      <view class="other-login">
        <view class="divider-text">其他登录方式</view>
        <view class="social-icons">
          <view class="social-icon">👻</view>
          <view class="social-icon">💬</view>
          <view class="social-icon">G</view>
        </view>
      </view>
      
      <view class="finish-btn-box">
        <view class="finish-btn disabled">完成</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      showNotice: true
    }
  },
  onLoad() {
    // 提示告示常驻
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    handleFinish() {
      uni.showToast({ title: '设置已保存', icon: 'success' });
      setTimeout(() => { uni.navigateBack(); }, 1500);
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  min-height: 100vh;
  background-color: #FFCB32;
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

.notice-toast {
  position: fixed;
  top: 180rpx;
  left: 40rpx;
  right: 40rpx;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  padding: 24rpx 40rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeInDown 0.5s ease;
  
  .notice-icon {
    margin-right: 16rpx;
    font-size: 32rpx;
  }
  
  .notice-text {
    color: #fff;
    font-size: 26rpx;
    font-weight: 500;
  }
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.content {
  padding: 40rpx;
  
  .settings-card {
    background: #fff;
    border-radius: 40rpx;
    padding: 60rpx 40rpx;
    box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.05);
    
    .form-item {
      margin-bottom: 50rpx;
      &:last-child { margin-bottom: 0; }
      
      .label-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16rpx;
        .forgot { font-size: 24rpx; color: #ccc; }
      }
      
      .label {
        font-size: 28rpx;
        color: #333;
        margin-bottom: 16rpx;
        display: block;
      }
      
      .input {
        height: 80rpx;
        border-bottom: 2rpx solid #f0f0f0;
        font-size: 28rpx;
      }
    }
  }
}

.other-login {
  margin-top: 80rpx;
  text-align: center;
  
  .divider-text {
    font-size: 24rpx;
    color: #999;
    position: relative;
    display: inline-block;
    padding: 0 30rpx;
    
    &::before, &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: 100rpx;
      height: 2rpx;
      background: #eee;
    }
    &::before { right: 100%; }
    &::after { left: 100%; }
  }
  
  .social-icons {
    display: flex;
    justify-content: center;
    gap: 60rpx;
    margin-top: 40rpx;
    
    .social-icon {
      width: 80rpx;
      height: 80rpx;
      background: #f5f5f5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40rpx;
      color: #999;
    }
  }
}

.finish-btn-box {
  margin-top: 80rpx;
  
    .finish-btn {
    background: #00A99D;
    color: #fff;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 32rpx;
    font-weight: bold;
    box-shadow: 0 10rpx 20rpx rgba(0, 169, 157, 0.2);
    
    &.disabled {
      background: #ccc;
      box-shadow: none;
      color: #f0f0f0;
    }
  }
}
</style>
