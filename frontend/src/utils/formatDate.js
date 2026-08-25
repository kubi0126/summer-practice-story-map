/**
 * 日期格式化工具
 */

/**
 * 格式化日期为中文显示
 * @param {string} dateStr - ISO 日期字符串 "2026-07-01"
 * @returns {string} 如 "7月1日"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 格式化日期为完整中文
 * @param {string} dateStr - ISO 日期字符串
 * @returns {string} 如 "2026年7月1日"
 */
export function formatDateFull(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}
