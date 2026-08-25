/**
 * 统一响应格式中间件
 *
 * 用法：
 *   const { success, error } = require('../middleware/response');
 *   success(res, data, '获取成功');
 *   error(res, 404, '资源不存在', err);
 */

function success(res, data, message = 'ok') {
  return res.json({ code: 200, message, data });
}

function error(res, code = 500, message = '服务器错误', err = null) {
  return res.status(code).json({
    code,
    message,
    error: err?.message || null,
  });
}

module.exports = { success, error };
