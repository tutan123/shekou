"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      favorites: [
        { name: "海上世界文化艺术中心", status: "已打卡", img: "" },
        { name: "G&G创意社区", status: "去打卡", img: "" },
        { name: "水湾炮楼", status: "去打卡", img: "" },
        { name: "招商局历史博物馆", status: "已打卡", img: "" },
        { name: "梵语私房菜", status: "去打卡", img: "" }
      ]
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.favorites, (item, index, i0) => {
      return {
        a: item.img,
        b: common_vendor.t(item.name),
        c: common_vendor.f(5, (i, k1, i1) => {
          return {
            a: i
          };
        }),
        d: common_vendor.t(item.status),
        e: common_vendor.n(item.status === "已打卡" ? "done" : "todo"),
        f: index
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-27b641db"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/favorites.js.map
