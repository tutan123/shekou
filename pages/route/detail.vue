<template>
  <view class="container" :class="{ 'western-theme': routeId === 'xican' }">
    <!-- 顶部导航 -->
    <view class="custom-nav">
      <view class="back-btn" @click="goBack">←</view>
      <text class="title">{{ routeName }}</text>
    </view>

    <!-- 路线地图区域 -->
    <view class="map-container" :class="{ 'full-map': true }">
      <!-- 动态加载对应线路的地图 -->
      <image class="route-map" :src="mapSrc" mode="widthFix"></image>
      
      <!-- 所有路线的交互区域 -->
      <view v-for="(item, index) in currentRoutePois" :key="index" 
            class="poi-clickable-area" 
            :style="{ top: item.top + '%', left: item.left + '%', width: item.width + 'rpx', height: item.height + 'rpx' }"
            @click="showDetail(item)">
      </view>
    </view>

    <!-- 详情弹窗 -->
    <view v-if="detailVisible" class="detail-popup-mask" @click="hideDetail">
      <view class="detail-popup-content" @click.stop>
        <image class="detail-image" :src="currentPoi.detailImg" mode="widthFix"></image>
        <view class="check-in-btn-container" @click="handleCheckIn">
          <image class="btn-bg" src="/static/route/western/checkin_btn.png" mode="scaleToFill"></image>
          <text class="btn-text">去打卡</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      routeId: '',
      routeName: '',
      mapSrc: '',
      detailVisible: false,
      currentPoi: {},
      // 老街路线
      laojiePois: [
        { id: '01', name: '空谈误国', top: 10, left: 68, width: 190, height: 80, detailImg: '/static/route/laojie/01_biaoyupai_detail.png' },
        { id: '02', name: '南玻集团', top: 7, left: 60, width: 170, height: 80, detailImg: '/static/route/laojie/02_nanbo_detail.png' },
        { id: '03', name: 'K11', top: 20, left: 65, width: 180, height: 80, detailImg: '/static/route/laojie/03_k11_detail.png' },
        { id: '04', name: '创意社区', top: 12, left: 35, width: 180, height: 80, detailImg: '/static/route/laojie/04_gg_detail.png' },
        { id: '05', name: '源华公司', top: 30, left: 68, width: 160, height: 80, detailImg: '/static/route/laojie/05_shuiwanyuanhua_detail.png' },
        { id: '06', name: '村史馆', top: 30, left: 68, width: 160, height: 80, detailImg: '/static/route/laojie/06_shuiwancunshiguan_detail.png' },
        { id: '07', name: '水湾炮楼', top: 38, left: 58, width: 150, height: 80, detailImg: '/static/route/laojie/07_shuiwanpaolou_detail.png' },
        { id: '08', name: '荔枝公园', top: 40, left: 15, width: 190, height: 80, detailImg: '/static/route/laojie/08_lizhigongyuan_detail.png' },
        { id: '09', name: '南海意库', top: 38, left: 45, width: 200, height: 80, detailImg: '/static/route/laojie/09_nanhaiyiku_detail.png' },
        { id: '10', name: '海滨花园', top: 48, left: 65, width: 180, height: 80, detailImg: '/static/route/laojie/10_haibinhuayuan_detail.png' }
      ],
      // 登山路线
      dengshanPois: [
        { id: '17', name: '时间就是金钱', top: 60, left: 15, width: 180, height: 80, detailImg: '/static/route/dengshan/17_shijianbiaoyu_detail.png' },
        { id: '18', name: '微波山', top: 32, left: 55, width: 180, height: 80, detailImg: '/static/route/dengshan/18_weiboshan_detail.png' },
        { id: '19', name: '历史博物馆', top: 80, left: 30, width: 220, height: 80, detailImg: '/static/route/dengshan/19_zhaoshangjulishi_detail.png' }
      ],
      // 滨海路线
      binhaiPois: [
        { id: '11', name: '明华轮', top: 55, left: 38, width: 210, height: 80, detailImg: '/static/route/binhai/11_minghualun_detail.png' },
        { id: '12', name: '女娲像', top: 45, left: 52, width: 180, height: 80, detailImg: '/static/route/binhai/12_nvwaxiang_detail.png' },
        { id: '13', name: '艺术中心', top: 68, left: 60, width: 230, height: 80, detailImg: '/static/route/binhai/13_haishangshijie_detail.png' },
        { id: '15', name: '南海酒店', top: 65, left: 35, width: 190, height: 80, detailImg: '/static/route/binhai/15_nanhaijiudian_detail.png' },
        { id: '16', name: '碧涛苑', top: 48, left: 65, width: 180, height: 80, detailImg: '/static/route/binhai/16_bitaoyuan_detail.png' }
      ],
      // 西餐路线坐标点映射 (百分比定位)
      westernPois: [
        { id: '00', name: 'Benji Bakery', top: 40, left: 8, width: 140, height: 140, detailImg: '/static/route/western/00_benji_detail.png' },
        { id: '01', name: 'Birol Bistronomy', top: 85, left: 52, width: 220, height: 100, detailImg: '/static/route/western/01_birol_detail.png' },
        { id: '02', name: 'Minimal', top: 82, left: 16, width: 140, height: 120, detailImg: '/static/route/western/02_minimal_detail.png' },
        { id: '03', name: 'Alla Torre', top: 52, left: 8, width: 140, height: 140, detailImg: '/static/route/western/03_alla_detail.png' },
        { id: '04', name: 'Doors', top: 48, left: 65, width: 140, height: 140, detailImg: '/static/route/western/04_doors_detail.png' },
        { id: '05', name: 'Madloba', top: 68, left: 8, width: 140, height: 140, detailImg: '/static/route/western/05_madloba_detail.png' },
        { id: '06', name: 'Commune', top: 78, left: 68, width: 200, height: 160, detailImg: '/static/route/western/06_commune_detail.png' },
        { id: '07', name: 'Gecko Pub', top: 52, left: 35, width: 180, height: 180, detailImg: '/static/route/western/07_gecko_detail.png' },
        { id: '08', name: 'Baker & Spice', top: 62, left: 70, width: 200, height: 120, detailImg: '/static/route/western/08_baker_detail.png' },
        { id: '09', name: 'The Flames', top: 70, left: 45, width: 180, height: 160, detailImg: '/static/route/western/09_flames_detail.png' }
      ],
      // 咖啡路线
      kafeiPois: [
        { id: '01', name: '正在生活', top: 22, left: 25, width: 180, height: 80, detailImg: '/static/route/coffee/01_zhengzaishenghuo_detail.png' },
        { id: '02', name: '绿木咖啡', top: 35, left: 65, width: 180, height: 80, detailImg: '/static/route/coffee/02_greenwood_detail.png' },
        { id: '03', name: 'JOJO咖啡', top: 45, left: 45, width: 180, height: 80, detailImg: '/static/route/coffee/03_jojo_detail.png' },
        { id: '04', name: '艾米丽咖啡', top: 55, left: 25, width: 180, height: 80, detailImg: '/static/route/coffee/04_emily_detail.png' },
        { id: '05', name: 'KUDDO', top: 65, left: 55, width: 180, height: 80, detailImg: '/static/route/coffee/05_kuddo_detail.png' },
        { id: '06', name: '新公园', top: 75, left: 35, width: 180, height: 80, detailImg: '/static/route/coffee/06_newpark_detail.png' },
        { id: '07', name: 'wavve', top: 85, left: 65, width: 180, height: 80, detailImg: '/static/route/coffee/07_wavve_detail.png' },
        { id: '08', name: '365日', top: 15, left: 45, width: 180, height: 80, detailImg: '/static/route/coffee/08_365_detail.png' },
        { id: '09', name: '山池', top: 25, left: 75, width: 180, height: 80, detailImg: '/static/route/coffee/09_shanchi_detail.png' }
      ]
    }
  },
  computed: {
    currentRoutePois() {
      const poiMap = {
        'laojie': this.laojiePois,
        'dengshan': this.dengshanPois,
        'binhai': this.binhaiPois,
        'xican': this.westernPois,
        'kafei': this.kafeiPois
      };
      return poiMap[this.routeId] || [];
    }
  },
  onLoad(options) {
    this.routeId = options.id || 'laojie';
    this.routeName = options.name || '路线详情';
    this.setMapSrc();
  },
  methods: {
    setMapSrc() {
      const mapMap = {
        'kafei': '/static/route/coffee/咖啡地图.png',
        'binhai': '/static/route/binhai/滨海地图.png',
        'dengshan': '/static/route/dengshan/登山地图.png',
        'laojie': '/static/route/laojie/老街地图.png',
        'xican': '/static/route/western/西餐路线小地图.png'
      };
      this.mapSrc = mapMap[this.routeId] || mapMap['laojie'];
    },
    goBack() {
      uni.navigateBack();
    },
    showDetail(poi) {
      this.currentPoi = poi;
      this.detailVisible = true;
    },
    hideDetail() {
      this.detailVisible = false;
    },
    handleCheckIn() {
      uni.showToast({
        title: '打卡成功！',
        icon: 'success'
      });
      // 这里可以添加实际的打卡逻辑，比如增加积分或改变状态
      this.detailVisible = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #FFF9E6;
  position: relative;
  display: flex;
  flex-direction: column;
  
  &.western-theme {
    background-color: #003366; 
  }
}

.custom-nav {
  position: absolute;
  top: 80rpx;
  left: 30rpx;
  right: 30rpx;
  height: 88rpx;
  display: flex;
  align-items: center;
  z-index: 100;
  
  .back-btn {
    width: 60rpx;
    height: 60rpx;
    background: #fff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
    font-size: 32rpx;
    margin-right: 20rpx;
  }
  
  .title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    text-shadow: 0 2rpx 4rpx rgba(255,255,255,0.8);
  }
  
  // 西餐主题下的标题颜色
  .western-theme & .title {
    color: #fff;
    text-shadow: 0 2rpx 4rpx rgba(0,0,0,0.5);
  }
}

.map-container {
  flex: 1;
  position: relative;
  overflow: hidden;
  
  &.full-map {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #004b91;
  }
  
  .route-map {
    width: 100%;
    height: auto;
  }
  
  .poi-marker {
    position: absolute;
    width: 30rpx;
    height: 30rpx;
    background: #FFCC00;
    border: 6rpx solid #fff;
    border-radius: 50%;
    box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.2);
  }

  .poi-clickable-area {
    position: absolute;
    // background: rgba(255, 255, 255, 0.1); // 调试时取消注释可见点击区域
    z-index: 10;
  }
}

.detail-card {
  height: 500rpx;
  background: #fff;
  border-radius: 60rpx 60rpx 0 0;
  padding: 40rpx;
  box-shadow: 0 -10rpx 30rpx rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 40rpx;
    
    .route-info {
      display: flex;
      flex-direction: column;
      .label { font-size: 24rpx; color: #999; }
      .name { font-size: 40rpx; font-weight: bold; color: #333; }
    }
    
    .progress-text {
      font-size: 24rpx;
      color: #FF9900;
      font-weight: bold;
    }
  }
  
  .poi-list {
    flex: 1;
    .poi-item {
      display: flex;
      align-items: center;
      margin-bottom: 30rpx;
      
      .poi-img-box {
        width: 100rpx;
        height: 100rpx;
        background: #f5f5f5;
        border-radius: 20rpx;
        margin-right: 20rpx;
      }
      
      .poi-info {
        flex: 1;
        .poi-name { font-size: 28rpx; font-weight: bold; display: block; }
        .poi-desc { font-size: 22rpx; color: #999; }
      }
      
      .check-btn {
        background: #FFCC00;
        font-size: 22rpx;
        padding: 10rpx 24rpx;
        border-radius: 30rpx;
        font-weight: bold;
      }
    }
  }
}

.detail-popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.8);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-popup-content {
  width: 85%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .detail-image {
    width: 100%;
    border-radius: 40rpx;
    box-shadow: 0 10rpx 40rpx rgba(0,0,0,0.3);
    display: block;
  }
  
  .check-in-btn-container {
    width: 320rpx;
    height: 96rpx;
    position: absolute;
    bottom: -48rpx; // 居中压在详情卡片底部边缘
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    .btn-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    
    .btn-text {
      position: relative;
      z-index: 2;
      color: #fff;
      font-size: 32rpx;
      font-weight: bold;
      letter-spacing: 4rpx;
    }
    
    &:active {
      transform: translateX(-50%) scale(0.95);
    }
  }
}

@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}

.animate-slide-up {
  animation: slideUp 0.6s ease-out;
}
</style>
