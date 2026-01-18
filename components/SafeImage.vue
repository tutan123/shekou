<template>
  <view class="safe-image-container" :class="{ 'has-error': hasError }">
    <image
      :src="currentSrc"
      :mode="mode"
      :class="imageClass"
      :style="imageStyle"
      :lazy-load="lazyLoad"
      :show-menu-by-longpress="showMenuByLongpress"
      @load="onLoad"
      @error="onError"
      @click="onClick"
    />

    <!-- 错误占位符 -->
    <view v-if="hasError" class="error-placeholder" :class="placeholderClass">
      <slot name="error">
        <text class="error-icon">{{ errorIcon }}</text>
        <text class="error-text">{{ errorText }}</text>
      </slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SafeImage',
  props: {
    src: {
      type: String,
      required: true
    },
    fallbackSrc: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'aspectFit'
    },
    imageClass: {
      type: String,
      default: ''
    },
    imageStyle: {
      type: String,
      default: ''
    },
    lazyLoad: {
      type: Boolean,
      default: false
    },
    showMenuByLongpress: {
      type: Boolean,
      default: false
    },
    maxRetryCount: {
      type: Number,
      default: 2
    },
    placeholderClass: {
      type: String,
      default: ''
    },
    errorIcon: {
      type: String,
      default: '⚠️'
    },
    errorText: {
      type: String,
      default: '图片加载失败'
    }
  },
  data() {
    return {
      currentSrc: this.src,
      retryCount: 0,
      hasError: false
    }
  },
  watch: {
    src(newSrc) {
      if (newSrc !== this.currentSrc) {
        this.currentSrc = newSrc;
        this.retryCount = 0;
        this.hasError = false;
      }
    }
  },
  methods: {
    onLoad(e) {
      // 图片加载成功，重置错误状态
      this.hasError = false;
      console.log('✅ SafeImage 加载成功:', this.currentSrc, '组件:', this.$parent?.$?.type?.name || 'unknown');
      this.$emit('load', e);
    },
    onError(e) {
      console.error('❌ 图片加载失败:', this.currentSrc, e);
      console.error('错误详情:', {
        src: this.src,
        fallbackSrc: this.fallbackSrc,
        retryCount: this.retryCount,
        maxRetryCount: this.maxRetryCount
      });

      // 如果还有重试次数，尝试重新加载
      if (this.retryCount < this.maxRetryCount) {
        this.retryCount++;
        // 延迟一秒后重试
        setTimeout(() => {
          console.log(`重试加载图片 (${this.retryCount}/${this.maxRetryCount}):`, this.currentSrc);
          this.currentSrc = this.src + '?t=' + Date.now(); // 添加时间戳强制刷新
        }, 1000);
        return;
      }

      // 如果有fallback图片，使用fallback
      if (this.fallbackSrc && this.currentSrc !== this.fallbackSrc) {
        console.log('使用fallback图片:', this.fallbackSrc);
        this.currentSrc = this.fallbackSrc;
        return;
      }

      // 所有尝试都失败了
      this.hasError = true;
      this.$emit('error', e);

      // 网络错误时给出用户友好的提示
      if (this.retryCount >= this.maxRetryCount && !this.fallbackSrc) {
        uni.showToast({
          title: '图片加载失败',
          icon: 'none',
          duration: 2000
        });
      }
    },
    onClick(e) {
      this.$emit('click', e);
    }
  }
}
</script>

<style scoped>
.safe-image-container {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 100%;
}

.safe-image-container.has-error image {
  opacity: 0.3;
}

.error-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8rpx;
  z-index: 10;
}

.error-placeholder .error-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.error-placeholder .error-text {
  font-size: 24rpx;
  color: #666;
  text-align: center;
  line-height: 1.4;
}

/* 默认占位符样式 */
.error-placeholder.default {
  background: #f5f5f5;
  border: 2rpx dashed #ddd;
}
</style>