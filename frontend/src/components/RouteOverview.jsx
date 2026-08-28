import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ROUTE_CONFIG, ROUTE_ANNOTATIONS } from '../utils/constants';
import {
  MIN_ZOOM,
  MAX_ZOOM,
  ZOOM_STEP,
  calculateWheelZoom,
  calculateDragOffset,
} from '../utils/mapInteraction';

/**
 * 路线概览图组件（支持缩放）
 *
 * - 鼠标滚轮：缩放（100% ~ 300%）
 * - 缩放时自动以鼠标位置为中心
 * - 缩放后拖拽平移
 * - 图片 + SVG 连线 + HTML 标注点 三者同步缩放
 *
 * @param {{
 *   activePlaceId: number|null,
 *   onMarkerClick: (placeId: number) => void,
 * }} props
 */

function RouteOverview({ activePlaceId, onMarkerClick }) {
  const points = [...ROUTE_ANNOTATIONS].sort((a, b) => a.placeId - b.placeId);
  const polylinePoints = points.map((p) => `${p.left},${p.top}`).join(' ');

  // 缩放和拖拽状态
  const [zoom, setZoom] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, offsetX: 0, offsetY: 0 });
  const containerRef = useRef(null);

  // 用 ref 保存最新值，避免原生事件监听器中的闭包过期
  const zoomRef = useRef(zoom);
  const offsetRef = useRef(offset);
  zoomRef.current = zoom;
  offsetRef.current = offset;

  // 限制偏移范围（不能拖出太远）
  const clampOffset = useCallback((z, ox, oy) => {
    const maxShift = (z - 1) * 500;
    return {
      x: Math.max(-maxShift, Math.min(maxShift, ox)),
      y: Math.max(-maxShift, Math.min(maxShift, oy)),
    };
  }, []);

  // ======== 原生 wheel 事件（{ passive: false } 才能阻止页面滚动）========
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e) => {
      const z = zoomRef.current;
      const { zoom: newZoom, changed } = calculateWheelZoom(z, e.deltaY);
      if (!changed) return;

      e.preventDefault();
      const rect = el.getBoundingClientRect();

      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      const scaleChange = newZoom / z;
      const o = offsetRef.current;
      const newOffsetX = mx - scaleChange * (mx - o.x);
      const newOffsetY = my - scaleChange * (my - o.y);

      setZoom(newZoom);
      setOffset(clampOffset(newZoom, newOffsetX, newOffsetY));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [clampOffset]);

  // 指针按下 → 开始拖拽（兼容鼠标、触屏和触控笔）
  const handlePointerDown = useCallback((e) => {
    if (zoom <= 1.0) return; // 100% 时不需要拖拽
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if (e.target.closest('button')) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      offsetX: offset.x,
      offsetY: offset.y,
    };
  }, [zoom, offset]);

  // 指针移动 → 拖拽中
  const handlePointerMove = useCallback((e) => {
    if (!dragging) return;
    const nextOffset = calculateDragOffset(dragStart.current, {
      x: e.clientX,
      y: e.clientY,
    });
    setOffset(clampOffset(
      zoom,
      nextOffset.x,
      nextOffset.y
    ));
  }, [dragging, zoom, clampOffset]);

  // 指针松开或取消 → 停止拖拽
  const handlePointerEnd = useCallback((e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragging(false);
  }, []);

  // 缩放按钮
  const zoomIn = () => {
    const newZoom = Math.min(MAX_ZOOM, zoom + ZOOM_STEP * 2);
    setZoom(newZoom);
    setOffset(clampOffset(newZoom, offset.x, offset.y));
  };

  const zoomOut = () => {
    const newZoom = Math.max(MIN_ZOOM, zoom - ZOOM_STEP * 2);
    setZoom(newZoom);
    if (newZoom <= 1.0) {
      setOffset({ x: 0, y: 0 });
    } else {
      setOffset(clampOffset(newZoom, offset.x, offset.y));
    }
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mb-8"
    >
      {/* ======== 地图视口（固定尺寸 + 隐藏溢出） ======== */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        className={`relative w-full aspect-[16/10] rounded-2xl overflow-hidden
          shadow-xl border border-gray-200 bg-gray-100 select-none
          ${zoom > 1.0 ? 'cursor-grab' : 'cursor-default'}
          ${dragging ? 'cursor-grabbing' : ''}`}
        style={{ touchAction: zoom > 1.0 ? 'none' : 'pan-y' }}
      >
        {/* ======== 可缩放的内容层 ======== */}
        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            transformOrigin: '0 0',
          }}
        >
          {/* 地图图片 */}
          <img
            src="assets/images/map-bg.jpg"
            alt="实践路线概览"
            className="w-full h-full object-contain"
            draggable={false}
          />

          {/* SVG 路线连线 */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={ROUTE_CONFIG.color}
              strokeWidth="1.0"
              strokeDasharray="2 1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.9"
            />
            <polyline
              points={polylinePoints}
              fill="none"
              stroke={ROUTE_CONFIG.color}
              strokeWidth="0.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.6"
            />
          </svg>

          {/* 可点击标注点 */}
          {points.map((point, index) => {
            const isActive = point.placeId === activePlaceId;

            return (
              <button
                key={point.placeId}
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkerClick(point.placeId);
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-10"
                style={{ left: `${point.left}%`, top: `${point.top}%` }}
                aria-label={`查看 ${point.name} 详情`}
              >
                {/* 脉冲外圈（激活态） */}
                {isActive && (
                  <span
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-12 h-12 rounded-full animate-ping"
                    style={{ backgroundColor: ROUTE_CONFIG.color, opacity: 0.25 }}
                  />
                )}

                {/* 圆点 */}
                <span
                  className={`relative block rounded-full flex items-center justify-center
                    shadow-md border-2 border-white
                    group-hover:scale-125 transition-all duration-200
                    ${isActive ? 'w-7 h-7 sm:w-8 sm:h-8 scale-110' : 'w-5 h-5 sm:w-6 sm:h-6'}`}
                  style={{ backgroundColor: ROUTE_CONFIG.color }}
                >
                  <span className="text-white text-[10px] sm:text-xs font-bold leading-none">
                    {index + 1}
                  </span>
                </span>

                {/* 城市名称标签 */}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 mt-1.5
                    whitespace-nowrap px-2 py-0.5 rounded-md
                    text-[10px] sm:text-xs font-semibold
                    shadow-sm border transition-all duration-200
                    ${isActive
                      ? 'scale-110 border-current'
                      : 'border-white/60 group-hover:scale-105'
                    }`}
                  style={{
                    backgroundColor: isActive
                      ? ROUTE_CONFIG.color
                      : `${ROUTE_CONFIG.color}18`,
                    color: isActive ? '#fff' : ROUTE_CONFIG.color,
                  }}
                >
                  {point.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* ======== 缩放控件（固定在视口右下角） ======== */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1">
          {/* 缩放百分比 */}
          <span className="bg-white/90 backdrop-blur text-xs font-medium text-text-secondary
            px-2 py-1.5 rounded-lg shadow-sm mr-1 select-none">
            {zoomPercent}%
          </span>

          {/* 缩小按钮 */}
          <button
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur
              rounded-lg shadow-sm hover:bg-white disabled:opacity-30
              text-text-main font-bold text-lg transition-all"
            aria-label="缩小"
          >
            −
          </button>

          {/* 放大按钮 */}
          <button
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur
              rounded-lg shadow-sm hover:bg-white disabled:opacity-30
              text-text-main font-bold text-lg transition-all"
            aria-label="放大"
          >
            +
          </button>

          {/* 重置按钮 */}
          {zoom > 1.0 && (
            <button
              onClick={() => { setZoom(1.0); setOffset({ x: 0, y: 0 }); }}
              className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur
                rounded-lg shadow-sm hover:bg-white text-text-secondary text-xs transition-all"
              aria-label="重置缩放"
              title="重置"
            >
              ⟲
            </button>
          )}
        </div>
      </div>

      {/* ======== 图例 + 提示 ======== */}
      <div className="flex flex-col items-center gap-2 mt-4 text-xs text-text-secondary">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span
              className="w-5 h-1 rounded-full"
              style={{ backgroundColor: ROUTE_CONFIG.color }}
            />
            <span>{ROUTE_CONFIG.name}</span>
          </div>
          <span>|</span>
          <span>西宁 → 嘉峪关 → 马兰 → 乌鲁木齐</span>
        </div>
        <p className="text-text-secondary/60">
          💡 点击编号圆点查看详情 &nbsp;|&nbsp; 滚轮缩放 &nbsp;|&nbsp; 缩放后可拖拽
        </p>
      </div>
    </motion.div>
  );
}

export default RouteOverview;
