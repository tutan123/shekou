<template>
  <view class="container">
    <view class="header animate-slide-down">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">路线选择</text>
    </view>
    
    <scroll-view scroll-y class="route-list">
      <view 
        v-for="(route, index) in routes" 
        :key="index" 
        class="route-card-wrapper animate-fade-in" 
        :style="{animationDelay: index * 0.1 + 's'}"
        @click="goRouteDetail(route)"
      >
        <view class="route-card">
          <view class="card-left">
            <image class="route-img" :src="route.img" mode="aspectFill"></image>
            <view class="img-overlay"></view>
          </view>
          <view class="card-content">
            <view class="route-title">
              <text class="cn">{{ route.name }}</text>
              <text class="arrow">≫</text>
            </view>
            <view class="route-desc">{{ route.desc }}</view>
            
            <!-- 艺术化点状装饰 -->
            <view class="path-decoration">
              <view v-for="i in 6" :key="i" class="dot" :style="{opacity: 1 - i*0.15}"></view>
            </view>
          </view>
          <view class="card-right">
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
          img: '/static/images/laojie_map.png' // 暂时使用地图底图作为封面
        },
        {
          id: 'xican',
          name: '西餐路线',
          desc: '蛇口西餐线条国际风味：宝可多、汉堡、意式披萨、格鲁吉亚菜，多种选择，家家有惊喜。',
          img: '/static/images/xican_map.png'
        },
        {
          id: 'kafei',
          name: '咖啡路线',
          desc: '蛇口咖啡漫游路线，是一场与香气的温柔邂逅。串联十家特色咖啡馆，慢品间，便读懂了蛇口独有的惬意与浪漫。',
          img: '/static/images/kafei_map.png'
        },
        {
          id: 'binhai',
          name: '滨海路线',
          desc: '沿着蜿蜒海岸线，感受海风轻抚，打卡艺术中心与滨海广场，领略蛇口国际化的滨海魅力。',
          img: '/static/images/binhai_map.png'
        },
        {
          id: 'dengshan',
          name: '登山路线',
          desc: '登上大南山，俯瞰蛇口全景与深圳湾大桥，在绿意盎然中寻找城市的宁静角落。',
          img: '/static/images/dengshan_map.png'
        }
      ]
    }
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
    goRouteDetail(route) {
      uni.navigateTo({
        url: `/pages/route/detail?id=${route.id}&name=${route.name}`
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
  
  .back-btn { font-size: 40rpx; margin-right: 24rpx; color: #333; }
  .title { font-size: 36rpx; font-weight: 800; color: #333; }
}

.route-list {
  flex: 1;
  padding: 20rpx 30rpx;
  box-sizing: border-box;
}

.route-card-wrapper {
  margin-bottom: 40rpx;
}

.route-card {
  background: #FFCC00;
  border-radius: 40rpx;
  display: flex;
  padding: 24rpx;
  box-shadow: 0 16rpx 40rpx rgba(255, 204, 0, 0.25);
  position: relative;
  overflow: hidden;
  border: 4rpx solid #fff;
  
  .card-left {
    width: 220rpx;
    height: 200rpx;
    background: #fff;
    border-radius: 30rpx;
    flex-shrink: 0;
    margin-right: 24rpx;
    overflow: hidden;
    position: relative;
    
    .route-img { width: 100%; height: 100%; }
    .img-overlay {
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.05);
    }
  }
  
  .card-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding-right: 110rpx;
    
    .route-title {
      display: flex;
      align-items: center;
      gap: 10rpx;
      margin-bottom: 8rpx;
      .cn { font-size: 36rpx; font-weight: 900; color: #333; }
      .arrow { font-size: 24rpx; color: #333; opacity: 0.6; }
    }
    
    .route-desc {
      font-size: 22rpx;
      color: #555;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 3;
      overflow: hidden;
      font-weight: 500;
    }
    
    .path-decoration {
      display: flex;
      gap: 10rpx;
      margin-top: 16rpx;
      .dot {
        width: 8rpx; height: 8rpx;
        background: #fff;
        border-radius: 50%;
      }
    }
  }
  
  .card-right {
    position: absolute;
    right: 24rpx;
    bottom: 24rpx;
    
    .explore-btn {
      background: #0088CC;
      color: #fff;
      font-size: 22rpx;
      font-weight: 800;
      padding: 14rpx 28rpx;
      border-radius: 30rpx;
      box-shadow: 0 6rpx 12rpx rgba(0, 136, 204, 0.2);
    }
  }
}

.bottom-padding { height: 60rpx; }

@keyframes slideDown {
  from { transform: translateY(-40rpx); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20rpx); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-slide-down { animation: slideDown 0.6s ease-out both; }
.animate-fade-in { animation: fadeIn 0.6s ease-out both; }
</style>
