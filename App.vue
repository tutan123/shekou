<script>
export default {
  onLaunch() {
    console.log('蛇口导览启动成功');

    // 初始化云开发环境
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'cloud1-1g2i7u3rb32a6ede', // 你的云环境ID
        traceUser: true,
      });
      console.log('☁️ 云开发环境初始化成功');
    }

    // 检查网络状态
    uni.getNetworkType({
      success: (res) => {
        console.log('🌐 网络状态:', res.networkType);
        if (res.networkType === 'none') {
          uni.showToast({
            title: '网络连接失败',
            icon: 'none',
            duration: 3000
          });
        }
      }
    });

    // 监听网络状态变化
    uni.onNetworkStatusChange((res) => {
      console.log('🌐 网络状态变化:', res.networkType, res.isConnected);
      if (!res.isConnected) {
        uni.showToast({
          title: '网络已断开',
          icon: 'none',
          duration: 2000
        });
      } else if (res.networkType === 'none') {
        uni.showToast({
          title: '无网络连接',
          icon: 'none',
          duration: 2000
        });
      }
    });
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  min-height: 100vh;
  background-color: #FFF9E6;
}

::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
}
</style>
