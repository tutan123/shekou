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
      
      // 1. 定义字体配置
      const fontFamily = 'RuilingTi';
      const fontCloudPath = 'static/fonts/No.27-上首锐棱体.ttf';
      const fontUrl = 'https://636c-cloud1-1g2i7u3rb32a6ede-1396678568.tcb.qcloud.la/static/fonts/No.27-%E4%B8%8A%E9%A6%96%E9%94%90%E6%A3%B1%E4%BD%93.ttf';
      
      // 2. 优先使用 cloud.downloadFile 下载到本地再加载（最稳妥的方法，解决 CORS 和白名单问题）
      wx.cloud.downloadFile({
        fileID: `cloud://cloud1-1g2i7u3rb32a6ede.636c-cloud1-1g2i7u3rb32a6ede-1396678568/${fontCloudPath}`,
        success: (res) => {
          console.log('✅ 字体下载成功，准备加载:', res.tempFilePath);
          wx.loadFontFace({
            family: fontFamily,
            source: `url("${res.tempFilePath}")`,
            global: true,
            success: () => console.log(`✅ ${fontFamily} 通过本地临时文件加载成功`),
            fail: (err) => {
              console.error(`❌ ${fontFamily} 通过本地路径加载失败`, err);
              // 如果本地加载也失败，尝试直接用 HTTPS URL (最后的尝试)
              this.loadFontFaceWithUrl(fontFamily, fontUrl);
            }
          });
        },
        fail: (err) => {
          console.error('❌ 字体下载失败，尝试直接加载 URL', err);
          this.loadFontFaceWithUrl(fontFamily, fontUrl);
        }
      });
    },

    loadFontFaceWithUrl(family, url) {
      wx.loadFontFace({
        family: family,
        source: `url("${url}")`,
        global: true,
        success: (res) => console.log(`✅ ${family} 通过 URL 加载成功`, res.status),
        fail: (err) => console.error(`❌ ${family} 所有加载方式均失败`, err)
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
