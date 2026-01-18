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
      <view class="map-content" @tap="onAtlasMapClick">
        <!-- 底图：根据打卡情况决定分类地图颜色 -->
        <image
          class="bg-map"
          :src="isCategoryCompleted ? currentCatData.map : currentCatData.map_bw"
          mode="widthFix"
          style="pointer-events: none;"
        ></image>
        
        <!-- 景点画框组合：容器包含框和图 -->
        <view
          class="poi-frame-container"
          v-for="(item, name) in displayItems"
          :key="name"
          :data-name="name"
          :style="{
            top: item.top + 'rpx',
            left: item.left + 'rpx',
            width: (item.width || 180) + 'rpx'
          }"
          @click.stop="showCheckIn(name)"
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
import { CATEGORIES } from '@/utils/poi-config.js'

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
      categories: CATEGORIES
    }
  },
  computed: {
    currentCatData() {
      return this.categories[this.activeCat] || this.categories.history;
    },
    displayItems() {
      if (!this.currentCatData || !this.currentCatData.items) return {};
      const filtered = {};
      Object.keys(this.currentCatData.items).forEach(name => {
        const item = this.currentCatData.items[name];
        // 严格过滤：只包含有画框和图标定义的正式图鉴项
        if (item.frame && item.icon) {
          filtered[name] = item;
        }
      });
      return filtered;
    },
    completedCount() {
      const completedNames = this.checkInData[this.activeCat] || [];
      const displayNames = Object.keys(this.displayItems);
      // 只统计属于正式图鉴项的已完成数量
      return completedNames.filter(name => displayNames.includes(name)).length;
    },
    totalCount() {
      return Object.keys(this.displayItems).length;
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
    this.loadCheckInData(); // 每次显示页面时重新加载打卡数据
  },
  methods: {
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
    },
    onAtlasMapClick(e) {
      console.log('✅ onAtlasMapClick 触发!', e);
      
      const query = uni.createSelectorQuery().in(this);
      query.select('.bg-map').boundingClientRect(data => {
        if (!data) return;
        
        // 获取点击位置相对于视口的坐标
        let clientX = 0;
        let clientY = 0;
        
        if (e.detail && (e.detail.x || e.detail.clientX)) {
          clientX = e.detail.x || e.detail.clientX;
          clientY = e.detail.y || e.detail.clientY;
        } else if (e.touches && e.touches[0]) {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else if (e.changedTouches && e.changedTouches[0]) {
          clientX = e.changedTouches[0].clientX;
          clientY = e.changedTouches[0].clientY;
        }
        
        // 计算相对于地图容器左上角的坐标
        const x = clientX - data.left;
        const y = clientY - data.top;
        
        const leftPercent = Math.round((x / data.width) * 100);
        const topPercent = Math.round((y / data.height) * 100);
        
        const rpxX = Math.round((x / data.width) * 750);
        const rpxY = Math.round(y * (750 / data.width));
        
        const result = `left=${leftPercent}%, top=${topPercent}%`;
        const rpxResult = `RPX: ${rpxX}, ${rpxY}`;
        
        console.log(`🗺️ [${this.activeCat}] 修正后的图鉴地图点击坐标: ${result} | ${rpxResult}`);
      }).exec();
    },
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  background-color: #FFCB32;
  display: flex;
  flex-direction: column;
}

.category-tabs-scroll {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background: rgba(255, 203, 50, 0.9);
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
  display: block;
  overflow: hidden; 
  pointer-events: auto; /* 显式开启点击 */
}

.bg-map {
  width: 750rpx;
  display: block;
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
