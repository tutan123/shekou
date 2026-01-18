<template>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in list" 
      :key="index" 
      class="tab-item" 
      @click="switchTab(item.pagePath)"
    >
      <view :class="['icon-wrapper', activePath === item.pagePath ? 'active' : '']">
        <image 
          class="tab-icon" 
          :src="activePath === item.pagePath ? item.selectedIconPath : item.iconPath" 
          mode="aspectFit"
        ></image>
      </view>
      <text :class="['tab-text', activePath === item.pagePath ? 'active' : '']">{{ item.text }}</text>
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
.tab-bar {
  position: fixed;
  bottom: 30rpx; // 距离底部一点距离，产生悬浮感
  left: 30rpx;
  right: 30rpx;
  height: 110rpx; // 稍微加高一点点，适配文字
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  justify-content: space-around;
  align-items: flex-end; // 改为底部对齐
  border-radius: 60rpx;
  box-shadow: 0 15rpx 40rpx rgba(0, 0, 0, 0.1);
  z-index: 9999;
  padding-bottom: 10rpx;
  backdrop-filter: blur(10px);
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  flex: 1;
  height: 140rpx; // 增加点击区域高度
  position: relative;
}

.icon-wrapper {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 8rpx 20rpx rgba(0,0,0,0.08);
  position: absolute;
  top: -30rpx; // 让它凸出来
  
  &.active {
    width: 100rpx;
    height: 100rpx;
    top: -50rpx; // 激活时凸得更多
    background: #FFCC00; // 激活时背景变色
    box-shadow: 0 12rpx 30rpx rgba(255, 204, 0, 0.3);
    
    .tab-icon {
      filter: none; // 确保彩色图标不被滤镜影响
    }
  }
  
  .tab-icon {
    width: 50rpx; // 固定图标大小
    height: 50rpx;
  }
}

.tab-text {
  font-size: 20rpx;
  color: #999999;
  margin-bottom: 15rpx;
  transition: all 0.3s;
  font-weight: 600;
  
  &.active {
    color: #333333;
    font-weight: 800;
    transform: scale(1.1);
  }
}
</style>
