"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  methods: {
    goTo(url) {
      common_vendor.index.navigateTo({ url });
    },
    handleLogout() {
      common_vendor.index.reLaunch({ url: "/pages/login/login" });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_assets._imports_0$1,
    b: common_assets._imports_1$1,
    c: common_assets._imports_0$2,
    d: common_vendor.o(($event) => $options.goTo("/pages/profile/settings")),
    e: common_assets._imports_0$2,
    f: common_vendor.o(($event) => $options.goTo("/pages/profile/details")),
    g: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-201c0da5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/index.js.map
