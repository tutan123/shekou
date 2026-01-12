<template>
  <view class="container">
    <!-- 顶部背景图：根据打卡情况切换黑白/彩色 -->
    <view class="category-map-section">
      <image 
        class="category-map" 
        :src="isCategoryCompleted ? currentCatData.map : currentCatData.map_bw" 
        mode="aspectFill"
      ></image>
      <view class="map-overlay">
        <text class="cat-title">{{ currentCatData.name }}图鉴</text>
        <text class="cat-progress">已收集 {{ completedCount }}/{{ totalCount }}</text>
      </view>
    </view>

    <!-- 分类 Tabs -->
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

    <!-- 图鉴列表 -->
    <scroll-view scroll-y class="atlas-grid" enable-flex>
      <view 
        class="atlas-item" 
        v-for="(item, name) in currentCatData.items" 
        :key="name"
        @click="showCheckIn(name)"
      >
        <view class="item-card">
          <!-- 画框背景 -->
          <image class="frame-bg" src="/static/images/frame.png" mode="scaleToFill"></image>
          
          <view class="item-content">
            <!-- 景点图片：未打卡则置灰 -->
            <image 
              :class="['poi-img', isCheckedIn(name) ? '' : 'grayscale']" 
              :src="'/static/atlas/' + activeCat + '/' + name + '.png'" 
              mode="aspectFit"
            ></image>
          </view>
          
          <text class="item-name">{{ isCheckedIn(name) ? name : '???' }}</text>
        </view>
      </view>
      <view class="bottom-spacer"></view>
    </scroll-view>

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
      checkInData: {}, // { history: ['name1', 'name2'], coffee: [...] }
      categories: {
        history: {
          name: '历史',
          map: '/static/atlas/history/map.png',
          map_bw: '/static/atlas/history/map_bw.png',
          items: {
            '创意社区': {}, '南海意库': {}, '南海酒店': {}, '南海集团': {},
            '微波山': {}, '招商局历史博物馆': {}, '时间就是金钱标语牌': {}, '明华轮': {},
            '水湾村史馆': {}, '水湾源华公司': {}, '水湾炮楼': {}, '海上世界文化艺术中心': {},
            '海滨花园别墅': {}, '空谈误国实干兴邦标语牌': {}, '育才中学': {}, '荔香公园': {}
          }
        },
        coffee: {
          name: '咖啡',
          map: '/static/atlas/coffee/map.png',
          map_bw: '/static/atlas/coffee/map_bw.png',
          items: {
            '365日咖啡': {}, 'greenwood': {}, 'jojo土耳其占卜咖啡': {}, 'kuddo coffee': {},
            'NewPark coffee': {}, 'newparkcoffee': {}, 'wavve coffee': {}, '山池咖啡': {},
            '正在生活咖啡': {}, '艾米丽咖啡': {}
          }
        },
        western: {
          name: '西餐',
          map: '/static/atlas/western/map.png',
          map_bw: '/static/atlas/western/map_bw.png',
          items: {
            'alla': {}, 'baker': {}, 'commune': {}, 'doors': {},
            'madloba': {}, 'minimal': {}, 'the_flames': {}, '壁虎餐厅': {}, '宝可多': {}
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
      uni.showToast({ title: '打卡成功！', icon: 'success' });
      
      if (this.isCategoryCompleted) {
        setTimeout(() => {
          uni.showModal({
            title: '恭喜！',
            content: `你已点亮所有${this.currentCatData.name}图鉴，地图已变为彩色！`,
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

.category-map-section {
  position: relative;
  height: 400rpx;
  width: 100%;
  
  .category-map {
    width: 100%;
    height: 100%;
  }
  
  .map-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 40rpx;
    background: linear-gradient(to top, rgba(0,0,0,0.6), transparent);
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    box-sizing: border-box;
    
    .cat-title { color: #fff; font-size: 40rpx; font-weight: 800; }
    .cat-progress { color: #FFCC00; font-size: 24rpx; font-weight: bold; }
  }
}

.category-tabs {
  display: flex;
  padding: 30rpx;
  gap: 20rpx;
  
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

.atlas-grid {
  flex: 1;
  padding: 0 30rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 30rpx;
  box-sizing: border-box;
  
  .atlas-item {
    width: 45%; // 2 columns
    margin-bottom: 30rpx;
    
    .item-card {
      position: relative;
      width: 100%;
      height: 320rpx;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      
      .frame-bg {
        position: absolute;
        top: 0; left: 0; width: 100%; height: 100%;
        z-index: 1;
      }
      
      .item-content {
        position: relative;
        z-index: 2;
        width: 80%;
        height: 180rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .poi-img {
          width: 100%;
          height: 100%;
          
          &.grayscale {
            filter: grayscale(100%);
            opacity: 0.6;
          }
        }
      }
      
      .item-name {
        position: relative;
        z-index: 2;
        margin-top: 10rpx;
        font-size: 22rpx;
        color: #333;
        font-weight: bold;
        background: rgba(255,255,255,0.8);
        padding: 4rpx 12rpx;
        border-radius: 10rpx;
      }
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
