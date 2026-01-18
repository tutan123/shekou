// 修改日期: 2026-01-18
import { ASSETS_CONFIG } from './assets-config.js';

/**
 * 蛇口全量手绘地图 POI 数据集
 * 坐标系已针对手绘大地图(图2)进行像素级对齐，并优化了重叠问题
 */
export const POI_DATA = [
  // --- 北部区域 ---
  { 
    name: '蛇口招商花园城', top: 6, left: 40, 
    desc: '蛇口核心商业综合体，集购物、餐饮、休闲于一体。', 
    img: ASSETS_CONFIG.atlas.history.items['08'] 
  },
  {
    name: '空谈误国', top: 23, left: 34,
    desc: '“空谈误国，实干兴邦”标语牌，见证蛇口奋斗精神。',
    img: ASSETS_CONFIG.atlas.history.items['01']
  },
  { 
    name: '四海公园', top: 24, left: 44, // 修正：左移
    desc: '蛇口历史悠久的公园，标志性的“盖世金牛”所在地。', 
    img: ASSETS_CONFIG.atlas.history.items['04'] 
  },
  {
    name: '荔枝公园', top: 41, left: 24,
    desc: '充满自然气息的公园，蛇口居民休闲健身的好去处。',
    img: ASSETS_CONFIG.atlas.history.items['08']
  },
  {
    name: 'G&G', top: 33, left: 28,
    desc: '由旧工厂改造的网红创意园区，充满生活美学。',
    img: ASSETS_CONFIG.atlas.history.items['04']
  },

  // --- 中部区域 ---
  {
    name: '南玻集团', top: 28, left: 32,
    desc: '中国玻璃工业的开拓者，蛇口早期工业的代表。',
    img: ASSETS_CONFIG.atlas.history.items['02']
  },
  { 
    name: '育才一小', top: 31, left: 35, 
    desc: '蛇口名校，为特区建设培养了大量优秀人才。', 
    img: ASSETS_CONFIG.atlas.history.items['03'] 
  },
  { 
    name: '水湾源华', top: 34, left: 32, 
    desc: '记录了水湾村与蛇口共同发展的历史足迹。', 
    img: ASSETS_CONFIG.atlas.history.items['05'] 
  },
  { 
    name: '水湾村史馆', top: 36, left: 29, 
    desc: '展示水湾村历史变迁与民俗文化的窗口。', 
    img: ASSETS_CONFIG.atlas.history.items['06'] 
  },
  { 
    name: '水湾1979', top: 38, left: 33, 
    desc: '融合历史底缘与现代商业的时尚地标。', 
    img: ASSETS_CONFIG.images.markerPlaceholder 
  },
  {
    name: '南海意库', top: 46, left: 29,
    desc: '由三洋厂房改造而成，是深港创意产业的聚集地。',
    img: ASSETS_CONFIG.atlas.history.items['09']
  },

  // --- 南部区域 ---
  { 
    name: '南山公园', top: 52, left: 19, 
    desc: '登高远眺，尽览蛇口港、海上世界与深圳湾美景。', 
    img: ASSETS_CONFIG.images.markerPlaceholder 
  },
  { 
    name: '海上世界', top: 46, left: 26, 
    desc: '蛇口最著名的商业中心与地标，国际化生活的缩影。', 
    img: ASSETS_CONFIG.atlas.history.items['13'] 
  },
  { 
    name: '海上世界文化艺术中心', top: 63, left: 34, 
    desc: '世界级的文化艺术地标，由建筑大师槙文彦设计。', 
    img: ASSETS_CONFIG.atlas.history.items['13'] 
  },
  {
    name: '明华轮', top: 55, left: 27,
    desc: '原名为“安瑟尔广场”号，邓小平同志亲笔题名“海上世界”。',
    img: ASSETS_CONFIG.atlas.history.items['11']
  },
  { 
    name: '女娲像', top: 54, left: 34, 
    desc: '屹立在海边的标志性雕塑，象征着开拓创新的精神。', 
    img: ASSETS_CONFIG.atlas.history.items['12'] 
  },
  { 
    name: '南海酒店', top: 66, left: 26, 
    desc: '深圳第一家五星级酒店，承载着蛇口对外的窗口记忆。', 
    img: ASSETS_CONFIG.atlas.history.items['15'] 
  },
  { 
    name: '碧涛苑', top: 52, left: 38, 
    desc: '蛇口早期的涉外别墅区，环境优美，充满异国风情。', 
    img: ASSETS_CONFIG.atlas.history.items['16'] 
  },
  {
    name: '防波堤公园', top: 60, left: 38,
    desc: '漫步海边长廊，感受海风拂面，享受宁静的滨海时光。',
    img: ASSETS_CONFIG.images.markerPlaceholder
  },

  // --- 西南区域 ---
  {
    name: '时间标语', top: 60, left: 20,
    desc: '“时间就是金钱，效率就是生命”，中国改革开放最响亮的口号。',
    img: ASSETS_CONFIG.atlas.history.items['17']
  },
  { 
    name: '微波山', top: 74, left: 21, 
    desc: '中国改革开放“第一炮”炸响的地方。', 
    img: ASSETS_CONFIG.atlas.history.items['18'] 
  },
  { 
    name: '大陆面粉厂', top: 80, left: 14, 
    desc: '曾经的亚洲最大面粉厂，现已变身为文化创意空间。', 
    img: ASSETS_CONFIG.images.markerPlaceholder 
  },
  { 
    name: 'K11购物中心', top: 84, left: 19, 
    desc: '融合艺术、人文、自然的高端购物艺术中心。', 
    img: ASSETS_CONFIG.images.markerPlaceholder 
  },
  {
    name: '招商局历史博物馆', top: 69, left: 23,
    desc: '收藏了大量珍贵历史档案，见证招商局跨越百年的沧桑。',
    img: ASSETS_CONFIG.atlas.history.items['19']
  }
];

export default POI_DATA;
