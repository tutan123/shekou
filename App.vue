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

    // 加载自定义字体 - 锐棱体
    this.loadCustomFont();
  },
  methods: {
    loadCustomFont() {
      console.log('开始加载自定义字体...');
      // 使用 HTTPS 链接并对中文文件名进行编码，确保加载成功率
      const fontUrl = 'https://636c-cloud1-1g2i7u3rb32a6ede-1396678568.tcb.qcloud.la/static/fonts/No.27-%E4%B8%8A%E9%A6%96%E9%94%90%E6%A3%B1%E4%BD%93.ttf';
      
      wx.loadFontFace({
        family: 'RuilingTi',
        source: `url("${fontUrl}")`,
        global: true,
        success: (res) => {
          console.log('✅ 锐棱体加载成功', res.status);
          // 加载成功后，可以在这里通知页面刷新或者做一些标志位
        },
        fail: (err) => {
          console.error('❌ 锐棱体加载失败', err);
          // 如果 HTTPS 失败，尝试 cloud 协议作为后备
          wx.loadFontFace({
            family: 'RuilingTi',
            source: 'url("cloud://cloud1-1g2i7u3rb32a6ede.636c-cloud1-1g2i7u3rb32a6ede-1396678568/static/fonts/No.27-上首锐棱体.ttf")',
            global: true,
          });
        }
      });
    }
  }
}
</script>

<style lang="scss">
/* 全局样式 */
page {
  min-height: 100vh;
  background-color: #FFCB32;
  /* 优先使用锐棱体，回退至系统默认黑体 */
  font-family: 'RuilingTi', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    STHeiti, 'Microsoft YaHei', Verdana, Arial, sans-serif !important;
}

/* 确保所有基础组件都继承字体 */
view, text, input, textarea, button {
  font-family: 'RuilingTi', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    STHeiti, 'Microsoft YaHei', Verdana, Arial, sans-serif;
}

::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
}
</style>
