/**
 * API 服务层
 *
 * 当前使用静态数据导入（便于快速开发）
 * 后续切换到后端时，只需修改此文件中的函数实现即可
 */

import { PLACES, ROUTE_CONFIG, STATISTICS, TEAM_MEMBERS } from '../utils/constants';

// ============================================
// 后端 API 模式（取消注释以启用）
// ============================================
// const API_BASE = '/api';

// async function request(url) {
//   const res = await fetch(`${API_BASE}${url}`);
//   if (!res.ok) throw new Error(`API Error: ${res.status}`);
//   const json = await res.json();
//   if (json.code !== 200) throw new Error(json.message);
//   return json.data;
// }

// ============================================
// 静态数据模式（当前使用）
// ============================================

/** 获取路线数据 */
export function fetchRoutes() {
  return Promise.resolve([ROUTE_CONFIG]);
}

/** 获取单个路线（含其所有地点） */
export function fetchRouteById(id) {
  const places = PLACES.filter((p) => p.routeId === id);
  return Promise.resolve({ ...ROUTE_CONFIG, places });
}

/** 获取所有地点 */
export function fetchPlaces() {
  return Promise.resolve(PLACES);
}

/** 获取单个地点详情 */
export function fetchPlaceById(id) {
  const place = PLACES.find((p) => p.id === id);
  if (!place) return Promise.reject(new Error(`地点 ${id} 不存在`));
  return Promise.resolve({
    ...place,
    routeName: ROUTE_CONFIG.name,
    routeColor: ROUTE_CONFIG.color,
  });
}

/** 获取统计数据 */
export function fetchStatistics() {
  return Promise.resolve(STATISTICS);
}

/** 获取团队成员 */
export function fetchMembers() {
  return Promise.resolve(TEAM_MEMBERS);
}
