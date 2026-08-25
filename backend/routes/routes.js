const express = require('express');
const router = express.Router();
const Database = require('better-sqlite3');
const path = require('path');
const { success, error } = require('../middleware/response');

const DB_PATH = path.join(__dirname, '..', 'database', 'database.db');

/**
 * GET /api/routes
 * 获取所有路线
 */
router.get('/', (req, res) => {
  try {
    const db = new Database(DB_PATH, { readonly: true });
    const routes = db
      .prepare(`
        SELECT r.*, COUNT(p.id) AS place_count
        FROM routes r
        LEFT JOIN places p ON p.route_id = r.id
        GROUP BY r.id
        ORDER BY r.sort_order
      `)
      .all();
    db.close();

    success(res, routes);
  } catch (err) {
    error(res, 500, '获取路线失败', err);
  }
});

/**
 * GET /api/routes/:id
 * 获取单条路线（含该路线所有地点）
 */
router.get('/:id', (req, res) => {
  try {
    const db = new Database(DB_PATH, { readonly: true });
    const route = db.prepare('SELECT * FROM routes WHERE id = ?').get(req.params.id);

    if (!route) {
      db.close();
      return error(res, 404, '路线不存在');
    }

    const places = db
      .prepare(`
        SELECT p.*,
          (SELECT url FROM images WHERE place_id = p.id AND is_cover = 1 LIMIT 1) AS cover_image
        FROM places p
        WHERE p.route_id = ?
        ORDER BY p.day_number
      `)
      .all(route.id);

    db.close();

    success(res, { ...route, places });
  } catch (err) {
    error(res, 500, '获取路线详情失败', err);
  }
});

module.exports = router;
