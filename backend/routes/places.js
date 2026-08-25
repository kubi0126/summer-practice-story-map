const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { success, error } = require('../middleware/response');

const DB_PATH = path.join(__dirname, '..', 'database', 'database.db');

/**
 * GET /api/places
 * 获取所有地点
 *
 * Query:
 *   ?route_id=1  按路线筛选（可选）
 */
router.get('/', (req, res) => {
  try {
    const db = new Database(DB_PATH, { readonly: true });
    let places;

    if (req.query.route_id) {
      places = db
        .prepare('SELECT * FROM places WHERE route_id = ? ORDER BY day_number')
        .all(req.query.route_id);
    } else {
      places = db.prepare('SELECT * FROM places ORDER BY date').all();
    }

    db.close();
    success(res, places);
  } catch (err) {
    error(res, 500, '获取地点列表失败', err);
  }
});

/**
 * GET /api/places/:id
 * 获取单个地点详情（含图片列表）
 */
router.get('/:id', (req, res) => {
  try {
    const db = new Database(DB_PATH, { readonly: true });

    const place = db
      .prepare(`
        SELECT p.*, r.name AS route_name, r.color AS route_color
        FROM places p
        JOIN routes r ON r.id = p.route_id
        WHERE p.id = ?
      `)
      .get(req.params.id);

    if (!place) {
      db.close();
      return error(res, 404, '地点不存在');
    }

    // 获取关联图片
    const images = db
      .prepare('SELECT * FROM images WHERE place_id = ? ORDER BY sort_order')
      .all(place.id);

    db.close();

    success(res, { ...place, images });
  } catch (err) {
    error(res, 500, '获取地点详情失败', err);
  }
});

/**
 * GET /api/statistics
 * 获取统计数据
 */
router.get('/stats/all', (req, res) => {
  try {
    const db = new Database(DB_PATH, { readonly: true });
    const stats = db.prepare('SELECT * FROM statistics ORDER BY sort_order').all();
    db.close();
    success(res, stats);
  } catch (err) {
    error(res, 500, '获取统计数据失败', err);
  }
});

/**
 * GET /api/members
 * 获取团队成员
 */
router.get('/members/all', (req, res) => {
  try {
    const db = new Database(DB_PATH, { readonly: true });
    const members = db.prepare('SELECT * FROM members ORDER BY sort_order').all();
    db.close();
    success(res, members);
  } catch (err) {
    error(res, 500, '获取团队成员失败', err);
  }
});

module.exports = router;
