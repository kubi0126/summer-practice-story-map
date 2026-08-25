/**
 * 数据库初始化脚本
 *
 * 创建所有数据表
 * 运行：node database/init.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.db');

console.log('🔧 正在初始化数据库…');

const db = new Database(DB_PATH);

// 开启 WAL 模式（提高并发性能）
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ============================================
// 建表
// ============================================

db.exec(`
  -- 路线表
  CREATE TABLE IF NOT EXISTS routes (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    color       TEXT    NOT NULL,
    description TEXT,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now', 'localtime')),
    updated_at  TEXT    DEFAULT (datetime('now', 'localtime'))
  );

  -- 实践地点表
  CREATE TABLE IF NOT EXISTS places (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    route_id    INTEGER NOT NULL,
    name        TEXT    NOT NULL,
    latitude    REAL    NOT NULL,
    longitude   REAL    NOT NULL,
    date        TEXT    NOT NULL,
    day_number  INTEGER DEFAULT 1,
    summary     TEXT,
    description TEXT,
    reflection  TEXT,
    video_url   TEXT,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now', 'localtime')),
    updated_at  TEXT    DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (route_id) REFERENCES routes(id)
  );

  -- 图片表
  CREATE TABLE IF NOT EXISTS images (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    place_id    INTEGER NOT NULL,
    url         TEXT    NOT NULL,
    caption     TEXT,
    sort_order  INTEGER DEFAULT 0,
    is_cover    INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now', 'localtime')),
    FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
  );

  -- 团队成员表
  CREATE TABLE IF NOT EXISTS members (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    name        TEXT    NOT NULL,
    role        TEXT    NOT NULL,
    bio         TEXT,
    avatar_url  TEXT,
    sort_order  INTEGER DEFAULT 0,
    created_at  TEXT    DEFAULT (datetime('now', 'localtime'))
  );

  -- 统计数据表
  CREATE TABLE IF NOT EXISTS statistics (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    label       TEXT    NOT NULL,
    value       INTEGER NOT NULL,
    unit        TEXT,
    sort_order  INTEGER DEFAULT 0
  );
`);

console.log('✅ 数据库初始化完成！');
console.log(`📁 数据库文件：${DB_PATH}`);

db.close();
