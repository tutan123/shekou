// 修改日期: 2026-02-08
import { ASSETS_CONFIG } from './assets-config.js';

/**
 * 蛇口全量手绘地图 POI 数据集
 * 坐标系已针对手绘大地图(图2)进行像素级对齐，并优化了重叠问题
 * 包含真实经纬度 (lng/lat) 用于地理围栏判断
 */
export const POI_DATA = [
  // --- 北部区域 ---
  {
    name: '蛇口招商花园城', top: 6, left: 39,
    lng: 113.918, lat: 22.505,
    desc: '蛇口核心商业综合体，集购物、餐饮、休闲于一体。',
    img: ASSETS_CONFIG.atlas.history.items['08']
  },
  {
    name: '"空谈误国,实干兴邦"标语牌', top: 23, left: 34,
    lng: 113.916, lat: 22.495,
    desc: '“空谈误国，实干兴邦”标语牌，见证蛇口奋斗精神。',
    img: ASSETS_CONFIG.atlas.history.items['01']
  },
  { 
    name: '四海公园', top: 24, left: 44, 
    lng: 113.923, lat: 22.493,
    desc: '蛇口历史悠久的公园，标志性的“盖世金牛”所在地。', 
    img: ASSETS_CONFIG.atlas.history.items['04'] 
  },
  {
    name: '荔枝公园', top: 41, left: 24,
    lng: 113.910, lat: 22.490,
    desc: '充满自然气息的公园，蛇口居民休闲健身的好去处。',
    img: ASSETS_CONFIG.atlas.history.items['08']
  },
  {
    name: 'G&G创意社区', top: 33, left: 28,
    lng: 113.912, lat: 22.498,
    desc: '由旧工厂改造的网红创意园区，充满生活美学。',
    img: ASSETS_CONFIG.atlas.history.items['04']
  },

  // --- 中部区域 ---
  {
    name: '南玻集团', top: 28, left: 32,
    lng: 113.915, lat: 22.500,
    desc: '中国玻璃工业的开拓者，蛇口早期工业的代表。',
    img: ASSETS_CONFIG.atlas.history.items['02']
  },
  { 
    name: '育才中学', top: 31, left: 35, 
    lng: 113.918, lat: 22.498,
    desc: '蛇口名校，为特区建设培养了大量优秀人才。', 
    img: ASSETS_CONFIG.atlas.history.items['03'] 
  },
  { 
    name: '水湾源华实业股份有限公司', top: 34, left: 32, 
    lng: 113.915, lat: 22.495,
    desc: '记录了水湾村与蛇口共同发展的历史足迹。', 
    img: ASSETS_CONFIG.atlas.history.items['05'] 
  },
  { 
    name: '1979水湾村史馆', top: 37, left: 32, 
    lng: 113.914, lat: 22.493,
    desc: '展示水湾村历史变迁与民俗文化的窗口。', 
    img: ASSETS_CONFIG.atlas.history.items['06'] 
  },
  { 
    name: '水湾炮楼', top: 42, left: 29, 
    lng: 113.913, lat: 22.491,
    desc: '融合历史底缘与现代商业的时尚地标。', 
    img: ASSETS_CONFIG.images.markerPlaceholder 
  },
  {
    name: '南海意库', top: 46, left: 29,
    lng: 113.912, lat: 22.488,
    desc: '由三洋厂房改造而成，是深港创意产业的聚集地。',
    img: ASSETS_CONFIG.atlas.history.items['09']
  },

  // --- 南部区域 ---
  { 
    name: '海滨花园', top: 52, left: 19, 
    lng: 113.905, lat: 22.485,
    desc: '登高远眺，尽览蛇口港、海上世界与深圳湾美景。', 
    img: ASSETS_CONFIG.images.markerPlaceholder 
  },
  { 
    name: '海上世界广场', top: 46, left: 26, 
    lng: 113.910, lat: 22.486,
    desc: '蛇口最著名的商业中心与地标，国际化生活的缩影。', 
    img: ASSETS_CONFIG.atlas.history.items['13'] 
  },
  { 
    name: '海上世界文化艺术中心', top: 63, left: 34, 
    lng: 113.920, lat: 22.482,
    desc: '世界级的文化艺术地标，由建筑大师槙文彦设计。', 
    img: ASSETS_CONFIG.atlas.history.items['13'] 
  },
  {
    name: '海上世界明华轮', top: 55, left: 27,
    lng: 113.912, lat: 22.486,
    desc: '原名为“安瑟尔广场”号，邓小平同志亲笔题名“海上世界”。',
    img: ASSETS_CONFIG.atlas.history.items['11']
  },
  { 
    name: '女娲补天雕像', top: 54, left: 34, 
    lng: 113.919, lat: 22.483,
    desc: '屹立在海边的标志性雕塑，象征着开拓创新的精神。', 
    img: ASSETS_CONFIG.atlas.history.items['12'] 
  },
  { 
    name: '南海酒店', top: 66, left: 26, 
    lng: 113.910, lat: 22.480,
    desc: '深圳第一家五星级酒店，承载着蛇口对外的窗口记忆。', 
    img: ASSETS_CONFIG.atlas.history.items['15'] 
  },
  { 
    name: '碧涛苑别墅群', top: 60, left: 24, 
    lng: 113.911, lat: 22.484,
    desc: '蛇口早期的涉外别墅区，环境优美，充满异国风情。', 
    img: ASSETS_CONFIG.atlas.history.items['16'] 
  },
  {
    name: '防波堤公园', top: 60, left: 38,
    lng: 113.928, lat: 22.480,
    desc: '漫步海边长廊，感受海风拂面，享受宁静的滨海时光。',
    img: ASSETS_CONFIG.images.markerPlaceholder
  },

  // --- 西南区域 ---
  {
    name: '"时间就是金钱,效率就是生命"标语牌', top: 60, left: 20,
    lng: 113.905, lat: 22.482,
    desc: '“时间就是金钱，效率就是生命”，中国改革开放最响亮的口号。',
    img: ASSETS_CONFIG.atlas.history.items['17']
  },
  { 
    name: '微波山', top: 72, left: 21, 
    lng: 113.909, lat: 22.479,
    desc: '中国改革开放“第一炮”炸响的地方。', 
    img: ASSETS_CONFIG.atlas.history.items['18'] 
  },
  {
    name: '招商局历史博物馆', top: 69, left: 23,
    lng: 113.908, lat: 22.479,
    desc: '收藏了大量珍贵历史档案，见证招商局跨越百年的沧桑。',
    img: ASSETS_CONFIG.atlas.history.items['19']
  },
  {
    name: '袁庚铜像', top: 65, left: 30,
    lng: 113.915, lat: 22.481,
    desc: '改革先锋袁庚先生的铜像。',
    img: ASSETS_CONFIG.atlas.history.items['14']
  }
];

export default POI_DATA;
