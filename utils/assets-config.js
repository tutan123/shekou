// 微信小程序云存储图片路径配置
// 云存储基础路径
const CLOUD_BASE_URL = 'cloud://cloud1-1g2i7u3rb32a6ede.636c-cloud1-1g2i7u3rb32a6ede-1396678568/static/';

console.log('🖼️ ASSETS_CONFIG: 云存储基础路径已加载:', CLOUD_BASE_URL);

// 本地fallback基础路径（小程序包内图片）
const LOCAL_BASE_URL = '/static/';

// 获取图片路径，支持云存储失败时的本地fallback
function getImageWithFallback(cloudPath, localPath) {
  return {
    cloud: cloudPath,
    local: localPath || cloudPath.replace(CLOUD_BASE_URL, LOCAL_BASE_URL)
  };
}

// 创建安全的图片路径（优先云存储，失败时自动fallback到本地）
function createSafeImagePath(relativePath) {
  const cloudPath = CLOUD_BASE_URL + relativePath;
  const localPath = LOCAL_BASE_URL + relativePath;
  return {
    primary: cloudPath,    // 主要路径（云存储）
    fallback: localPath    // fallback路径（本地）
  };
}

// 验证云存储文件是否存在（开发调试用）
function checkCloudFile(path, description = '') {
  console.log(`🔍 检查云存储文件: ${description}`, path);
  // 注意：小程序中无法直接验证云存储文件是否存在
  // 这个函数主要用于调试日志
  return path;
}

// 图片路径映射配置
const ASSETS_CONFIG = {
  // 暴露基础路径供组件内部拼接使用
  CLOUD_BASE_URL,
  LOCAL_BASE_URL,
  
  // TabBar 图标
  tabbar: {
    atlasInactive: CLOUD_BASE_URL + 'tabbar/atlas.png',
    atlasActive: CLOUD_BASE_URL + 'tabbar/atlas-active.png',
    mapInactive: CLOUD_BASE_URL + 'tabbar/map.png',
    mapActive: CLOUD_BASE_URL + 'tabbar/map-active.png',
    profileInactive: CLOUD_BASE_URL + 'tabbar/profile.png',
    profileActive: CLOUD_BASE_URL + 'tabbar/profile-active.png'
  },

  // 通用图片
  images: {
    avatarPlaceholder: CLOUD_BASE_URL + 'images/avatar_placeholder.png',
    loginBg: CLOUD_BASE_URL + 'images/login_bg.png',
    wave: CLOUD_BASE_URL + 'images/wave.png',
    arrowRightWhite: CLOUD_BASE_URL + 'images/arrow_right_white.png',
    btnCheckin: CLOUD_BASE_URL + 'images/btn_checkin.png',
    forgotPwd: CLOUD_BASE_URL + 'images/forgot_pwd.png',
    locationIcon: CLOUD_BASE_URL + 'images/location_icon.png',
    markerPlaceholder: CLOUD_BASE_URL + 'images/marker_placeholder.png',
    routeIcon: CLOUD_BASE_URL + 'images/route_icon.png',
    blankMap: CLOUD_BASE_URL + 'images/blank_map.png'
  },

  // 首页相关
  index: {
    bigMap: CLOUD_BASE_URL + 'index/big_map.png',
    ellipse: CLOUD_BASE_URL + 'index/ellipse.png',
    locationBtn: CLOUD_BASE_URL + 'index/location_btn.png',
    routeBtn: CLOUD_BASE_URL + 'index/route_btn.png',
    mainMap: CLOUD_BASE_URL + 'index/main_map.png'
  },

  // 登录页相关
  login: {
    bg: CLOUD_BASE_URL + 'login/bg.png',
    bgMap: CLOUD_BASE_URL + 'login/bg_map.png',
    title: CLOUD_BASE_URL + 'login/title.png',
    welcome: CLOUD_BASE_URL + 'login/welcome.png',
    btnLogin: CLOUD_BASE_URL + 'login/btn_login.png',
    phoneLogin: CLOUD_BASE_URL + 'login/phone_login.png',
    register: CLOUD_BASE_URL + 'login/register.png',
    forgotPwd: CLOUD_BASE_URL + 'login/forgot_pwd.png',
    arrow: CLOUD_BASE_URL + 'login/arrow.png',
    eye: CLOUD_BASE_URL + 'login/eye.png'
  },

  // 路线相关
  route: {
    headerBgMap: CLOUD_BASE_URL + 'route/header_bg_map.png',
    selectHeaderBg: CLOUD_BASE_URL + 'route/select_header_bg.png',
    dotsPath: CLOUD_BASE_URL + 'route/dots_path.png',
    pathDots1: CLOUD_BASE_URL + 'route/path_dots_1.png',
    textDesc: CLOUD_BASE_URL + 'route/text_desc.png',
    checkinBtn: CLOUD_BASE_URL + 'route/western/checkin_btn.png',

    // 卡片背景
    cardBg1: CLOUD_BASE_URL + 'route/card_bg_1.png',
    cardBg2: CLOUD_BASE_URL + 'route/card_bg_2.png',
    cardBg3: CLOUD_BASE_URL + 'route/card_bg_3.png',

    // 路线艺术图
    oldstreetShip: CLOUD_BASE_URL + 'route/oldstreet_ship.png',
    mountainArt: CLOUD_BASE_URL + 'route/mountain_art.png',
    seaArt: CLOUD_BASE_URL + 'route/sea_art.png',
    westernPizza: CLOUD_BASE_URL + 'route/western_pizza.png',
    coffeeTools: CLOUD_BASE_URL + 'route/coffee_tools.png',

    // 路线地图
    laojie: {
      map: CLOUD_BASE_URL + 'route/laojie/老街地图.png'
    },
    dengshan: {
      map: CLOUD_BASE_URL + 'route/dengshan/登山地图.png'
    },
    binhai: {
      map: CLOUD_BASE_URL + 'route/binhai/滨海地图.png'
    },
    western: {
      map: CLOUD_BASE_URL + 'route/western/西餐地图.png'
    },
    coffee: {
      map: CLOUD_BASE_URL + 'route/coffee/咖啡地图.png'
    }
  },

  // 图鉴相关
  atlas: {
    atlasIcon: CLOUD_BASE_URL + 'tabbar/atlas.png',

    // 历史图鉴 (使用老街线路的文件)
    history: {
      map: CLOUD_BASE_URL + 'route/laojie/full_map.png',
      mapBw: CLOUD_BASE_URL + 'route/laojie/blank_map.png',
      items: {
        '01': CLOUD_BASE_URL + 'route/laojie/01_biaoyupai_pic.png',
        '02': CLOUD_BASE_URL + 'route/laojie/02_nanbo_pic.png',
        '03': CLOUD_BASE_URL + 'route/laojie/03_yucai_pic.png',
        '04': CLOUD_BASE_URL + 'route/laojie/04_gg_pic.png',
        '05': CLOUD_BASE_URL + 'route/laojie/05_shuiwanyuanhua_pic.png',
        '06': CLOUD_BASE_URL + 'route/laojie/06_shuiwancunshiguan_pic.png',
        '07': CLOUD_BASE_URL + 'route/laojie/07_shuiwanpaolou_pic.png',
        '08': CLOUD_BASE_URL + 'route/laojie/08_lizhigongyuan_pic.png',
        '09': CLOUD_BASE_URL + 'route/laojie/09_nanhaiyiku_piv.png', // 注意文件名有变化
        '10': CLOUD_BASE_URL + 'route/laojie/10_haibinhuayuan_pic.png',
        '11': CLOUD_BASE_URL + 'route/binhai/11_minghualun_pic.png',
        '12': CLOUD_BASE_URL + 'route/binhai/12_nvwaxiang_pic.png',
        '13': CLOUD_BASE_URL + 'route/binhai/13_haishangshijie_pic.png',
        '15': CLOUD_BASE_URL + 'route/binhai/15_nanhaijiudian_pic.png',
        '16': CLOUD_BASE_URL + 'route/binhai/16_bitaoyuan_pic.png',
        '17': CLOUD_BASE_URL + 'route/dengshan/17_shijianbiaoyu_pic.png',
        '18': CLOUD_BASE_URL + 'route/dengshan/18_weiboshan_pic.png',
        '19': CLOUD_BASE_URL + 'route/dengshan/19_zhaoshangjulishi_pic.png'
      }
    },

    // 咖啡图鉴
    coffee: {
      map: CLOUD_BASE_URL + 'route/coffee/full_map.png',
      mapBw: CLOUD_BASE_URL + 'route/coffee/blank_map.png',
      items: {
        '01': CLOUD_BASE_URL + 'route/coffee/01_zhengzaishenghuo_pic.png',
        '02': CLOUD_BASE_URL + 'route/coffee/02_greenwood_pic.png',
        '03': CLOUD_BASE_URL + 'route/coffee/03_jojo_pic.png',
        '04': CLOUD_BASE_URL + 'route/coffee/04_chali_pic.png', // 注意文件名变化
        '05': CLOUD_BASE_URL + 'route/coffee/05_newparkcoffee_pic.png', // 注意文件名变化
        '06': CLOUD_BASE_URL + 'route/coffee/06_newpark_pic.png',
        '07': CLOUD_BASE_URL + 'route/coffee/07_wavve_pic.png',
        '08': CLOUD_BASE_URL + 'route/coffee/08_shanchi_pic.png', // 注意文件名变化
        '09': CLOUD_BASE_URL + 'route/coffee/09_kuddo_pic.png' // 注意文件名变化
      }
    },

    // 西餐图鉴
    western: {
      map: CLOUD_BASE_URL + 'route/western/full_map.png',
      mapBw: CLOUD_BASE_URL + 'route/western/blank_map.png',
      items: {
        'alla': {
          icon: CLOUD_BASE_URL + 'route/western/03_alla_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/03_alla_title.png'
        },
        'baker': {
          icon: CLOUD_BASE_URL + 'route/western/08_baker_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/08_baker_title.png'
        },
        'commune': {
          icon: CLOUD_BASE_URL + 'route/western/06_commune_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/06_commune_title.png'
        },
        'doors': {
          icon: CLOUD_BASE_URL + 'route/western/04_doors_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/04_doors_title.png'
        },
        'madloba': {
          icon: CLOUD_BASE_URL + 'route/western/05_madloba_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/05_madloba_title.png'
        },
        'minimal': {
          icon: CLOUD_BASE_URL + 'route/western/02_minimal_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/02_minimal_title.png'
        },
        'the_flames': {
          icon: CLOUD_BASE_URL + 'route/western/09_flames_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/09_flames_title.png'
        },
        '壁虎餐厅': {
          icon: CLOUD_BASE_URL + 'route/western/07_gecko_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/07_gecko_title.png'
        },
        '宝可多': {
          icon: CLOUD_BASE_URL + 'route/western/01_birol_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/01_birol_title.png'
        },
        'Gecko Pub': {
          icon: CLOUD_BASE_URL + 'route/western/07_gecko_pic.png',
          frame: CLOUD_BASE_URL + 'route/western/07_gecko_title.png' // 使用壁虎餐厅的资源
        }
      }
    }
  },

  // 老街线路
  oldstreet: {
    map: CLOUD_BASE_URL + 'oldstreet/老街地图.png',
    poi1: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本_画板 1.png',
    poi2: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-02.png',
    poi3: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-03.png',
    poi4: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-04.png',
    poi5: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-05.png',
    poi6: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-06.png',
    poi7: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-07.png',
    poi8: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-08.png',
    poi9: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-10.png',
    poi10: CLOUD_BASE_URL + 'oldstreet/五条路线修改版本-11.png'
  },

  // 个人中心相关
  profile: {
    backMap: CLOUD_BASE_URL + 'personal_page/back_map.png',
    mapShortcut: CLOUD_BASE_URL + 'personal_page/map_shortcut.png',
    roundRect: '/static/personal_page/round_rect.png',
    favIcon: '/static/personal_page/个人收藏_图标.svg',
    profileIcon: '/static/personal_page/个人资料_图标.svg',
    settingIcon: '/static/personal_page/个人设置_图标.svg',
    bottomBar: '/static/personal_page/BOTTOMBAR.svg'
  }
};

// 辅助函数：获取图片路径
function getAssetPath(category, key, subKey = null) {
  const categoryData = ASSETS_CONFIG[category];
  if (!categoryData) {
    console.warn(`Asset category '${category}' not found`);
    return '';
  }

  if (subKey) {
    if (categoryData[subKey] && categoryData[subKey][key]) {
      return categoryData[subKey][key];
    } else {
      console.warn(`Asset '${category}.${subKey}.${key}' not found`);
      return '';
    }
  } else {
    if (categoryData[key]) {
      return categoryData[key];
    } else {
      console.warn(`Asset '${category}.${key}' not found`);
      return '';
    }
  }
}

// 导出配置和辅助函数
export {
  CLOUD_BASE_URL,
  LOCAL_BASE_URL,
  ASSETS_CONFIG,
  getAssetPath,
  getImageWithFallback,
  createSafeImagePath,
  checkCloudFile
};

export default ASSETS_CONFIG;