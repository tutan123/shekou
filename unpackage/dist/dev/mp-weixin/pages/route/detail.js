"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      routeId: "",
      routeName: "",
      mapSrc: ""
    };
  },
  onLoad(options) {
    this.routeId = options.id || "laojie";
    this.routeName = options.name || "老街路线";
    this.setMapSrc();
  },
  methods: {
    setMapSrc() {
      const mapMap = {
        "kafei": "/static/images/kafei_map.png",
        "binhai": "/static/images/binhai_map.png",
        "dengshan": "/static/images/dengshan_map.png",
        "laojie": "/static/images/laojie_map.png",
        "xican": "/static/images/xican_map.png"
      };
      this.mapSrc = mapMap[this.routeId] || mapMap["laojie"];
    },
    goBack() {
      common_vendor.index.navigateBack();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.t($data.routeName),
    c: $data.mapSrc,
    d: common_vendor.t($data.routeName),
    e: common_vendor.f(3, (i, k0, i0) => {
      return {
        a: common_vendor.t(i),
        b: i
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d65e529d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/route/detail.js.map
