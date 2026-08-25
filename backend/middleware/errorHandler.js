/**
 * 全局错误处理中间件
 */
function errorHandler(err, req, res, _next) {
  console.error(`[Error] ${req.method} ${req.path}:`, err.message);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    code: statusCode,
    message: err.message || '服务器内部错误',
  });
}

module.exports = { errorHandler };
