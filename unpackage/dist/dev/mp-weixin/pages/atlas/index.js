"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      activeTab: 0,
      tabs: ["历史", "咖啡", "西餐", "滨海", "登山"]
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.tabs, (tab, index, i0) => {
      return {
        a: common_vendor.t(tab),
        b: index,
        c: common_vendor.n($data.activeTab === index ? "active" : ""),
        d: common_vendor.o(($event) => $data.activeTab = index, index)
      };
    }),
    b: common_vendor.f(12, (i, k0, i0) => {
      return common_vendor.e({
        a: i > 4
      }, i > 4 ? {} : {}, {
        b: common_vendor.t(i > 4 ? "???" : "景点 " + i),
        c: i
      });
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d6dbe8c0"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/atlas/index.js.map
