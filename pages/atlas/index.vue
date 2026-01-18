<template>
  <view class="container">
    <!-- 分类切换 Tabs -->
    <scroll-view class="category-tabs-scroll" scroll-x :show-scrollbar="false">
      <view class="category-tabs">
        <view 
          v-for="(tab, key) in categories" 
          :key="key" 
          :class="['tab', activeCat === key ? 'active' : '']"
          @click="handleTabChange(key)"
        >
          {{ tab.name }}
        </view>
      </view>
    </scroll-view>

    <!-- 图鉴主体区域：可缩放/滚动的地图区域 -->
    <scroll-view 
      scroll-x 
      scroll-y 
      class="atlas-scroll-view"
      :scroll-top="scrollTop"
    >
      <view class="map-content">
        <!-- 底图：根据打卡情况决定分类地图颜色 -->
        <image
          class="bg-map"
          :src="isCategoryCompleted ? currentCatData.map : currentCatData.map_bw"
          mode="widthFix"
        ></image>
        
        <!-- 景点画框组合：容器包含框和图 -->
        <view 
          class="poi-frame-container"
          v-for="(item, name) in currentCatData.items" 
          :key="name"
          :data-name="name"
          :style="{
            top: item.top + 'rpx', 
            left: item.left + 'rpx',
            width: (item.width || 180) + 'rpx'
          }"
          @click="showCheckIn(name)"
        >
          <!-- 1. 画框背景 -->
          <image
            class="frame-img"
            :src="item.frame"
            mode="widthFix"
          ></image>
          
          <!-- 2. 景点图标内容 -->
          <view class="poi-content">
            <image
              :class="['poi-img', isCheckedIn(name) ? '' : 'grayscale']"
              :src="item.icon"
              mode="aspectFit"
            ></image>
          </view>
          
          <!-- 3. 名称标签 -->
          <view class="poi-label" v-if="isCheckedIn(name)">
            <text>{{ name }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <!-- 顶部进度悬浮条 -->
    <view class="progress-bar-floating">
      <image class="atlas-icon" :src="assets.atlas.atlasIcon" mode="aspectFit"></image>
      <view class="progress-text">
        <text class="title">{{ currentCatData.name }}图鉴收集</text>
        <text class="count">{{ completedCount }}/{{ totalCount }}</text>
      </view>
    </view>

    <!-- 打卡弹窗 -->
    <view class="modal-mask" v-if="showingModal" @click="showingModal = false">
      <view class="modal-content" @click.stop>
        <text class="modal-title">发现新地点：{{ selectedItem }}</text>
        <view class="checkin-btn" @click="handleCheckIn">立即打卡</view>
      </view>
    </view>

    <!-- 自定义底部导航 -->
    <CustomTabBar activePath="pages/atlas/index" />
  </view>
</template>

<script>
import CustomTabBar from '@/components/CustomTabBar.vue'
import { ASSETS_CONFIG } from '@/utils/assets-config.js'

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      assets: ASSETS_CONFIG,
      activeCat: 'history', 
      showingModal: false,
      selectedItem: '',
      scrollTop: 0,
      checkInData: {},
      categories: {}
    }
  },
  created() {
    this.initCategories();
  },
  computed: {
    currentCatData() {
      return this.categories[this.activeCat] || this.categories.history;
    },
    completedCount() {
      return (this.checkInData[this.activeCat] || []).length;
    },
    totalCount() {
      return this.currentCatData ? Object.keys(this.currentCatData.items).length : 0;
    },
    isCategoryCompleted() {
      return this.completedCount === this.totalCount && this.totalCount > 0;
    }
  },
  onLoad() {
    this.loadCheckInData();
  },
  onShow() {
    uni.hideTabBar();
  },
  methods: {
    initCategories() {
      // 切换回云存储路径，确保从云端获取资源
      const CLOUD_BASE = this.assets.CLOUD_BASE_URL;
      const H_BASE = CLOUD_BASE + 'atlas/history/';
      const B_BASE = CLOUD_BASE + 'atlas/binhai/';
      const D_BASE = CLOUD_BASE + 'atlas/dengshan/';
      const W_BASE = CLOUD_BASE + 'atlas/western/';
      const C_BASE = CLOUD_BASE + 'atlas/coffee/';
      
      this.categories = {
        history: {
          name: '老街',
          map: H_BASE + 'map.png',
          map_bw: H_BASE + 'map_bw.png',
          items: {
            '荔枝公园': { top: 180, left: 60, width: 230, frame: H_BASE+'08_lizhigongyuan_frame.png', icon: H_BASE+'08_lizhigongyuan_pic.png' },
            '育才一小': { top: 160, left: 450, width: 220, frame: H_BASE+'03_yucai_frame.png', icon: H_BASE+'03_yucai_pic.png' },
            '南玻集团': { top: 400, left: 100, width: 240, frame: H_BASE+'02_nanbo_frame.png', icon: H_BASE+'02_nanbo_pic.png' },
            'G&G': { top: 380, left: 460, width: 230, frame: H_BASE+'04_gg_frame.png', icon: H_BASE+'04_gg_pic.png' },
            '水湾村史馆': { top: 620, left: 70, width: 220, frame: H_BASE+'06_shuiwancunshiguan_frame.png', icon: H_BASE+'06_shuiwancunshiguan_pic.png' },
            '海滨花园': { top: 600, left: 480, width: 220, frame: H_BASE+'10_haibinhuayuan_frame.png', icon: H_BASE+'10_haibinhuayuan_pic.png' },
            '水湾源华': { top: 850, left: 90, width: 230, frame: H_BASE+'05_shuiwanyuanhua_frame.png', icon: H_BASE+'05_shuiwanyuanhua_pic.png' },
            '南海意库': { top: 830, left: 470, width: 230, frame: H_BASE+'11_yiku_frame.png', icon: H_BASE+'11_yiku_pic.png' },
            '水湾炮楼': { top: 1080, left: 60, width: 220, frame: H_BASE+'07_shuiwanpaolou_frame.png', icon: H_BASE+'07_shuiwanpaolou_pic.png' },
            '空谈误国': { top: 1060, left: 450, width: 230, frame: H_BASE+'01_biaoyupai_frame.png', icon: H_BASE+'01_biaoyupai_pic.png' }
          }
        },
        binhai: {
          name: '滨海',
          map: B_BASE + 'map.png',
          map_bw: B_BASE + 'map_bw.png',
          items: {
            '明华轮': { top: 120, left: 245, width: 260, frame: B_BASE+'11_minghualun_frame.png', icon: B_BASE+'11_minghualun_pic.png' },
            '碧涛苑': { top: 380, left: 50, width: 240, frame: B_BASE+'16_bitaoyuan_frame.png', icon: B_BASE+'16_bitaoyuan_pic.png' },
            '女娲像': { top: 410, left: 460, width: 230, frame: B_BASE+'12_nvwaxiang_frame.png', icon: B_BASE+'12_nvwaxiang_pic.png' },
            '海上世界': { top: 680, left: 60, width: 240, frame: B_BASE+'13_haishangshijie_frame.png', icon: B_BASE+'13_haishangshijie_pic.png' },
            '南海酒店': { top: 710, left: 450, width: 250, frame: B_BASE+'15_nanhaijiudian_frame.png', icon: B_BASE+'15_nanhaijiudian_pic.png' }
          }
        },
        dengshan: {
          name: '登山',
          map: D_BASE + 'map.png',
          map_bw: D_BASE + 'map_bw.png',
          items: {
            '时间标语': { top: 250, left: 235, width: 280, frame: D_BASE+'17_shijianbiaoyu_frame.png', icon: D_BASE+'17_shijianbiaoyu_pic.png' },
            '微波山': { top: 580, left: 225, width: 300, frame: D_BASE+'18_weiboshan_frame.png', icon: D_BASE+'18_weiboshan_pic.png' },
            '招商局历史博物馆': { top: 910, left: 240, width: 320, frame: D_BASE+'19_zhaoshangjulishi_frame.png', icon: D_BASE+'19_zhaoshangjulishi_pic.png' }
          }
        },
        western: {
          name: '西餐',
          map: this.assets.atlas.western.map,
          map_bw: this.assets.atlas.western.mapBw,
          items: {
            'doors': { top: 250, left: 420, width: 210, frame: W_BASE+'doors_frame.png', icon: W_BASE+'doors.png' },
            'minimal': { top: 420, left: 120, width: 230, frame: W_BASE+'minimal_frame.png', icon: W_BASE+'minimal.png' },
            'madloba': { top: 400, left: 580, width: 220, frame: W_BASE+'madloba_frame.png', icon: W_BASE+'madloba.png' },
            'the_flames': { top: 580, left: 380, width: 230, frame: W_BASE+'the_flames_frame.png', icon: W_BASE+'the_flames.png' },
            '宝可多': { top: 800, left: 350, width: 220, frame: W_BASE+'宝可多_frame.png', icon: W_BASE+'宝可多.png' },
            'commune': { top: 850, left: 100, width: 230, frame: W_BASE+'commune_frame.png', icon: W_BASE+'commune.png' },
            'baker': { top: 820, left: 600, width: 220, frame: W_BASE+'baker_frame.png', icon: W_BASE+'baker.png' },
            'Gecko Pub': { top: 1050, left: 520, width: 250, frame: W_BASE+'壁虎餐厅_frame.png', icon: W_BASE+'Gecko Pub.png' },
            'alla': { top: 1080, left: 120, width: 250, frame: W_BASE+'alla_frame.png', icon: W_BASE+'alla.png' }
          }
        },
        coffee: {
          name: '咖啡',
          map: this.assets.CLOUD_BASE_URL + 'atlas/coffee/map.png',
          map_bw: this.assets.CLOUD_BASE_URL + 'atlas/coffee/map_bw.png',
          items: {
            '正在生活': { top: 300, left: 450, width: 210, frame: C_BASE+'01_zhengzaishenghuo_frame.png', icon: C_BASE+'01_zhengzaishenghuo_pic.png' },
            '绿木': { top: 420, left: 120, width: 200, frame: C_BASE+'02_greenwood_frame.png', icon: C_BASE+'02_greenwood_pic.png' },
            'JOJO': { top: 400, left: 580, width: 220, frame: C_BASE+'03_jojo_frame.png', icon: C_BASE+'03_jojo_pic.png' },
            '查理': { top: 580, left: 380, width: 200, frame: C_BASE+'04_chali_frame.png', icon: C_BASE+'04_chali_pic.png' },
            '山池': { top: 720, left: 580, width: 230, frame: C_BASE+'08_shanchi_frame.png', icon: C_BASE+'08_shanchi_pic.png' },
            'NewPark': { top: 750, left: 150, width: 210, frame: C_BASE+'06_newpark_frame.png', icon: C_BASE+'06_newpark_pic.png' },
            'KUDDO': { top: 920, left: 420, width: 210, frame: C_BASE+'09_kuddo_frame.png', icon: C_BASE+'09_kuddo_pic.png' },
            '艾米丽': { top: 950, left: 100, width: 210, frame: C_BASE+'10_emily_frame.png', icon: C_BASE+'10_emily_pic.png' },
            'Wavve': { top: 1080, left: 250, width: 190, frame: C_BASE+'07_wavve_frame.png', icon: C_BASE+'07_wavve_pic.png' },
            'NewPark C': { top: 1120, left: 550, width: 210, frame: C_BASE+'05_newparkcoffee_frame.png', icon: C_BASE+'05_newparkcoffee_pic.png' }
          }
        }
      };
    },
    handleTabChange(key) {
      this.activeCat = key;
      this.scrollTop = 0;
    },
    loadCheckInData() {
      const data = uni.getStorageSync('shekou_checkin');
      this.checkInData = data || { history: [], binhai: [], dengshan: [], coffee: [], western: [] };
    },
    isCheckedIn(name) {
      return (this.checkInData[this.activeCat] || []).includes(name);
    },
    showCheckIn(name) {
      if (this.isCheckedIn(name)) return;
      this.selectedItem = name;
      this.showingModal = true;
    },
    handleCheckIn() {
      if (!this.checkInData[this.activeCat]) {
        this.checkInData[this.activeCat] = [];
      }
      this.checkInData[this.activeCat].push(this.selectedItem);
      uni.setStorageSync('shekou_checkin', this.checkInData);
      
      this.showingModal = false;
      uni.showToast({ title: '点亮图鉴！', icon: 'success' });
      
      if (this.isCategoryCompleted) {
        setTimeout(() => {
          uni.showModal({
            title: '成就达成！',
            content: `你已点亮所有${this.currentCatData.name}图鉴，地图已重现光彩！`,
            showCancel: false
          });
        }, 1000);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #FFF9E6;
  display: flex;
  flex-direction: column;
}

.category-tabs-scroll {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 249, 230, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
  white-space: nowrap;
  
  /* 隐藏滚动条 */
  ::-webkit-scrollbar {
    display: none;
    width: 0 !important;
    height: 0 !important;
    -webkit-appearance: none;
    background: transparent;
  }
}

.category-tabs {
  display: flex;
  padding: 30rpx 40rpx;
  gap: 24rpx;
  align-items: center;
  
  .tab {
    flex-shrink: 0;
    padding: 16rpx 42rpx;
    background: #fff;
    border-radius: 40rpx;
    font-size: 28rpx;
    color: #888;
    box-shadow: 0 4rpx 12rpx rgba(0,0,0,0.05);
    transition: all 0.3s;
    line-height: 1.2;
    
    &.active {
      background: #FFCB32;
      color: #333;
      font-weight: 800;
      transform: scale(1.05);
      box-shadow: 0 6rpx 20rpx rgba(255, 203, 50, 0.4);
    }
  }
}

.progress-bar-floating {
  position: fixed;
  top: 145rpx;
  left: 40rpx;
  right: 40rpx;
  background: rgba(255, 255, 255, 0.95);
  padding: 24rpx 40rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 12rpx 35rpx rgba(0,0,0,0.08);
  z-index: 90;
  
  .atlas-icon {
    width: 55rpx;
    height: 55rpx;
    margin-right: 20rpx;
  }
  
  .progress-text {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title { font-size: 30rpx; font-weight: bold; color: #333; }
    .count { font-size: 28rpx; font-weight: 800; color: #FFCB32; }
  }
}

.atlas-scroll-view {
  flex: 1;
  width: 100%;
  background-color: #f8f8f8; /* 兜底背景色，与地图风格一致 */
}

.map-content {
  position: relative;
  width: 750rpx;
  min-height: 100%;
  overflow: hidden; /* 防止图标溢出地图区域 */
}

.bg-map {
  width: 750rpx;
  display: block;
  /* 确保地图至少占满屏幕高度，避免留白 */
  min-height: 100vh;
}

.poi-frame-container {
  position: absolute;
  transition: opacity 0.3s;
  z-index: 10;
  
  .frame-img {
    width: 100%;
    height: auto;
    display: block;
    filter: drop-shadow(0 15rpx 25rpx rgba(0,0,0,0.2));
  }
  
  .poi-content {
    position: absolute;
    top: 12%;
    left: 12%;
    width: 76%;
    height: 76%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    
    .poi-img {
      width: 100%;
      height: 100%;
      
      &.grayscale {
        filter: grayscale(100%);
        opacity: 0.6;
      }
    }
  }
  
  .poi-label {
    position: absolute;
    bottom: -35rpx;
    left: 50%;
    transform: translateX(-50%);
    background: #333;
    color: #fff;
    padding: 4rpx 20rpx;
    border-radius: 20rpx;
    font-size: 20rpx;
    font-weight: bold;
    white-space: nowrap;
    box-shadow: 0 6rpx 15rpx rgba(0,0,0,0.2);
  }
}

.modal-mask {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 520rpx;
  background: #fff;
  border-radius: 48rpx;
  padding: 70rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 30rpx 80rpx rgba(0,0,0,0.3);
  
  .modal-title {
    font-size: 34rpx;
    font-weight: 800;
    color: #333;
    margin-bottom: 60rpx;
    text-align: center;
  }
  
  .checkin-btn {
    background: #FFCB32;
    color: #000;
    padding: 26rpx 100rpx;
    border-radius: 60rpx;
    font-weight: 800;
    font-size: 32rpx;
    box-shadow: 0 15rpx 30rpx rgba(255, 203, 50, 0.4);
    
    &:active { transform: scale(0.95); }
  }
}
</style>
