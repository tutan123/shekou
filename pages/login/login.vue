<template>
  <view class="container">
    <!-- 底图层：全屏地图背景 -->
    <view class="bg-layer">
      <image class="bg-map" src="/static/images/login_bg.png" mode="aspectFill"></image>
      <view class="bg-overlay"></view>
    </view>
    
    <!-- 上层图：登录卡片 -->
    <view class="login-card animate-fade-in">
      <view class="welcome-section">
        <image class="welcome-img" src="/static/images/welcome.png" mode="aspectFit"></image>
        <view class="welcome-cn">登录地图</view>
      </view>
      
      <view class="login-form">
        <view class="form-item">
          <view class="label">账号</view>
          <input class="input" type="text" placeholder="请输入账号" placeholder-style="color: #ccc" />
          <view class="line"></view>
        </view>
        
        <view class="form-item">
          <view class="label">密码</view>
          <view class="input-row">
            <input class="input" type="password" placeholder="请输入密码" placeholder-style="color: #ccc" />
            <view class="eye-box">
              <text class="eye-char">👁</text>
            </view>
          </view>
          <view class="line"></view>
        </view>
        
        <view class="form-links">
          <view class="link-item">
            <image class="link-icon" src="/static/images/forgot_pwd.png" mode="aspectFit"></image>
            <text>忘记密码？</text>
          </view>
          <view class="link-item">
            <image class="link-icon" src="/static/images/phone_login.png" mode="aspectFit"></image>
            <text>手机验证码登录</text>
          </view>
        </view>
      </view>
      
      <view class="action-section">
        <view class="login-btn" @click="handleLogin">
          <text>立即登录</text>
          <view class="btn-arrow">
            <image class="arrow-img" src="/static/images/arrow_right_white.png" mode="aspectFit"></image>
          </view>
        </view>
      </view>
      
      <view class="footer-links">
        <text class="register-text" @click="goToRegister">注册账户</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  methods: {
    handleLogin() {
      uni.switchTab({
        url: '/pages/index/index'
      });
    },
    goToRegister() {
      uni.showToast({ title: '注册功能暂未开放', icon: 'none' });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  overflow: hidden;
}

.bg-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  
  .bg-map {
    width: 100%;
    height: 100%;
  }
  
  .bg-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(2px);
  }
}

.login-card {
  width: 620rpx;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 60rpx;
  padding: 80rpx 60rpx;
  box-shadow: 0 30rpx 80rpx rgba(0,0,0,0.15);
  position: relative;
  z-index: 10;
  border: 1rpx solid rgba(255, 255, 255, 0.5);
}

.welcome-section {
  margin-bottom: 70rpx;
  .welcome-img {
    width: 280rpx;
    height: 60rpx;
    display: block;
  }
  .welcome-cn {
    font-size: 56rpx;
    font-weight: 800;
    color: #333;
    margin-top: 20rpx;
    letter-spacing: 2rpx;
  }
}

.login-form {
  .form-item {
    margin-bottom: 44rpx;
    .label {
      font-size: 26rpx;
      color: #999;
      margin-bottom: 12rpx;
      font-weight: 500;
    }
    .input {
      height: 80rpx;
      font-size: 32rpx;
      color: #333;
    }
    .input-row {
      display: flex;
      align-items: center;
      .input { flex: 1; }
      .eye-box {
        width: 44rpx;
        height: 44rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        .eye-char { font-size: 32rpx; opacity: 0.3; }
      }
    }
    .line {
      height: 2rpx;
      background: #f0f0f0;
      margin-top: 8rpx;
    }
  }
}

.form-links {
  display: flex;
  justify-content: space-between;
  margin-top: 10rpx;
  .link-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    font-size: 24rpx;
    color: #999;
    .link-icon {
      width: 24rpx;
      height: 24rpx;
    }
  }
}

.action-section {
  margin-top: 80rpx;
  display: flex;
  justify-content: center;
  
  .login-btn {
    background: #0088CC;
    color: #fff;
    width: 360rpx;
    height: 100rpx;
    border-radius: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 34rpx;
    font-weight: bold;
    box-shadow: 0 10rpx 30rpx rgba(0, 136, 204, 0.3);
    position: relative;
    transition: all 0.2s;
    
    &:active {
      transform: scale(0.96);
      opacity: 0.9;
    }
    
    .btn-arrow {
      position: absolute;
      right: 36rpx;
      width: 44rpx;
      height: 44rpx;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .arrow-img { width: 24rpx; height: 24rpx; }
    }
  }
}

.footer-links {
  text-align: right;
  margin-top: 80rpx;
  .register-text {
    font-size: 26rpx;
    color: #999;
    font-weight: 500;
  }
}

.animate-fade-in {
  animation: fadeIn 1s cubic-bezier(0.23, 1, 0.32, 1) both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(60rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
