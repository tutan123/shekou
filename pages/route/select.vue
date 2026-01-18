<template>
  <view class="container">
    <!-- 顶部导航栏 -->
    <view class="header animate-slide-down" :style="{ paddingTop: statusBarHeight + 'px' }">
      <SafeImage class="header-bg-img" :src="assets.route.headerBgMap" mode="aspectFill">
        <template #error>
          <view class="error-placeholder">
            <text>🎯 路线选择背景加载失败</text>
            <text>{{ assets.route.headerBgMap }}</text>
          </view>
        </template>
      </SafeImage>
      <view class="back-btn" :style="{ top: (statusBarHeight + 10) + 'px' }" @click="goBack">←</view>
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
      statusBarHeight: 0,
      routes: [
        {
          id: 'laojie',
          name: '老街路线',
          desc: '蛇口老街漫步路线，从时代标签启程，经工业旧址、\n文创地标与人文景点，尽览开拓过往与诗意山海。',
          bg: ASSETS_CONFIG.route.cardBg1,
          artImg: ASSETS_CONFIG.route.oldstreetShip,
          path: '/pages/route/detail?id=laojie'
        },
        {
          id: 'dengshan',
          name: '登山路线',
          desc: '从 "时间就是金钱，效率就是生命"\n标语牌起步，沿微波山步道缓步登高，\n山海相伴，终点抵达招商局历史博物馆。',
          bg: ASSETS_CONFIG.route.cardBg2,
          artImg: ASSETS_CONFIG.route.mountainArt,
          path: '/pages/route/detail?id=dengshan'
        },
        {
          id: 'binhai',
          name: '滨海路线',
          desc: '从海上世界明华轮启航，经女娲补天雕像、\n文化艺术中心，再到南海酒店，\n一路海风相伴，尽览蛇口滨海风情。',
          bg: ASSETS_CONFIG.route.cardBg3,
          artImg: ASSETS_CONFIG.route.seaArt,
          path: '/pages/route/detail?id=binhai'
        },
        {
          id: 'xican',
          name: '西餐路线',
          desc: '蛇口西餐线条多国风味：宝可多、汉堡、意式披萨、\n格鲁吉亚菜，多种选择，家家有惊喜。',
          bg: ASSETS_CONFIG.route.cardBg2,
          artImg: ASSETS_CONFIG.route.westernPizza,
          path: '/pages/route/detail?id=xican'
        },
        {
          id: 'kafei',
          name: '咖啡路线',
          desc: '蛇口咖啡漫游路线，是一场与香气的温柔邂逅。\n串联十家特色咖啡馆，慢品间，\n便读懂了蛇口独有的惬意与浪漫。',
          bg: ASSETS_CONFIG.route.cardBg3,
          artImg: ASSETS_CONFIG.route.coffeeTools,
          path: '/pages/route/detail?id=kafei'
        }
      ]
    }
  },
  onLoad() {
    // 获取状态栏高度
    const info = uni.getSystemInfoSync();
    this.statusBarHeight = info.statusBarHeight || 0;
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
  height: 160rpx; // 调小一点，大约是字体高度的2-3倍加上状态栏
  padding: 0rpx;
  display: flex;
  align-items: center;
  background-color: #FEF9E7;
  position: relative;
  z-index: 100;
  overflow: hidden;
  border-bottom: 2rpx solid rgba(0,0,0,0.05); // 移除粗黑边框，改为浅色线
  
  .header-bg-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw; // 确保撑满屏幕宽度
    height: 100%;
    z-index: -1;
    transform: none;
  }
  
  .back-btn { 
    width: 70rpx;
    height: 70rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40rpx; 
    color: #222; 
    font-weight: 900; 
    position: absolute;
    left: 20rpx;
    // top 由 style 动态计算
    z-index: 10;
    background: rgba(255,255,255,0.8); // 增加背景不透明度
    border-radius: 50%;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.1); // 改为阴影而非黑边
  }
  
  .title-container {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 10rpx; // 稍微向下偏移一点
  }
  
  .title { 
    font-size: 42rpx; 
    font-weight: 900; 
    color: #222; 
    letter-spacing: 4rpx;
    font-family: 'RuilingTi', sans-serif !important;
    // 增加白色描边/发光，确保在地图背景上清晰
    text-shadow: 0 0 10rpx #fff, 0 0 10rpx #fff, 0 0 10rpx #fff;
  }
}

.route-list {
  flex: 1;
  padding: 30rpx; 
  padding-top: 40rpx;
  box-sizing: border-box;
}

.route-card-container {
  position: relative;
  width: 100%;
  height: 320rpx;
  margin-bottom: 70rpx; // 增加间距
  display: flex;
  align-items: flex-end;
}

.art-img {
  position: absolute;
  z-index: 10;
  pointer-events: none;
  filter: drop-shadow(6rpx 10rpx 0rpx rgba(0,0,0,0.15));
  
  &.laojie {
    width: 360rpx;
    height: 360rpx;
    left: -40rpx;
    top: -70rpx;
  }
  
  &.xican {
    width: 320rpx;
    height: 320rpx;
    left: -20rpx;
    top: -30rpx;
  }
  
  &.dengshan, &.binhai {
    width: 330rpx;
    height: 330rpx;
    left: -20rpx;
    top: -40rpx;
  }
  
  &.kafei {
    width: 320rpx;
    height: 320rpx;
    left: -20rpx;
    top: -20rpx;
  }
}

.route-card-body {
  position: relative;
  width: 100%;
  height: 270rpx;
  border-radius: 40rpx 60rpx 45rpx 55rpx;
  // border: 5rpx solid #222; // 移除黑色边框
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.08); // 改为柔和的阴影
  overflow: visible; // 允许按钮溢出
  
  .card-bg {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: 1;
    border-radius: 35rpx 55rpx 40rpx 50rpx;
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
  align-items: flex-start; // 改为顶部对齐，方便控制文字位置
  padding-top: 30rpx;
  
  .text-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    
    .route-header {
      display: flex;
      align-items: center;
      margin-bottom: 8rpx;
      
      .name { 
        font-size: 38rpx; 
        font-weight: 900; 
        color: #222; 
        letter-spacing: 2rpx;
        font-family: 'RuilingTi', sans-serif !important;
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
      font-weight: 800;
      font-family: 'RuilingTi', sans-serif !important;
      padding-right: 120rpx; // 增加右边距，避免被圆圈挡住
      white-space: pre-wrap; // 支持换行符
      letter-spacing: 1rpx;
    }
  }
}

.explore-side {
  position: absolute;
  right: -35rpx; // 向右移动（相对于右边界向外偏移）
  bottom: 35rpx; // 向上移动
  width: 150rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  box-sizing: border-box;
  z-index: 20;
  
  .circle-btn {
    width: 125rpx;
    height: 125rpx;
    background: linear-gradient(135deg, #FFB800 0%, #FF8A00 100%);
    border-radius: 50%;
    // border: 5rpx solid #222; // 同样移除按钮的粗黑边框
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8rpx 20rpx rgba(255, 138, 0, 0.4); // 改为彩色阴影
    
    .btn-text {
      font-size: 28rpx;
      font-weight: 900;
      color: #fff;
      font-family: 'RuilingTi', sans-serif !important;
      line-height: 1.1;
      text-align: center;
      width: 60rpx;
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
