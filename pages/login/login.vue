<template>
  <view class="container">
    <!-- 底图层：全屏地图背景 -->
    <view class="bg-layer">
      <image class="bg-map" :src="assets.login.bg" mode="aspectFill"></image>
    </view>
    
    <!-- 登录卡片 -->
    <view class="login-container animate-fade-in">
      <view class="login-card">
        <!-- 装饰点 -->
        <view class="location-pin">
          <view class="pin-circle"></view>
        </view>

        <view class="welcome-section">
          <image class="welcome-img" :src="assets.login.welcome" mode="aspectFit"></image>
          <image class="title-img" :src="assets.login.title" mode="aspectFit"></image>
        </view>
        
        <view class="login-form">
          <view class="form-item">
            <view class="label">账号</view>
            <input class="input" type="text" placeholder="" />
            <view class="line"></view>
          </view>
          
          <view class="form-item">
            <view class="label">密码</view>
            <view class="input-row">
              <input class="input" :password="!showPassword" type="text" placeholder="" />
              <image 
                class="eye-icon" 
                :src="assets.login.eye" 
                mode="aspectFit"
                @click="showPassword = !showPassword"
              ></image>
            </view>
            <view class="line"></view>
          </view>
          
          <view class="form-links">
            <image class="link-img" :src="assets.login.forgotPwd" mode="aspectFit" @click="handleForgot"></image>
            <image class="link-img" :src="assets.login.phoneLogin" mode="aspectFit" @click="handlePhoneLogin"></image>
          </view>
        </view>
        
        <view class="action-row">
          <view class="login-btn-wrapper" @click="handleLogin">
            <image class="login-btn-img" :src="assets.login.btnLogin" mode="aspectFit"></image>
          </view>
          <view class="arrow-btn" @click="handleLogin">
            <image class="arrow-img" :src="assets.login.arrow" mode="aspectFit"></image>
          </view>
        </view>

        <view class="footer">
          <image class="register-img" :src="assets.login.register" mode="aspectFit" @click="goToRegister"></image>
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
      showPassword: false,
      assets: ASSETS_CONFIG
    }
  },
  methods: {
    handleLogin() {
      uni.showLoading({ title: '登录中...' });
      setTimeout(() => {
        uni.hideLoading();
        uni.switchTab({
          url: '/pages/index/index'
        });
      }, 1000);
    },
    handleForgot() {
      uni.showToast({ title: '功能开发中', icon: 'none' });
    },
    handlePhoneLogin() {
      uni.showToast({ title: '功能开发中', icon: 'none' });
    },
    goToRegister() {
      uni.showToast({ title: '注册暂未开放', icon: 'none' });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background-color: #fff;
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
}

.login-container {
  position: relative;
  z-index: 10;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40rpx;
  box-sizing: border-box;
}

.login-card {
  width: 100%;
  max-width: 650rpx;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15rpx);
  border-radius: 40rpx;
  padding: 80rpx 60rpx 40rpx;
  position: relative;
  box-shadow: 0 20rpx 60rpx rgba(0,0,0,0.1);
  border: 1rpx solid rgba(255,255,255,0.3);
}

.location-pin {
  position: absolute;
  top: -60rpx;
  left: 40rpx;
  width: 120rpx;
  height: 120rpx;
  background: rgba(255, 182, 193, 0.6);
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  
  .pin-circle {
    width: 40rpx;
    height: 40rpx;
    background: #fff;
    border-radius: 50%;
    transform: rotate(45deg);
  }
}

.welcome-section {
  margin-bottom: 60rpx;
  display: flex;
  flex-direction: column;
  gap: 20rpx;
  
  .welcome-img {
    width: 180rpx;
    height: 40rpx;
    display: block;
  }
  
  .title-img {
    width: 320rpx;
    height: 100rpx;
    display: block;
  }
}

.login-form {
  .form-item {
    margin-bottom: 40rpx;
    
    .label {
      font-size: 28rpx;
      color: #666;
      margin-bottom: 10rpx;
      font-weight: bold;
    }
    
    .input {
      height: 60rpx;
      font-size: 32rpx;
      color: #333;
    }
    
    .input-row {
      display: flex;
      align-items: center;
      .input { flex: 1; }
      .eye-icon {
        width: 44rpx;
        height: 44rpx;
        padding: 10rpx;
      }
    }
    
    .line {
      height: 2rpx;
      background: #333;
      margin-top: 5rpx;
    }
  }
}

.form-links {
  display: flex;
  justify-content: space-between;
  margin-top: 20rpx;
  
  .link-img {
    height: 36rpx;
    width: 200rpx;
  }
}

.action-row {
  margin-top: 80rpx;
  display: flex;
  align-items: center;
  gap: 30rpx;
  
  .login-btn-wrapper {
    flex: 1;
    height: 100rpx;
    display: flex;
    align-items: center;
    
    .login-btn-img {
      width: 100%;
      height: 100%;
    }
  }
  
  .arrow-btn {
    width: 100rpx;
    height: 100rpx;
    flex-shrink: 0;
    
    .arrow-img {
      width: 100%;
      height: 100%;
    }
  }
}

.footer {
  margin-top: 60rpx;
  display: flex;
  justify-content: flex-end;
  
  .register-img {
    width: 160rpx;
    height: 40rpx;
  }
}

.animate-fade-in {
  animation: fadeIn 0.8s ease-out both;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(30rpx); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
