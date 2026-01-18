<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header animate-slide-down">
      <SafeImage class="header-bg-img" :src="assets.route.headerBgMap" mode="aspectFit">
        <template #error>
          <view class="error-placeholder">
            <text>🎯 路线选择背景加载失败</text>
            <text>{{ assets.route.headerBgMap }}</text>
          </view>
        </template>
      </SafeImage>
      <view class="back-btn" @click="goBack">←</view>
      <view class="title-container">
        <!-- 移除代码里的标题文字，因为背景图里已经有漂亮的“路线选择”字样了，避免重叠 -->
        <!-- <text class="title">路线选择</text> -->
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
  background-color: #FEF9E7; // 浅黄色/米色背景，比主色调浅
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  height: 360rpx; // 进一步调高，给手绘图留出完整空间
  padding: 0rpx;
  display: flex;
  align-items: center;
  background-color: #FEF9E7;
  position: relative;
  z-index: 100;
  overflow: hidden;
  border-bottom: 6rpx solid #222;
  
  .header-bg-img {
    position: absolute;
    top: 20rpx; // 向下偏移一点，避开顶部状态栏
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    // 使用 aspectFit 并去掉拉伸相关的 transform
    transform: none;
  }
  
  .back-btn { 
    width: 80rpx;
    height: 80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 50rpx; 
    color: #222; 
    font-weight: 900; 
    position: absolute;
    left: 20rpx;
    top: 130rpx; 
    z-index: 10;
    background: rgba(255,255,255,0.3); // 增加毛玻璃背景
    border-radius: 50%;
    backdrop-filter: blur(5px);
  }
  
  .title-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 110rpx; 
  }
  
  .title { 
    font-size: 48rpx; 
    font-weight: 900; 
    color: #222; 
    letter-spacing: 6rpx;
    font-family: 'RuilingTi', sans-serif !important; // 使用新字体
    text-shadow: 4rpx 4rpx 0rpx rgba(255, 255, 255, 0.8);
  }
}

.route-list {
  flex: 1;
  padding: 30rpx; 
  box-sizing: border-box;
}

.route-card-container {
  position: relative;
  width: 100%;
  height: 320rpx;
  margin-bottom: 60rpx;
  display: flex;
  align-items: flex-end;
}

.art-img {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  // 改为硬阴影
  filter: drop-shadow(6rpx 10rpx 0rpx rgba(0,0,0,0.15));
  
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
  height: 270rpx;
  border-radius: 40rpx 60rpx 45rpx 55rpx; // 使用不规则圆角
  border: 5rpx solid #222; // 增加黑边
  box-shadow: 12rpx 12rpx 0rpx rgba(0,0,0,0.1); // 增加厚重阴影
  overflow: hidden;
  
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
  padding-left: 270rpx; 
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
        font-size: 38rpx; 
        font-weight: 900; 
        color: #222; 
        letter-spacing: 2rpx;
        font-family: 'RuilingTi', sans-serif !important; // 使用新字体
      }
      .arrow-double { 
        font-size: 32rpx; 
        color: #222; 
        margin-left: 10rpx;
        font-weight: 900;
      }
    }
    
    .route-desc {
      font-size: 24rpx;
      color: #444;
      line-height: 1.4;
      font-weight: 800; // 调粗一点，配合整体插画风格
      font-family: 'RuilingTi', sans-serif !important; // 使用新字体
      padding-right: 90rpx; 
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      letter-spacing: 1rpx;
    }
  }
}

.explore-side {
  position: absolute;
  right: -30rpx; 
  top: 0;
  bottom: 0;
  width: 180rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  
  .circle-btn {
    width: 120rpx;
    height: 120rpx;
    background: linear-gradient(135deg, #FFB800 0%, #FF8A00 100%);
    border-radius: 50%;
    border: 5rpx solid #222; // 增加描边
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 8rpx 8rpx 0rpx rgba(0, 0, 0, 0.15); // 改为插画硬阴影
    margin-right: 20rpx;
    
    .btn-text {
      font-size: 28rpx;
      font-weight: 900;
      color: #fff;
      font-family: 'RuilingTi', sans-serif !important;
      line-height: 1.1;
      text-align: center;
      width: 70rpx; // 强制两行
      word-break: break-all;
    }
    
    &:active {
      transform: scale(0.9) rotate(-10deg);
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
