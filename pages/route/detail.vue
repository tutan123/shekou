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
      
      <!-- 所有路线的交互区域和图标 -->
      <view v-for="(item, index) in currentRoutePois" :key="index" 
            class="poi-item-wrapper" 
            :style="{ top: item.top + '%', left: item.left + '%', width: item.width + 'rpx' }"
            @click="showDetail(item)">
        <!-- POI图片 -->
        <image v-if="item.pic" :src="item.pic" class="poi-pic" mode="widthFix"></image>
        <!-- POI标题 -->
        <image v-if="item.titleImg" :src="item.titleImg" class="poi-title-img" mode="widthFix"></image>
      </view>
    </view>

    <!-- 详情弹窗 -->
    <view v-if="detailVisible" class="detail-popup-mask" @click="hideDetail">
      <view class="detail-popup-content" @click.stop>
        <image class="detail-image" :src="currentPoi.detailImg" mode="widthFix"></image>
        <view class="check-in-btn-container" @click="handleCheckIn">
          <image class="btn-bg" :src="assets.route.checkinBtn" mode="scaleToFill"></image>
          <text class="btn-text">去打卡</text>
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
      assets: ASSETS_CONFIG,
      routeId: '',
      routeName: '',
      mapSrc: '',
      detailVisible: false,
      currentPoi: {},
      // 老街路线
      laojiePois: [],
      // 登山路线
      dengshanPois: [],
      // 滨海路线
      binhaiPois: [],
      // 西餐路线坐标点映射 (百分比定位)
      westernPois: [],
      // 咖啡路线
      kafeiPois: []
    }
  },
  created() {
    // 在组件创建时初始化所有 POI 数据
    const baseUrl = this.assets.CLOUD_BASE_URL + 'route/';
    
    // 助手函数：生成完整路径
    const getPaths = (route, fileName, options = { hasPic: true, hasTitle: true, hasDetail: true }) => {
      const paths = {};
      if (options.hasDetail) paths.detailImg = `${baseUrl}${route}/${fileName}_detail.png`;
      if (options.hasPic) paths.pic = `${baseUrl}${route}/${fileName}_pic.png`;
      if (options.hasTitle) paths.titleImg = `${baseUrl}${route}/${fileName}_title.png`;
      
      // 特殊处理：老街 09 的图片名有个 typo
      if (route === 'laojie' && fileName === '09_nanhaiyiku' && options.hasPic) {
        paths.pic = `${baseUrl}laojie/09_nanhaiyiku_piv.png`;
      }
      return paths;
    };

    // 设置各路线配置
    const hasNoTitle = { hasPic: true, hasTitle: false, hasDetail: true };

    this.laojiePois = [
      { id: '01', name: '空谈误国', top: 22, left: 63, width: 220, ...getPaths('laojie', '01_biaoyupai') },
      { id: '02', name: '南玻集团', top: 12, left: 58, width: 180, ...getPaths('laojie', '02_nanbo') },
      { id: '03', name: '育才学校', top: 28, left: 62, width: 180, ...getPaths('laojie', '03_yucai') },
      { id: '04', name: '创意社区', top: 26, left: 32, width: 180, ...getPaths('laojie', '04_gg') },
      { id: '05', name: '源华公司', top: 41, left: 63, width: 160, ...getPaths('laojie', '05_shuiwanyuanhua') },
      { id: '06', name: '村史馆', top: 32, left: 63, width: 160, ...getPaths('laojie', '06_shuiwancunshiguan') },
      { id: '07', name: '水湾炮楼', top: 38, left: 53, width: 150, ...getPaths('laojie', '07_shuiwanpaolou') },
      { id: '08', name: '荔枝公园', top: 40, left: 23, width: 190, ...getPaths('laojie', '08_lizhigongyuan') },
      { id: '09', name: '南海意库', top: 52, left: 42, width: 200, ...getPaths('laojie', '09_nanhaiyiku') },
      { id: '10', name: '海滨花园', top: 50, left: 61, width: 180, ...getPaths('laojie', '10_haibinhuayuan') }
    ];

    this.dengshanPois = [
      { id: '17', name: '时间就是金钱', top: 62, left: 18, width: 200, ...getPaths('dengshan', '17_shijianbiaoyu') },
      { id: '18', name: '微波山', top: 68, left: 32, width: 180, ...getPaths('dengshan', '18_weiboshan') },
      { id: '19', name: '历史博物馆', top: 82, left: 35, width: 220, ...getPaths('dengshan', '19_zhaoshangjulishi') }
    ];

    this.binhaiPois = [
      { id: '11', name: '明华轮', top: 58, left: 36, width: 210, ...getPaths('binhai', '11_minghualun') },
      { id: '12', name: '女娲像', top: 55, left: 62, width: 180, ...getPaths('binhai', '12_nvwaxiang') },
      { id: '13', name: '艺术中心', top: 65, left: 45, width: 230, ...getPaths('binhai', '13_haishangshijie') },
      { id: '14', name: '原耕', top: 72, left: 48, width: 120, ...getPaths('binhai', '14_yuangeng', { hasPic: false, hasTitle: true, hasDetail: false }) },
      { id: '15', name: '南海酒店', top: 68, left: 32, width: 190, ...getPaths('binhai', '15_nanhaijiudian') },
      { id: '16', name: '碧涛苑', top: 52, left: 68, width: 180, ...getPaths('binhai', '16_bitaoyuan') }
    ];

    this.westernPois = [
      { id: '00', name: 'Benji Bakery', top: 42, left: 12, width: 160, ...getPaths('western', '00_benji') },
      { id: '01', name: 'Birol Bistronomy', top: 82, left: 55, width: 200, ...getPaths('western', '01_birol') },
      { id: '02', name: 'Minimal', top: 80, left: 22, width: 160, ...getPaths('western', '02_minimal') },
      { id: '03', name: 'Alla Torre', top: 55, left: 15, width: 160, ...getPaths('western', '03_alla') },
      { id: '04', name: 'Doors', top: 48, left: 68, width: 160, ...getPaths('western', '04_doors') },
      { id: '05', name: 'Madloba', top: 65, left: 12, width: 160, ...getPaths('western', '05_madloba') },
      { id: '06', name: 'Commune', top: 75, left: 62, width: 180, ...getPaths('western', '06_commune') },
      { id: '07', name: 'Gecko Pub', top: 55, left: 38, width: 180, ...getPaths('western', '07_gecko') },
      { id: '08', name: 'Baker & Spice', top: 62, left: 65, width: 180, ...getPaths('western', '08_baker') },
      { id: '09', name: 'The Flames', top: 72, left: 42, width: 180, ...getPaths('western', '09_flames') }
    ];

    this.kafeiPois = [
      { id: '01', name: '正在生活', top: 25, left: 28, width: 180, ...getPaths('coffee', '01_zhengzaishenghuo', hasNoTitle) },
      { id: '02', name: '绿木咖啡', top: 38, left: 62, width: 180, ...getPaths('coffee', '02_greenwood', hasNoTitle) },
      { id: '03', name: 'JOJO咖啡', top: 48, left: 42, width: 180, ...getPaths('coffee', '03_jojo', hasNoTitle) },
      { id: '04', name: '茶力', top: 58, left: 28, width: 180, ...getPaths('coffee', '04_chali', hasNoTitle) },
      { id: '05', name: '新公园咖啡', top: 68, left: 52, width: 180, ...getPaths('coffee', '05_newparkcoffee', hasNoTitle) },
      { id: '06', name: '新公园', top: 78, left: 32, width: 180, ...getPaths('coffee', '06_newpark', hasNoTitle) },
      { id: '07', name: 'wavve', top: 85, left: 62, width: 180, ...getPaths('coffee', '07_wavve', hasNoTitle) },
      { id: '08', name: '山池', top: 18, left: 48, width: 180, ...getPaths('coffee', '08_shanchi', hasNoTitle) },
      { id: '09', name: 'KUDDO', top: 28, left: 72, width: 180, ...getPaths('coffee', '09_kuddo', hasNoTitle) },
      { id: '10', name: '艾米丽', top: 35, left: 15, width: 180, ...getPaths('coffee', '10_emily', hasNoTitle) }
    ];
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
    
    // 根据 ID 写死对应的路线名称，避免编码转换导致的乱码
    const nameMap = {
      'laojie': '老街路线',
      'dengshan': '登山路线',
      'binhai': '滨海路线',
      'xican': '西餐路线',
      'kafei': '咖啡路线'
    };
    this.routeName = nameMap[this.routeId] || options.name || '路线详情';
    
    this.setMapSrc();
  },
  methods: {
    setMapSrc() {
      const mapMap = {
        'kafei': this.assets.route.coffee.map,
        'binhai': this.assets.route.binhai.map,
        'dengshan': this.assets.route.dengshan.map,
        'laojie': this.assets.route.laojie.map,
        'xican': this.assets.route.western.map
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
  
  .poi-item-wrapper {
    position: absolute;
    z-index: 10;
    display: flex;
    flex-direction: column;
    align-items: center;
    transform: translate(-50%, -50%); // 以中心点定位
    
    .poi-pic {
      width: 100%;
      height: auto;
      display: block;
      margin-bottom: 4rpx;
    }
    
    .poi-title-img {
      width: 80%; // 标题通常比图标窄一点
      height: auto;
      display: block;
    }

    &:active {
      transform: translate(-50%, -50%) scale(0.95);
      opacity: 0.8;
    }
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
