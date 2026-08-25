/**
 * 种子数据填充脚本
 *
 * 插入初始数据（路线 + 地点 + 统计 + 团队成员）
 * 运行：node database/seed.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');

console.log('🌱 正在填充种子数据…');

const db = new Database(DB_PATH);
db.pragma('foreign_keys = ON');

// 先清空已有数据
db.exec('DELETE FROM images');
db.exec('DELETE FROM places');
db.exec('DELETE FROM routes');
db.exec('DELETE FROM members');
db.exec('DELETE FROM statistics');

// ============================================
// 路线
// ============================================
const insertRoute = db.prepare(`
  INSERT INTO routes (name, color, description, sort_order)
  VALUES (?, ?, ?, ?)
`);

insertRoute.run(
  '西宁 — 马兰线',
  '#E67E22',
  '从青海湖畔到罗布泊腹地，跨越青海、甘肃、新疆三省区，探访西部发展与科学家精神',
  1
);

console.log('✅ 路线数据已插入');

// ============================================
// 实践地点
// ============================================
const insertPlace = db.prepare(`
  INSERT INTO places (route_id, name, latitude, longitude, date, day_number, summary)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const places = [
  [1, '西宁',           36.6232, 101.7784, '2026-07-11', 1, '抵达青海省会西宁，并赴金银滩参访核武器研制基地，感悟"两弹一星"精神与牧民的无私奉献'],
  [1, '嘉峪关',         39.7731,  98.2894, '2026-07-12', 2, '万里长城西端起点，探访中核四〇四展览馆，感悟"两弹一星"奋斗底色、见证移民新城崛起'],
  [1, '马兰基地',       42.0175,  87.8308, '2026-07-13', 3, '中国核试验基地，感悟马兰精神与"两弹一星"科学家奉献'],
  [1, '乌鲁木齐',       43.8256,  87.6168, '2026-07-14', 4, '新疆首府，丝路经济带核心区，调研民族团结与向西开放'],
];

const insertManyPlaces = db.transaction(() => {
  for (const p of places) {
    insertPlace.run(...p);
  }
});
insertManyPlaces();

console.log('✅ 地点数据已插入');

// ============================================
// 统计数据
// ============================================
const insertStat = db.prepare(`
  INSERT INTO statistics (label, value, unit, sort_order) VALUES (?, ?, ?, ?)
`);

const stats = [
  ['实践天数', 6,     '天',   1],
  ['跨越省区', 3,     '个',   2],
  ['红色教育基地', 12, '处',   3],
  ['牧民搬迁', 6700,  '人',   4],
  ['口述史料', 9893,  '字',   5],
  ['调研里程', 2160,  '公里', 6],
  ['清洁能源占比', 93, '%',   7],
  ['团队成员', 7,     '人',   8],
];

const insertManyStats = db.transaction(() => {
  for (const s of stats) {
    insertStat.run(...s);
  }
});
insertManyStats();

console.log('✅ 统计数据已插入');

// ============================================
// 团队成员
// ============================================
const insertMember = db.prepare(`
  INSERT INTO members (name, role, bio, avatar_url, sort_order)
  VALUES (?, ?, ?, ?, ?)
`);

const members = [
  ['杨煜坤', '负责人',   '大气科学学院 · 全程统筹、调研访谈、审核校验',       '/uploads/team/default-avatar.svg', 1],
  ['高漪静', '采编文字', '马克思主义学院 · 采编文字、汇总统稿',               '/uploads/team/default-avatar.svg', 2],
  ['毛欣然', '调研访谈', '大气科学学院 · 调研访谈、报告撰写',                 '/uploads/team/default-avatar.svg', 3],
  ['魏雨萱', '宣讲授课', '化学学院 · 宣讲授课、报告撰写',                     '/uploads/team/default-avatar.svg', 4],
  ['尹照达', '摄影摄像', '计算机学院 · 摄影摄像、报告撰写',                   '/uploads/team/default-avatar.svg', 5],
  ['高嘉琪', '采编文字', '化学学院 · 采编文字、报告撰写',                     '/uploads/team/default-avatar.svg', 6],
  ['祝一菲', '摄影摄像', '智能软件与工程学院 · 摄影摄像、报告撰写',           '/uploads/team/default-avatar.svg', 7],
];

const insertManyMembers = db.transaction(() => {
  for (const m of members) {
    insertMember.run(...m);
  }
});
insertManyMembers();

console.log('✅ 团队成员数据已插入');
console.log('🎉 种子数据填充完成！');

db.close();
