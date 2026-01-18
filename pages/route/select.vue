<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header animate-slide-down">
      <SafeImage class="header-bg-img" :src="assets.route.headerBgMap" mode="aspectFill">
        <template #error>
          <view class="error-placeholder">
            <text>🎯 路线选择背景加载失败</text>
            <text>{{ assets.route.headerBgMap }}</text>
          </view>
        </template>
      </SafeImage>
      <view class="back-btn" @click="goBack">←</view>
      <view class="title-container">
        <text class="title">路线选择</text>
      </view>
    </view>
    
    <scroll-view scroll-y class="route-list">
      <view 
        v-for="(route, index) in routes" 
        :key="index" 
        class="route-card-container animate-fade-in" 
        :style="{animationDelay: index * 0.15 + 's'}"
        @click="goExplore(route)"
      >
        <!-- 装饰艺术图 (溢出卡片外部) -->
        <image class="art-img" :src="route.artImg" mode="aspectFit" :class="route.id"></image>

        <view class="route-card-body">
          <!-- 背景图 (带切口和阴影的黄色底) -->
          <image class="card-bg" :src="route.bg" mode="scaleToFill"></image>
          
          <view class="card-content">
            <view class="text-area">
              <view class="route-header">
                <text class="name">{{ route.name }}</text>
                <text class="arrow-double">≫</text>
              </view>
              <view class="route-desc">{{ route.desc }}</view>
            </view>
            
            <!-- 右侧探索按钮区域 -->
            <view class="explore-side">
              <image class="dots-img" :src="assets.route.pathDots1" mode="aspectFit"></image>
              <view class="circle-btn">
                <text class="btn-text">去探索</text>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view class="bottom-padding"></view>
    </scroll-view>
  </view>
</template>

<script>
import SafeImage from '@/components/SafeImage.vue'
import { ASSETS_CONFIG } from '@/utils/assets-config.js'

export default {
  components: {
    SafeImage
  },
  data() {
    return {
      assets: ASSETS_CONFIG,
      routes: [
        {
          id: 'laojie',
          name: '老街路线',
          desc: '蛇口老街漫步路线，从时代标签启程，经工业旧址、文创地标与人文景点，尽览开拓过往与诗意山海。',
          bg: ASSETS_CONFIG.route.cardBg1,
          artImg: ASSETS_CONFIG.route.oldstreetShip,
          path: '/pages/route/detail?id=laojie'
        },
        {
          id: 'dengshan',
          name: '登山路线',
          desc: '从 "时间就是金钱，效率就是生命" 标语牌起步，沿微波山步道缓步登高，山海相伴，终点抵达招商局历史博物馆，一路见证蛇口的改革精神与百年变迁。',
          bg: ASSETS_CONFIG.route.cardBg2,
          artImg: ASSETS_CONFIG.route.mountainArt,
          path: '/pages/route/detail?id=dengshan'
        },
        {
          id: 'binhai',
          name: '滨海路线',
          desc: '从海上世界明华轮启航，经女娲补天雕像与文化艺术中心的袁庚展，再到南海酒店与碧涛苑别墅群，一路海风相伴，尽览蛇口的开放气质与滨海风情。',
          bg: ASSETS_CONFIG.route.cardBg3,
          artImg: ASSETS_CONFIG.route.seaArt,
          path: '/pages/route/detail?id=binhai'
        },
        {
          id: 'xican',
          name: '西餐路线',
          desc: '蛇口西餐线条国际风味：宝可多、汉堡、意式披萨、格鲁吉亚菜，多种选择，家家有惊喜。',
          bg: ASSETS_CONFIG.route.cardBg2,
          artImg: ASSETS_CONFIG.route.westernPizza,
          path: '/pages/route/detail?id=xican'
        },
        {
          id: 'kafei',
          name: '咖啡路线',
          desc: '蛇口咖啡漫游路线，是一场与香气的温柔邂逅。串联十家特色咖啡馆，慢品间，便读懂了蛇口。',
          bg: ASSETS_CONFIG.route.cardBg3,
          artImg: ASSETS_CONFIG.route.coffeeTools,
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
        url: route.path + (route.path.includes('?') ? '&' : '?') + 'name=' + encodeURIComponent(route.name)
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  background-color: #FFCB32;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 320rpx; 
  padding: 0rpx 30rpx;
  display: flex;
  align-items: center;
  background-color: #FFCB32;
  position: relative;
  z-index: 100;
  overflow: hidden;
  
  .header-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  
  .back-btn { 
    width: 60rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 44rpx; 
    color: #333; 
    font-weight: bold; 
    position: absolute;
    left: 30rpx;
    top: 140rpx; 
    z-index: 10;
  }
  
  .title-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 110rpx; 
  }
  
  .title { 
    font-size: 40rpx; 
    font-weight: 900; 
    color: #333; 
    letter-spacing: 4rpx;
  }
}

.route-list {
  flex: 1;
  padding: 20rpx 30rpx; 
  box-sizing: border-box;
}

.route-card-container {
  position: relative;
  width: 100%;
  height: 320rpx;
  margin-bottom: 50rpx;
  display: flex;
  align-items: flex-end;
}

.art-img {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(0 10rpx 15rpx rgba(0,0,0,0.15));
  
  &.laojie {
    width: 340rpx;
    height: 340rpx;
    left: -30rpx;
    top: -50rpx;
  }
  
  &.xican {
    width: 320rpx;
    height: 320rpx;
    left: -20rpx;
    top: -30rpx;
  }
  
  &.dengshan, &.binhai {
    width: 320rpx;
    height: 320rpx;
    left: -20rpx;
    top: -30rpx;
  }
  
  &.kafei {
    width: 300rpx;
    height: 300rpx;
    left: -10rpx;
    top: 0rpx;
  }
}

.route-card-body {
  position: relative;
  width: 100%;
  height: 260rpx;
  border-radius: 40rpx;
  box-shadow: 0 15rpx 30rpx rgba(0,0,0,0.08);
  
  .card-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: 1;
  }
}

.card-content {
  position: relative;
  z-index: 5;
  width: 100%;
  height: 100%;
  display: flex;
  padding-left: 260rpx; 
  padding-right: 0rpx;
  box-sizing: border-box;
  align-items: center;
  
  .text-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-top: 10rpx;
    
    .route-header {
      display: flex;
      align-items: center;
      margin-bottom: 12rpx;
      
      .name { 
        font-size: 34rpx; 
        font-weight: 900; 
        color: #333; 
        letter-spacing: 2rpx;
      }
      .arrow-double { 
        font-size: 28rpx; 
        color: #333; 
        margin-left: 10rpx;
        font-weight: bold;
      }
    }
    
    .route-desc {
      font-size: 22rpx;
      color: #555;
      line-height: 1.5;
      font-weight: 500;
      padding-right: 80rpx; 
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
    }
  }
}

.explore-side {
  position: absolute;
  right: -40rpx; // 稍微增加向右偏移，圆心更靠外
  top: 0;
  bottom: 0;
  width: 200rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; // 改为顶部对齐，通过 padding-top 精确控制
  padding-top: 125rpx; // 调大内边距以适配更小的圆圈
  box-sizing: border-box;
  
  .dots-img {
    width: 120rpx;
    height: 40rpx;
    margin-bottom: 5rpx;
    margin-right: 40rpx;
    opacity: 0.8;
  }
  
  .circle-btn {
    width: 110rpx;
    height: 110rpx;
    background: linear-gradient(135deg, #FFB800 0%, #FF8A00 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 10rpx 25rpx rgba(255, 138, 0, 0.5);
    margin-right: 40rpx;
    transition: all 0.2s ease;
    
    .btn-text {
      font-size: 22rpx;
      font-weight: 900;
      color: #fff;
      white-space: nowrap;
      text-align: center;
      line-height: 1.2;
      letter-spacing: 2rpx;
    }
    
    &:active {
      transform: scale(0.9);
      opacity: 0.9;
    }
  }
}

.bottom-padding { height: 100rpx; }

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
