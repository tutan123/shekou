<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header animate-slide-down">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">路线选择</text>
    </view>
    
    <scroll-view scroll-y class="route-list">
      <view 
        v-for="(route, index) in routes" 
        :key="index" 
        class="route-card-hf animate-fade-in" 
        :style="{animationDelay: index * 0.15 + 's'}"
      >
        <!-- 背景素材 -->
        <image class="card-bg" :src="route.bg" mode="scaleToFill"></image>
        
        <view class="card-content">
          <!-- 装饰艺术图 -->
          <view class="art-img-box">
            <image class="art-img" :src="route.artImg" mode="aspectFit"></image>
          </view>
          
          <view class="text-area">
            <view class="route-header">
              <text class="name">{{ route.name }}</text>
              <text class="arrow">≫</text>
            </view>
            <view class="route-desc">{{ route.desc }}</view>
          </view>
          
          <!-- 去探索按钮 -->
          <view class="explore-btn-box" @click="goExplore(route)">
            <view class="explore-btn">去探索</view>
          </view>
        </view>
      </view>
      <view class="bottom-padding"></view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      routes: [
        {
          id: 'laojie',
          name: '老街路线',
          desc: '蛇口老街漫步路线，从时代标签启程，经工业旧址、文创地标与人文景点，尽览开拓过往与诗意山海。',
          bg: '/static/route/card_bg_1.png',
          artImg: '/static/route/route_oldstreet.png',
          path: '/pages/oldstreet/index'
        },
        {
          id: 'xican',
          name: '西餐路线',
          desc: '蛇口西餐线条国际风味：宝可多、汉堡、意式披萨、格鲁吉亚菜，多种选择，家家有惊喜。',
          bg: '/static/route/card_bg_2.png',
          artImg: '/static/route/route_western.png',
          path: '/pages/route/detail?id=xican'
        },
        {
          id: 'kafei',
          name: '咖啡路线',
          desc: '蛇口咖啡漫游路线，是一场与香气的温柔邂逅。串联十家特色咖啡馆，慢品间，便读懂了蛇口独有的惬意与浪漫。',
          bg: '/static/route/card_bg_3.png',
          artImg: '/static/route/route_coffee.png',
          path: '/pages/route/detail?id=kafei'
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goExplore(route) {
      uni.navigateTo({
        url: route.path
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #FFF9E6;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 88rpx;
  padding: 80rpx 30rpx 20rpx;
  display: flex;
  align-items: center;
  background-color: #FFF9E6;
  position: relative;
  z-index: 100;
  
  .back-btn { font-size: 40rpx; margin-right: 24rpx; color: #333; font-weight: bold; }
  .title { font-size: 36rpx; font-weight: 800; color: #333; }
}

.route-list {
  flex: 1;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
}

.route-card-hf {
  position: relative;
  width: 100%;
  height: 320rpx; // Match background aspect ratio
  margin-bottom: 40rpx;
  
  .card-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: 1;
  }
  
  .card-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 40rpx 0 20rpx;
    box-sizing: border-box;
    
    .art-img-box {
      width: 240rpx;
      height: 240rpx;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      
      .art-img {
        width: 100%;
        height: 100%;
      }
    }
    
    .text-area {
      flex: 1;
      margin-left: 10rpx;
      margin-right: 20rpx;
      
      .route-header {
        display: flex;
        align-items: center;
        gap: 10rpx;
        margin-bottom: 8rpx;
        .name { font-size: 32rpx; font-weight: 900; color: #333; }
        .arrow { font-size: 20rpx; color: #333; opacity: 0.8; }
      }
      
      .route-desc {
        font-size: 20rpx;
        color: #555;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 4;
        overflow: hidden;
        font-weight: 500;
      }
    }
    
    .explore-btn-box {
      position: absolute;
      right: 32rpx;
      bottom: 60rpx; // Position over the circular cutout in the bg
      
      .explore-btn {
        background: transparent;
        color: #E64340; // High contrast for the yellow background
        font-size: 20rpx;
        font-weight: 900;
        text-align: center;
        width: 80rpx;
        height: 80rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        // The button itself might be part of the image, but we need a hit area.
        // Looking at the design, the "去探索" is inside a circle.
      }
    }
  }
}

.bottom-padding { height: 60rpx; }

@keyframes slideDown {
  from { transform: translateY(-40rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-slide-down { animation: slideDown 0.6s ease-out both; }
.animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.23, 1, 0.32, 1) both; }
</style>
