<template>
  <view class="container">
    <!-- 分类切换 Tabs -->
    <view class="category-tabs">
      <view 
        v-for="(tab, key) in categories" 
        :key="key" 
        :class="['tab', activeCat === key ? 'active' : '']"
        @click="activeCat = key"
      >
        {{ tab.name }}
      </view>
    </view>

    <!-- 图鉴主体区域：可缩放/滚动的地图区域 -->
    <scroll-view 
      scroll-x 
      scroll-y 
      class="atlas-scroll-view"
    >
      <view class="map-content">
        <!-- 底图：根据打卡情况决定分类地图颜色 -->
        <image 
          class="bg-map" 
          :src="isCategoryCompleted ? currentCatData.map : currentCatData.map_bw" 
          mode="widthFix"
        ></image>
        
        <!-- 景点画框：绝对定位在地图上 -->
        <view 
          class="poi-frame-container"
          v-for="(item, name) in currentCatData.items" 
          :key="name"
          :style="{
            top: item.top + '%',
            left: item.left + '%',
            width: (item.width || 180) + 'rpx'
          }"
          @click="showCheckIn(name)"
        >
          <!-- 画框背景 -->
          <image 
            class="frame-img" 
            :src="'/static/atlas/frames/frame_' + (item.frame || 1) + '.png'" 
            mode="widthFix"
          ></image>
          
          <!-- 景点图片内容 -->
          <view class="poi-content">
            <image 
              :class="['poi-img', isCheckedIn(name) ? '' : 'grayscale']" 
              :src="'/static/atlas/' + activeCat + '/' + (item.file || name + '.png')" 
              mode="aspectFit"
            ></image>
          </view>
          
          <!-- 名称标签 -->
          <view class="poi-label" v-if="isCheckedIn(name)">
            <text>{{ name }}</text>
          </view>
        </view>
      </view>
      <view class="bottom-spacer"></view>
    </scroll-view>

    <!-- 顶部进度悬浮条 -->
    <view class="progress-bar-floating">
      <image class="atlas-icon" src="/static/atlas/atlas_icon.png" mode="aspectFit"></image>
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

export default {
  components: {
    CustomTabBar
  },
  data() {
    return {
      activeCat: 'history',
      showingModal: false,
      selectedItem: '',
      checkInData: {}, 
      categories: {
        history: {
          name: '历史',
          map: '/static/atlas/history/历史地图.png',
          map_bw: '/static/atlas/history/历史地图黑白.png',
          items: {
            '创意社区': { top: 12, left: 35, frame: 1, width: 180 },
            '南海意库': { top: 38, left: 45, frame: 10, width: 200 },
            '南海酒店': { top: 65, left: 35, frame: 3, width: 190 },
            '南海集团': { top: 7, left: 60, frame: 6, width: 170 },
            '微波山': { top: 32, left: 55, frame: 8, width: 180, file: '微波山.png' },
            '招商局历史博物馆': { top: 80, left: 30, frame: 13, width: 220 },
            '时间就是金钱': { top: 60, left: 15, frame: 11, width: 180, file: '时间就是金钱标语牌.png' },
            '明华轮': { top: 55, left: 38, frame: 15, width: 210 },
            '水湾村史馆': { top: 30, left: 68, frame: 7, width: 160 },
            '水湾炮楼': { top: 38, left: 58, frame: 18, width: 150 },
            '海上世界艺术中心': { top: 68, left: 60, frame: 9, width: 230, file: '海上世界文化艺术中心.png' },
            '海滨花园别墅': { top: 48, left: 65, frame: 12, width: 180 },
            '空谈误国': { top: 10, left: 68, frame: 2, width: 190, file: '空谈误国实干兴邦标语牌.png' },
            '育才中学': { top: 20, left: 65, frame: 4, width: 180 },
            '荔香公园': { top: 40, left: 15, frame: 5, width: 190 }
          }
        },
        coffee: {
          name: '咖啡',
          map: '/static/atlas/coffee/咖啡地图.png',
          map_bw: '/static/atlas/coffee/咖啡地图黑白.png',
          items: {
            '365日咖啡': { top: 45, left: 15, frame: 16, width: 180 },
            'greenwood': { top: 25, left: 15, frame: 1, width: 170 },
            'jojo土耳其咖啡': { top: 60, left: 15, frame: 8, width: 190, file: 'jojo土耳其占卜咖啡.png' },
            'kuddo coffee': { top: 22, left: 25, frame: 10, width: 180 },
            'NewPark coffee': { top: 35, left: 65, frame: 14, width: 180 },
            'wavve coffee': { top: 45, left: 45, frame: 6, width: 180 },
            '山池咖啡': { top: 72, left: 68, frame: 13, width: 210 },
            '正在生活咖啡': { top: 62, left: 45, frame: 19, width: 180 },
            '艾米丽咖啡': { top: 68, left: 15, frame: 3, width: 180 }
          }
        },
        western: {
          name: '西餐',
          map: '/static/atlas/western/西餐地图.png',
          map_bw: '/static/atlas/western/西餐地图黑白.png',
          items: {
            'alla': { top: 70, left: 15, frame: 15, width: 220, file: 'alla.png' },
            'baker': { top: 48, left: 80, frame: 11, width: 170 },
            'commune': { top: 48, left: 52, frame: 7, width: 180 },
            'doors': { top: 12, left: 65, frame: 10, width: 180 },
            'madloba': { top: 28, left: 80, frame: 6, width: 180 },
            'minimal': { top: 28, left: 10, frame: 1, width: 190 },
            'the_flames': { top: 35, left: 65, frame: 9, width: 180 },
            '壁虎餐厅': { top: 52, left: 65, frame: 18, width: 160 },
            '宝可多': { top: 58, left: 12, frame: 12, width: 180 },
            'Gecko Pub': { top: 70, left: 75, frame: 15, width: 220, file: '壁虎餐厅.png' }
          }
        }
      }
    }
  },
  computed: {
    currentCatData() {
      return this.categories[this.activeCat];
    },
    completedCount() {
      return (this.checkInData[this.activeCat] || []).length;
    },
    totalCount() {
      return Object.keys(this.currentCatData.items).length;
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
    loadCheckInData() {
      const data = uni.getStorageSync('shekou_checkin');
      this.checkInData = data || { history: [], coffee: [], western: [] };
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
  min-height: 100vh;
  background-color: #FFF9E6;
  display: flex;
  flex-direction: column;
}

.category-tabs {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  background: rgba(255, 249, 230, 0.8);
  backdrop-filter: blur(10px);
  z-index: 100;
  box-sizing: border-box;
  
  .tab {
    padding: 12rpx 40rpx;
    background: #fff;
    border-radius: 40rpx;
    font-size: 26rpx;
    color: #666;
    box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.05);
    transition: all 0.3s;
    
    &.active {
      background: #FFCC00;
      color: #333;
      font-weight: 800;
      transform: scale(1.05);
    }
  }
}

.progress-bar-floating {
  position: fixed;
  top: 120rpx;
  left: 30rpx;
  right: 30rpx;
  background: rgba(255, 255, 255, 0.9);
  padding: 20rpx 40rpx;
  border-radius: 50rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 10rpx 30rpx rgba(0,0,0,0.05);
  z-index: 90;
  border: 1rpx solid rgba(255,204,0,0.3);
  
  .atlas-icon {
    width: 60rpx;
    height: 60rpx;
    margin-right: 20rpx;
  }
  
  .progress-text {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .title { font-size: 28rpx; font-weight: bold; color: #333; }
    .count { font-size: 24rpx; font-weight: 800; color: #FFCC00; }
  }
}

.atlas-scroll-view {
  flex: 1;
  width: 100%;
  padding-top: 200rpx;
}

.map-content {
  position: relative;
  width: 100%;
  
  .bg-map {
    width: 100%;
    display: block;
  }
  
  .poi-frame-container {
    position: absolute;
    transform: translate(-50%, -50%);
    transition: all 0.5s ease-out;
    z-index: 10;
    
    .frame-img {
      width: 100%;
      height: auto;
      display: block;
      filter: drop-shadow(0 10rpx 20rpx rgba(0,0,0,0.15));
    }
    
    .poi-content {
      position: absolute;
      top: 15%;
      left: 15%;
      width: 70%;
      height: 70%;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      
      .poi-img {
        width: 100%;
        height: 100%;
        
        &.grayscale {
          filter: grayscale(100%);
          opacity: 0.5;
        }
      }
    }
    
    .poi-label {
      position: absolute;
      bottom: -30rpx;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(255, 255, 255, 0.9);
      padding: 4rpx 16rpx;
      border-radius: 20rpx;
      font-size: 18rpx;
      font-weight: bold;
      color: #333;
      white-space: nowrap;
      box-shadow: 0 4rpx 10rpx rgba(0,0,0,0.1);
    }
  }
}

.bottom-spacer { height: 160rpx; width: 100%; }

.modal-mask {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.6);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-content {
  width: 500rpx;
  background: #fff;
  border-radius: 40rpx;
  padding: 60rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .modal-title {
    font-size: 32rpx;
    font-weight: 800;
    color: #333;
    margin-bottom: 50rpx;
    text-align: center;
  }
  
  .checkin-btn {
    background: #FFCC00;
    color: #333;
    padding: 24rpx 80rpx;
    border-radius: 50rpx;
    font-weight: 800;
    font-size: 30rpx;
    box-shadow: 0 10rpx 20rpx rgba(255, 204, 0, 0.3);
  }
}
</style>
