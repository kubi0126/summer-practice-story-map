const express = require('express');
const cors = require('cors');
const path = require('path');

const routeRoutes = require('./routes/routes');
const placeRoutes = require('./routes/places');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================
// 中间件
// ============================================

// CORS（允许前端跨域访问）
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  methods: ['GET'],
  credentials: true,
}));

// JSON 解析
app.use(express.json());

// 静态文件服务（图片、视频）
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============================================
// 路由
// ============================================

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 业务路由
app.use('/api/routes', routeRoutes);
app.use('/api/places', placeRoutes);

// ============================================
// 404 处理
// ============================================
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在' });
});

// ============================================
// 全局错误处理
// ============================================
app.use(errorHandler);

// ============================================
// 启动服务
// ============================================
app.listen(PORT, () => {
  console.log(`🚀 API 服务已启动 → http://localhost:${PORT}`);
  console.log(`📋 健康检查 → http://localhost:${PORT}/api/health`);
  console.log(`🗺️  路线列表 → http://localhost:${PORT}/api/routes`);
  console.log(`📍 地点列表 → http://localhost:${PORT}/api/places`);
});

module.exports = app;
