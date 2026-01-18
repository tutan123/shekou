<template>
  <view class="tab-bar-container">
    <view class="tab-bar">
      <view 
        v-for="(item, index) in list" 
        :key="index" 
        class="tab-item" 
        @click="switchTab(item.pagePath)"
      >
        <!-- 容器：处理图标的定位 -->
        <view class="icon-container">
          <view :class="['icon-wrapper', activePath === item.pagePath ? 'active' : '']">
            <image 
              class="tab-icon" 
              :src="activePath === item.pagePath ? item.selectedIconPath : item.iconPath" 
              mode="aspectFit"
            ></image>
          </view>
        </view>
        <!-- 文字固定在底部 -->
        <text :class="['tab-text', activePath === item.pagePath ? 'active' : '']">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    activePath: {
      type: String,
      default: 'pages/index/index'
    }
  },
  data() {
    return {
      list: [
        {
          pagePath: 'pages/atlas/index',
          text: '图鉴',
          iconPath: '/static/tabbar/atlas-inactive.png',
          selectedIconPath: '/static/tabbar/atlas.png'
        },
        {
          pagePath: 'pages/index/index',
          text: '蛇口地图',
          iconPath: '/static/tabbar/map.png',
          selectedIconPath: '/static/tabbar/map-active.png'
        },
        {
          pagePath: 'pages/profile/index',
          text: '个人中心',
          iconPath: '/static/tabbar/profile.png',
          selectedIconPath: '/static/tabbar/profile-active.png'
        }
      ]
    }
  },
  methods: {
    switchTab(url) {
      if ('/' + url === this.$route?.path) return;
      uni.switchTab({
        url: '/' + url
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.tab-bar-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: #ffffff; // 底部栏背景色
  padding-bottom: env(safe-area-inset-bottom); // 适配全面屏底部
  box-shadow: 0 -2rpx 15rpx rgba(0, 0, 0, 0.05);
}

.tab-bar {
  height: 110rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  height: 100%;
  padding-bottom: 10rpx;
}

.icon-container {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.icon-wrapper {
  width: 70rpx;
  height: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: absolute;
  bottom: 0rpx; // 默认位置在 BAR 内部（稍微偏下，对齐文字）

  &.active {
    width: 140rpx;
    height: 120rpx;
    bottom: 50rpx; // 激活时向上伸出
    background: #ffffff;
    border-radius: 40rpx 40rpx 15rpx 15rpx;
    box-shadow: 0 -10rpx 30rpx rgba(0, 0, 0, 0.1);
    
    .tab-icon {
      width: 80rpx;
      height: 80rpx;
    }
  }
  
  .tab-icon {
    width: 68rpx; // 非激活状态图标加大，从 50 -> 68
    height: 68rpx;
    transition: all 0.3s;
  }
}

.tab-text {
  font-size: 24rpx;
  color: #999999;
  transition: all 0.3s;
  font-weight: 500;
  
  &.active {
    color: #007AFF;
    font-weight: bold;
  }
}
</style>
