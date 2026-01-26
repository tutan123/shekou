import { ASSETS_CONFIG } from './assets-config.js';

const CLOUD_BASE = ASSETS_CONFIG.CLOUD_BASE_URL;
const ROUTE_BASE = CLOUD_BASE + 'route/';
const ATLAS_BASE = CLOUD_BASE + 'atlas/';

// 助手函数：生成路线详情图路径
const getRoutePaths = (route, fileName, options = { hasPic: true, hasTitle: true, hasDetail: true }) => {
  const paths = {};
  if (options.hasDetail) paths.detailImg = `${ROUTE_BASE}${route}/${fileName}_detail.png`;
  if (options.hasPic) paths.pic = `${ROUTE_BASE}${route}/${fileName}_pic.png`;
  if (options.hasTitle) paths.titleImg = `${ROUTE_BASE}${route}/${fileName}_title.png`;
  
  // 特殊处理：老街 09 的图片名有个 typo
  if (route === 'laojie' && fileName === '09_nanhaiyiku' && options.hasPic) {
    paths.pic = `${ROUTE_BASE}laojie/09_nanhaiyiku_piv.png`;
  }
  return paths;
};

export const CATEGORIES = {
  history: {
    id: 'laojie',
    name: '老街',
    map: ATLAS_BASE + 'history/map.png',
    map_bw: ATLAS_BASE + 'history/map_bw.png',
    items: {
      '空谈误国': { 
        top: 1060, left: 450, width: 230, 
        frame: ATLAS_BASE + 'history/01_biaoyupai_frame.png', 
        icon: ATLAS_BASE + 'history/01_biaoyupai_pic.png',
        ...getRoutePaths('laojie', '01_biaoyupai')
      },
      '空谈误国标语': { 
        ...getRoutePaths('laojie', '01_biaoyupai')
      },
      '南玻集团': { 
        top: 400, left: 100, width: 240, 
        frame: ATLAS_BASE + 'history/02_nanbo_frame.png', 
        icon: ATLAS_BASE + 'history/02_nanbo_pic.png',
        ...getRoutePaths('laojie', '02_nanbo')
      },
      '育才一小': { 
        top: 160, left: 450, width: 220, 
        frame: ATLAS_BASE + 'history/03_yucai_frame.png', 
        icon: ATLAS_BASE + 'history/03_yucai_pic.png',
        ...getRoutePaths('laojie', '03_yucai')
      },
      '育才中学': { 
        ...getRoutePaths('laojie', '03_yucai')
      },
      'G&G': {
        top: 475, left: 569, width: 230,
        frame: ATLAS_BASE + 'history/04_gg_frame.png',
        icon: ATLAS_BASE + 'history/04_gg_pic.png',
        ...getRoutePaths('laojie', '04_gg')
      },
      'G&G创意社区': { 
        ...getRoutePaths('laojie', '04_gg')
      },
      '水湾源华': {
        top: 906, left: 85, width: 230,
        frame: ATLAS_BASE + 'history/05_shuiwanyuanhua_frame.png',
        icon: ATLAS_BASE + 'history/05_shuiwanyuanhua_pic.png',
        ...getRoutePaths('laojie', '05_shuiwanyuanhua')
      },
      '水湾源华公司': { 
        ...getRoutePaths('laojie', '05_shuiwanyuanhua')
      },
      '水湾村史馆': { 
        top: 620, left: 70, width: 220, 
        frame: ATLAS_BASE + 'history/06_shuiwancunshiguan_frame.png', 
        icon: ATLAS_BASE + 'history/06_shuiwancunshiguan_pic.png',
        ...getRoutePaths('laojie', '06_shuiwancunshiguan')
      },
      '水湾炮楼': {
        top: 420, left: 290, width: 220,
        frame: ATLAS_BASE + 'history/07_shuiwanpaolou_frame.png',
        icon: ATLAS_BASE + 'history/07_shuiwanpaolou_pic.png',
        ...getRoutePaths('laojie', '07_shuiwanpaolou')
      },
      '荔枝公园': { 
        top: 180, left: 60, width: 230, 
        frame: ATLAS_BASE + 'history/08_lizhigongyuan_frame.png', 
        icon: ATLAS_BASE + 'history/08_lizhigongyuan_pic.png',
        ...getRoutePaths('laojie', '08_lizhigongyuan')
      },
      '南海意库': { 
        top: 830, left: 470, width: 230, 
        frame: ATLAS_BASE + 'history/11_yiku_frame.png', 
        icon: ATLAS_BASE + 'history/11_yiku_pic.png',
        ...getRoutePaths('laojie', '09_nanhaiyiku')
      },
      '海滨花园': {
        top: 697, left: 308, width: 220,
        frame: ATLAS_BASE + 'history/10_haibinhuayuan_frame.png',
        icon: ATLAS_BASE + 'history/10_haibinhuayuan_pic.png',
        ...getRoutePaths('laojie', '10_haibinhuayuan')
      },
      '水湾1979': {
        ...getRoutePaths('laojie', '05_shuiwanyuanhua') // 使用临近的详情作为占位，或者如果将来有专门的
      }
    }
  },
  binhai: {
    id: 'binhai',
    name: '滨海',
    map: ATLAS_BASE + 'binhai/map.png',
    map_bw: ATLAS_BASE + 'binhai/map_bw.png',
    items: {
      '明华轮': { 
        top: 120, left: 245, width: 260, 
        frame: ATLAS_BASE + 'binhai/11_minghualun_frame.png', 
        icon: ATLAS_BASE + 'binhai/11_minghualun_pic.png',
        ...getRoutePaths('binhai', '11_minghualun')
      },
      '碧涛苑': { 
        top: 380, left: 50, width: 240, 
        frame: ATLAS_BASE + 'binhai/16_bitaoyuan_frame.png', 
        icon: ATLAS_BASE + 'binhai/16_bitaoyuan_pic.png',
        ...getRoutePaths('binhai', '16_bitaoyuan')
      },
      '女娲像': { 
        top: 410, left: 460, width: 230, 
        frame: ATLAS_BASE + 'binhai/12_nvwaxiang_frame.png', 
        icon: ATLAS_BASE + 'binhai/12_nvwaxiang_pic.png',
        ...getRoutePaths('binhai', '12_nvwaxiang')
      },
      '女娲补天': { 
        ...getRoutePaths('binhai', '12_nvwaxiang')
      },
      '原耕': {
        ...getRoutePaths('binhai', '14_yuangeng')
      },
      '海上世界': { 
        top: 680, left: 60, width: 240, 
        frame: ATLAS_BASE + 'binhai/13_haishangshijie_frame.png', 
        icon: ATLAS_BASE + 'binhai/13_haishangshijie_pic.png',
        ...getRoutePaths('binhai', '13_haishangshijie')
      },
      '南海酒店': { 
        top: 710, left: 450, width: 250, 
        frame: ATLAS_BASE + 'binhai/15_nanhaijiudian_frame.png', 
        icon: ATLAS_BASE + 'binhai/15_nanhaijiudian_pic.png',
        ...getRoutePaths('binhai', '15_nanhaijiudian')
      }
    }
  },
  dengshan: {
    id: 'dengshan',
    name: '登山',
    map: ATLAS_BASE + 'dengshan/map.png',
    map_bw: ATLAS_BASE + 'dengshan/map_bw.png',
    items: {
      '时间标语': { 
        top: 250, left: 235, width: 280, 
        frame: ATLAS_BASE + 'dengshan/17_shijianbiaoyu_frame.png', 
        icon: ATLAS_BASE + 'dengshan/17_shijianbiaoyu_pic.png',
        ...getRoutePaths('dengshan', '17_shijianbiaoyu')
      },
      '时间标语牌': { 
        ...getRoutePaths('dengshan', '17_shijianbiaoyu')
      },
      '微波山': { 
        top: 580, left: 225, width: 300, 
        frame: ATLAS_BASE + 'dengshan/18_weiboshan_frame.png', 
        icon: ATLAS_BASE + 'dengshan/18_weiboshan_pic.png',
        ...getRoutePaths('dengshan', '18_weiboshan')
      },
      '招商局历史博物馆': { 
        top: 910, left: 240, width: 320, 
        frame: ATLAS_BASE + 'dengshan/19_zhaoshangjulishi_frame.png', 
        icon: ATLAS_BASE + 'dengshan/19_zhaoshangjulishi_pic.png',
        ...getRoutePaths('dengshan', '19_zhaoshangjulishi')
      }
    }
  },
  western: {
    id: 'xican',
    name: '西餐',
    map: ATLAS_BASE + 'western/map.png',
    map_bw: ATLAS_BASE + 'western/map_bw.png',
    items: {
      'Benji Bakery': { 
        top: 900, left: 350, width: 220, 
        frame: ATLAS_BASE + 'western/宝可多_frame.png', 
        icon: ATLAS_BASE + 'western/宝可多.png',
        ...getRoutePaths('western', '00_benji')
      },
      'minimal': {
        top: 342, left: 131, width: 230,
        frame: ATLAS_BASE + 'western/minimal_frame.png',
        icon: ATLAS_BASE + 'western/minimal.png',
        ...getRoutePaths('western', '02_minimal')
      },
      'alla': { 
        top: 1080, left: 120, width: 250, 
        frame: ATLAS_BASE + 'western/alla_frame.png', 
        icon: ATLAS_BASE + 'western/alla.png',
        ...getRoutePaths('western', '03_alla')
      },
      'doors': {
        top: 610, left: 579, width: 210,
        frame: ATLAS_BASE + 'western/doors_frame.png',
        icon: ATLAS_BASE + 'western/doors.png',
        ...getRoutePaths('western', '04_doors')
      },
      'madloba': {
        top: 313, left: 407, width: 220,
        frame: ATLAS_BASE + 'western/madloba_frame.png',
        icon: ATLAS_BASE + 'western/madloba.png',
        ...getRoutePaths('western', '05_madloba')
      },
      'commune': { 
        top: 850, left: 100, width: 230, 
        frame: ATLAS_BASE + 'western/commune_frame.png', 
        icon: ATLAS_BASE + 'western/commune.png',
        ...getRoutePaths('western', '06_commune')
      },
      'Gecko Pub': { 
        top: 1050, left: 520, width: 250, 
        frame: ATLAS_BASE + 'western/壁虎餐厅_frame.png', 
        icon: ATLAS_BASE + 'western/Gecko Pub.png',
        ...getRoutePaths('western', '07_gecko')
      },
      'baker': {
        top: 581, left: 112, width: 220,
        frame: ATLAS_BASE + 'western/baker_frame.png',
        icon: ATLAS_BASE + 'western/baker.png',
        ...getRoutePaths('western', '08_baker')
      },
      'the_flames': {
        top: 538, left: 352, width: 230,
        frame: ATLAS_BASE + 'western/the_flames_frame.png',
        icon: ATLAS_BASE + 'western/the_flames.png',
        ...getRoutePaths('western', '09_flames')
      }
    }
  },
  coffee: {
    id: 'kafei',
    name: '咖啡',
    map: ATLAS_BASE + 'coffee/map.png',
    map_bw: ATLAS_BASE + 'coffee/map_bw.png',
    items: {
      '正在生活': { 
        top: 510, left: 215, width: 230, 
        frame: ATLAS_BASE + 'coffee/01_zhengzaishenghuo_frame.png', 
        icon: ATLAS_BASE + 'coffee/01_zhengzaishenghuo_pic.png',
        ...getRoutePaths('coffee', '01_zhengzaishenghuo')
      },
      '绿木': { 
        top: 280, left: 290, width: 220, 
        frame: ATLAS_BASE + 'coffee/02_greenwood_frame.png', 
        icon: ATLAS_BASE + 'coffee/02_greenwood_pic.png',
        ...getRoutePaths('coffee', '02_greenwood')
      },
      'JOJO': { 
        top: 995, left: 370, width: 240, 
        frame: ATLAS_BASE + 'coffee/03_jojo_frame.png', 
        icon: ATLAS_BASE + 'coffee/03_jojo_pic.png',
        ...getRoutePaths('coffee', '03_jojo')
      },
      '查理': {
        top: 400, left: 140, width: 220,
        frame: ATLAS_BASE + 'coffee/04_chali_frame.png',
        icon: ATLAS_BASE + 'coffee/04_chali_pic.png',
        ...getRoutePaths('coffee', '04_chali')
      },
      'NewPark': {
        top: 345, left: 385, width: 230,
        frame: ATLAS_BASE + 'coffee/05_newparkcoffee_frame.png',
        icon: ATLAS_BASE + 'coffee/05_newparkcoffee_pic.png',
        ...getRoutePaths('coffee', '05_newparkcoffee')
      },
      'Wavve': { 
        top: 455, left: 280, width: 210, 
        frame: ATLAS_BASE + 'coffee/06_wavve_frame.png', 
        icon: ATLAS_BASE + 'coffee/06_wavve_pic.png',
        ...getRoutePaths('coffee', '06_wavve')
      },
      '365': { 
        top: 710, left: 385, width: 200, 
        frame: ATLAS_BASE + 'coffee/07_365_frame.png', 
        icon: ATLAS_BASE + 'coffee/07_365_pic.png',
        ...getRoutePaths('coffee', '07_365')
      },
      '山池': {
        top: 810, left: 440, width: 250,
        frame: ATLAS_BASE + 'coffee/08_shanchi_frame.png',
        icon: ATLAS_BASE + 'coffee/08_shanchi_pic.png',
        ...getRoutePaths('coffee', '08_shanchi')
      },
      'KUDDO': { 
        top: 170, left: 340, width: 230, 
        frame: ATLAS_BASE + 'coffee/09_kuddo_frame.png', 
        icon: ATLAS_BASE + 'coffee/09_kuddo_pic.png',
        ...getRoutePaths('coffee', '09_kuddo')
      },
      '艾米丽': { 
        top: 480, left: 380, width: 210, 
        frame: ATLAS_BASE + 'coffee/10_emily_frame.png', 
        icon: ATLAS_BASE + 'coffee/10_emily_pic.png',
        ...getRoutePaths('coffee', '10_emily')
      }
    }
  }
};
