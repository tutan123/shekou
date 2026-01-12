"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      selectedPoi: null
    };
  },
  onLoad() {
    common_vendor.index.__f__("log", "at pages/index/index.vue:59", "首页加载完成");
  },
  methods: {
    getLocation() {
      common_vendor.index.showLoading({ title: "定位中..." });
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "已定位到当前位置", icon: "none" });
        },
        fail: () => {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "定位失败", icon: "none" });
        }
      });
    },
    goToRouteSelect() {
      common_vendor.index.navigateTo({
        url: "/pages/route/select"
      });
    },
    showPoiDetail(name) {
      this.selectedPoi = {
        name,
        desc: "这里是蛇口的标志性建筑，融合了文化、艺术与商业...",
        img: "/static/images/avatar_placeholder.png"
        // 使用已有图片避免报错
      };
    },
    goToDetail() {
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_assets._imports_1,
    c: common_vendor.o(($event) => $options.showPoiDetail("海上世界")),
    d: common_assets._imports_2,
    e: common_vendor.o((...args) => $options.getLocation && $options.getLocation(...args)),
    f: common_assets._imports_3,
    g: common_vendor.o((...args) => $options.goToRouteSelect && $options.goToRouteSelect(...args)),
    h: $data.selectedPoi
  }, $data.selectedPoi ? {
    i: $data.selectedPoi.img,
    j: common_vendor.t($data.selectedPoi.name),
    k: common_vendor.t($data.selectedPoi.desc),
    l: common_vendor.o((...args) => $options.goToDetail && $options.goToDetail(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
