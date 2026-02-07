/**
 * 蛇口地图投影算法
 * 用于将真实地理坐标 (GCJ-02) 映射到手绘地图的百分比坐标 (top/left %)
 */

// 参考点数据集 (真实坐标与手绘图坐标的对应关系)
// 选取的点应尽量分布在地图的各个角落
const REFERENCE_POINTS = [
  {
    name: '蛇口招商花园城',
    lng: 113.918, lat: 22.505, // 真实 GCJ-02
    left: 40, top: 6          // 手绘图百分比
  },
  {
    name: '四海公园',
    lng: 113.923, lat: 22.493,
    left: 44, top: 24
  },
  {
    name: '明华轮',
    lng: 113.912, lat: 22.486,
    left: 27, top: 55
  },
  {
    name: '女娲像',
    lng: 113.919, lat: 22.483,
    left: 34, top: 54
  },
  {
    name: '招商局历史博物馆',
    lng: 113.908, lat: 22.479,
    left: 21, top: 74
  }
];

/**
 * 使用反距离加权 (IDW) 算法进行坐标转换
 * 这种算法能较好地处理手绘地图的不规则形变
 * @param {number} lng 
 * @param {number} lat 
 * @returns {object} { top, left, inBounds }
 */
export function projectCoordinates(lng, lat) {
  // 1. 判断是否在蛇口大致区域内 (粗略矩形范围)
  // 蛇口经纬度范围大约在 113.88 ~ 113.96, 22.46 ~ 22.52
  const BOUNDS = {
    minLng: 113.89, maxLng: 113.95,
    minLat: 22.46, maxLat: 22.515
  };

  const inBounds = (
    lng >= BOUNDS.minLng && lng <= BOUNDS.maxLng &&
    lat >= BOUNDS.minLat && lat <= BOUNDS.maxLat
  );

  // 2. 计算映射坐标
  let totalWeight = 0;
  let weightedTop = 0;
  let weightedLeft = 0;

  // 使用 IDW 算法，p=2
  for (const p of REFERENCE_POINTS) {
    const dLng = lng - p.lng;
    const dLat = lat - p.lat;
    const distSq = dLng * dLng + dLat * dLat;

    // 如果正好落在参考点上
    if (distSq < 1e-10) {
      return { top: p.top, left: p.left, inBounds: true };
    }

    const weight = 1 / distSq;
    weightedTop += p.top * weight;
    weightedLeft += p.left * weight;
    totalWeight += weight;
  }

  const top = weightedTop / totalWeight;
  const left = weightedLeft / totalWeight;

  return { top, left, inBounds };
}

/**
 * 计算两个经纬度之间的距离 (哈弗辛公式 Haversine formula)
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @returns {number} 距离(米)
 */
export function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // 地球半径(米)
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export default {
  projectCoordinates,
  getDistance,
  REFERENCE_POINTS
};
