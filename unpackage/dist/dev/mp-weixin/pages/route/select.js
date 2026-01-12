"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      routes: [
        {
          id: "laojie",
          name: "老街路线",
          desc: "蛇口老街漫步路线，从时代标签启程，经工业旧址、文创地标与人文景点，尽览开拓过往与诗意山海。",
          img: "/static/images/laojie_map.png"
          // 暂时使用地图底图作为封面
        },
        {
          id: "xican",
          name: "西餐路线",
          desc: "蛇口西餐线条国际风味：宝可多、汉堡、意式披萨、格鲁吉亚菜，多种选择，家家有惊喜。",
          img: "/static/images/xican_map.png"
        },
        {
          id: "kafei",
          name: "咖啡路线",
          desc: "蛇口咖啡漫游路线，是一场与香气的温柔邂逅。串联十家特色咖啡馆，慢品间，便读懂了蛇口独有的惬意与浪漫。",
          img: "/static/images/kafei_map.png"
        },
        {
          id: "binhai",
          name: "滨海路线",
          desc: "沿着蜿蜒海岸线，感受海风轻抚，打卡艺术中心与滨海广场，领略蛇口国际化的滨海魅力。",
          img: "/static/images/binhai_map.png"
        },
        {
          id: "dengshan",
          name: "登山路线",
          desc: "登上大南山，俯瞰蛇口全景与深圳湾大桥，在绿意盎然中寻找城市的宁静角落。",
          img: "/static/images/dengshan_map.png"
        }
      ]
    };
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    goRouteDetail(route) {
      common_vendor.index.navigateTo({
        url: `/pages/route/detail?id=${route.id}&name=${route.name}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: common_vendor.f($data.routes, (route, index, i0) => {
      return {
        a: route.img,
        b: common_vendor.t(route.name),
        c: common_vendor.t(route.desc),
        d: common_vendor.f(6, (i, k1, i1) => {
          return {
            a: i,
            b: 1 - i * 0.15
          };
        }),
        e: index,
        f: index * 0.1 + "s",
        g: common_vendor.o(($event) => $options.goRouteDetail(route), index)
      };
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-85b0aad9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/route/select.js.map
