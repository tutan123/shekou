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
  bottom: 0;
  left: 0;
  right: 0;
  height: 120rpx;
  background: #FFFFFF;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
  z-index: 9999;
}

.tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
}

.icon-wrapper {
  width: 50rpx;
  height: 50rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &.active {
    width: 70rpx; // 选中时变大
    height: 70rpx;
    transform: translateY(-10rpx); // 稍微往上提一点，增加动态感
  }
  
  .tab-icon {
    width: 100%;
    height: 100%;
  }
}

.tab-text {
  font-size: 20rpx;
  color: #999999;
  margin-top: 6rpx;
  transition: all 0.3s;
  
  &.active {
    color: #333333;
    font-weight: bold;
    transform: scale(1.1);
  }
}
</style>
