"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/index/index.js";
  "./pages/atlas/index.js";
  "./pages/profile/index.js";
  "./pages/login/login.js";
  "./pages/route/select.js";
  "./pages/profile/details.js";
  "./pages/profile/settings.js";
  "./pages/profile/favorites.js";
  "./pages/route/detail.js";
}
const _sfc_main = {
  onLaunch() {
    common_vendor.index.__f__("log", "at App.vue:4", "蛇口导览启动成功");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
