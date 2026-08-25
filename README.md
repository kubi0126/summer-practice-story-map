# Summer Practice Story Map — 代码文档

> 暑假社会实践成果展示平台 · 西部发展与科学家精神  
> React 18 + Vite 5 + Tailwind CSS 3 + Framer Motion 11

---

## 架构总览

```
浏览器
  │
  ▼
App.jsx （唯一状态持有者）
  │
  ├── Navbar          ← 滚动监听，透明/毛玻璃切换
  ├── HeroSection     ← 全屏封面，背景图 + 入场动画
  ├── MapSection      ← 地图区域容器，组装标题 + RouteOverview
  │   └── RouteOverview  ← 静态地图 + SVG路线 + 可点击标注 + 缩放/拖拽
  ├── TimelineSection ← 垂直时间轴，点击联动详情面板
  ├── StatsSection    ← 数字滚动动画 + 统计卡片
  ├── TeamSection     ← 团队成员网格
  ├── Footer
  └── PlaceDrawer     ← 右侧滑入详情面板（轮播 + 文字 + 视频）
```

**核心设计**：单页滚动（Single Page App），所有状态集中在 `App.jsx`，通过 props 向下传递，通过回调向上通知。不使用路由、不使用 Redux。

---

## 状态管理

所有共享状态在 `App.jsx` 顶部定义：

| 状态 | 类型 | 说明 |
|------|------|------|
| `activePlaceId` | `number \| null` | 当前选中的地点 |
| `drawerOpen` | `boolean` | 详情侧边栏开关 |

**数据流**：

```
App.jsx
  │
  │  activePlaceId, onMarkerClick  ──→  RouteOverview（标注点点击）
  │                                   →  TimelineSection（时间轴点击）
  │                                   →  PlaceDrawer（显示详情）
  │
  │  drawerOpen, onClose          ──→  PlaceDrawer（关闭按钮）
```

三个入口触发同一个 `handleMarkerClick(placeId)`：地图标注点、时间轴节点、导航栏。统一打开侧边栏 + 设置 `activePlaceId`。

---

## 组件详解

### 1. HeroSection — 首页封面

- 全屏高度（`h-screen`），背景图 `hero-bg.jpg` + `bg-black/25` 遮罩保证文字可读
- 入场动画使用 Framer Motion `fadeInUp`，各个元素依次出现（delay 递增）
- 「开始探索」按钮通过 `scrollIntoView({ behavior: 'smooth' })` 滚动到 `#map`

### 2. RouteOverview — 静态地图 + 路线标注 + 缩放（核心组件）

**缩放机制**：

```
外层容器（overflow: hidden, aspect-[16/10]）
  │
  └── 内层 wrapper（transform: scale(zoom) translate(...)）
       │
       ├── img（地图图片, object-contain）
       ├── SVG overlay（路线连线, viewBox="0 0 100 100"）
       └── HTML button × N（标注点, left/top 百分比定位）
```

- 缩放用 CSS `transform: scale()` 作用在整个内层 wrapper 上 → 图片、SVG、标注点三者同步缩放，位置永不漂移
- 鼠标滚轮事件通过原生 `addEventListener('wheel', fn, { passive: false })` 绑定 —— 这是关键，React 的 `onWheel` 默认 passive 无法 `preventDefault()`
- 缩放以鼠标位置为中心：计算 `scaleChange` 后反向调整 `translate`，使鼠标指向的点不动
- `zoomRef` / `offsetRef` 保存最新值传给原生事件回调，避免闭包过期
- 100% 时不显示拖拽光标，缩放后才可拖拽平移

**标注坐标**：`ROUTE_ANNOTATIONS` 数组中每个地点用 `left`/`top` 百分比定位（0-100），修改后浏览器热更新即可微调位置。

**点击标注点**：调用 `onMarkerClick(placeId)` → App 更新 `activePlaceId` → 侧边栏打开。

### 3. PlaceDrawer — 详情侧边栏

- 从右侧滑入（Framer Motion `spring` 动画），宽度 PC 440px / 移动端 100%
- 背景遮罩 `bg-black/30 backdrop-blur-sm`，点击遮罩或 ✕ 关闭
- 内容：路线标签 → 地点名 → 日期 → Gallery → 摘要 → 实践内容 → 视频 → 感悟
- 无内容字段时显示「详细内容正在整理中…」占位提示

### 4. TimelineSection — 时间轴

- 垂直布局：左侧编号圆点 + 连接线，右侧内容卡片
- 排序：按 `dayNumber` 升序排列
- 当前激活节点：圆点放大 + 橙色填充 + 卡片边框高亮
- 点击 → 调用 `onMarkerClick(placeId)` → 打开侧边栏

### 5. Gallery — 图片轮播

- 基于 Swiper.js，自动播放 5 秒，hover 暂停
- 无真实图片时自动降级为灰色占位图（placehold.co）
- 点击图片 → 弹出 Lightbox 全屏查看

### 6. Lightbox — 全屏查看

- 黑色遮罩 + 图片居中 + 左右箭头切换
- 键盘支持：`← →` 切换、`Esc` 关闭
- 入场/退场：Framer Motion `fade` + `scale`

### 7. StatsSection — 成果统计

- 数字滚动动画：`CountUpNumber` 用 `requestAnimationFrame` + `easeOutExpo` 缓动
- 触发条件：`IntersectionObserver` 检测元素进入视口（只触发一次）
- 网格布局：PC 4 列、移动端 2 列

### 8. Navbar — 导航栏

- 滚动监听（`window scroll` 事件 → `scrolled` 状态）
- `scrolled = false`：背景透明 + 白色文字
- `scrolled = true`：毛玻璃效果（`bg-white/85 backdrop-blur-lg`）+ 深色文字
- 移动端：汉堡菜单展开/收起
- 点击导航项 → `scrollIntoView` 平滑滚动到对应 Section

---

## 数据层

### constants.js — 所有可配置数据

这是项目中**最重要的文件**，修改内容只需改这里：

| 区域 | 变量名 | 说明 |
|------|--------|------|
| 路线 | `ROUTE_CONFIG` | 路线名称、颜色、简介 |
| 地点 | `PLACES` | 每个地点的坐标、日期、摘要、详情文字、图片 |
| 标注坐标 | `ROUTE_ANNOTATIONS` | 静态地图上的百分比位置（`left`/`top`） |
| 统计 | `STATISTICS` | 成果数字 |
| 团队 | `TEAM_MEMBERS` | 成员姓名、职责、头像 |
| 首页 | `HERO_CONFIG` | 标题、日期、团队名 |
| 导航 | `NAV_LINKS` | 导航栏链接 |

### api.js — API 服务层

当前使用静态数据模式：函数直接从 `constants.js` 导入数据并 `Promise.resolve()` 返回。

切换到后端只需改这个文件：取消注释 `fetch()` 代码，替换函数实现。前端所有组件通过 `useApiData` hook 调用，不受影响。

### 静态资源

| 路径 | 用途 |
|------|------|
| `public/assets/images/hero-bg.jpg` | 首页背景 |
| `public/assets/images/map-bg.jpg` | 路线概览地图 |
| `public/assets/images/*.jpg` | 各地点实践照片 |
| `public/assets/videos/*.mp4` | 实践视频 |
| `public/assets/team/*.svg` | 团队头像 |

---

## 技术栈

| 层 | 技术 | 理由 |
|----|------|------|
| 框架 | React 18 | 生态最成熟 |
| 构建 | Vite 5 | 秒级 HMR |
| 样式 | Tailwind CSS 3.4 | 原子化 CSS，响应式方便 |
| 动画 | Framer Motion 11 | 声明式 API，spring 动画 |
| 轮播 | Swiper 11 | 触摸滑动最成熟 |
| 后端 | Express 4（可选） | — |
| 数据库 | SQLite（可选） | — |

---

## 启动

```bash
cd frontend
npm install        # 首次
npm run dev        # → http://localhost:5173
```

## 构建

```bash
npm run build      # → dist/
npm run preview    # 本地预览生产版本
```

## 部署

推送 GitHub → Vercel 导入仓库 → Framework 选 Vite → Root Directory 设 `frontend` → Deploy。

---

## 文件索引

```
frontend/src/
├── main.jsx                    # ReactDOM.createRoot 入口
├── App.jsx                     # 根组件，状态管理
├── index.css                   # Tailwind 指令 + Leaflet/Swiper 覆盖
│
├── utils/
│   ├── constants.js            # ⭐ 所有可配置数据
│   └── formatDate.js           # 日期格式化
│
├── hooks/
│   ├── useApiData.js           # 通用数据获取 Hook
│   └── useInView.js            # IntersectionObserver Hook
│
├── services/
│   └── api.js                  # API 层（静态数据 / 后端切换点）
│
└── components/
    ├── Navbar.jsx              # 导航栏（透明→毛玻璃 + 移动端菜单）
    ├── HeroSection.jsx         # 首页封面（背景图 + 入场动画）
    ├── MapSection.jsx          # 地图区域容器
    ├── RouteOverview.jsx       # 静态地图 + SVG路线 + 标注点 + 缩放/拖拽
    ├── TimelineSection.jsx     # 垂直时间轴
    ├── PlaceDrawer.jsx         # 详情侧边栏（右侧滑入）
    ├── Gallery.jsx             # Swiper 图片轮播
    ├── Lightbox.jsx            # 全屏图片查看（键盘操作）
    ├── VideoPlayer.jsx         # 原生 video 播放器
    ├── StatsSection.jsx        # 统计面板
    ├── CountUpNumber.jsx       # 数字滚动动画
    ├── TeamSection.jsx         # 团队网格
    ├── TeamCard.jsx            # 成员卡片
    └── Footer.jsx              # 页脚

frontend/public/assets/
├── images/
│   ├── hero-bg.jpg             # 首页背景
│   └── map-bg.jpg              # 路线地图
├── videos/                     # 实践视频
└── team/
    └── default-avatar.svg      # 默认头像
```

---

## 修改指南

### 新增一个实践地点

1. 在 `constants.js` 的 `PLACES` 数组中复制一个对象，修改 `id`、`name`、坐标等
2. 在 `ROUTE_ANNOTATIONS` 中新增对应条目，设 `left`/`top` 百分比坐标
3. 在 `STATISTICS` 中更新对应数字
4. 照片放入 `public/assets/images/`，在 `images` 数组中填写路径

### 调整地图标注位置

修改 `constants.js` 中 `ROUTE_ANNOTATIONS` 的 `left`/`top` 值：
- `left` 增大 → 点向右移
- `top` 增大 → 点向下移
- 保存 → 浏览器自动刷新 → 反复微调

### 修改路线主题色

改 `ROUTE_CONFIG.color`（例如 `#E67E22` → `#2563EB`），所有标注点、连线、标签、时间轴节点自动跟随。

### 替换首页背景

将新图片放到 `public/assets/images/`，修改 `HERO_CONFIG.heroImage` 路径。

### 从静态数据切换到后端 API

编辑 `services/api.js`，把每个函数中的静态 `Promise.resolve()` 替换为 `fetch()` 调用即可。前端组件无感知。
