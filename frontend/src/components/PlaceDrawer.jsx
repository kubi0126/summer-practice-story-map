import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PLACES, ROUTE_CONFIG } from '../utils/constants';
import { formatDateFull } from '../utils/formatDate';
import Gallery from './Gallery';
import VideoPlayer from './VideoPlayer';

/**
 * 地点详情侧边栏组件
 *
 * 从右侧滑入，展示：
 * - 地点名称、日期、路线标签
 * - 图片轮播
 * - 实践内容文字
 * - 视频（可选）
 * - 实践感悟
 *
 * @param {{
 *   placeId: number|null,
 *   isOpen: boolean,
 *   onClose: () => void,
 * }} props
 */

function PlaceDrawer({ placeId, isOpen, onClose }) {
  const [place, setPlace] = useState(null);

  // 根据 placeId 查找地点数据
  useEffect(() => {
    if (placeId != null) {
      const found = PLACES.find((p) => p.id === placeId);
      setPlace(found || null);
    }
  }, [placeId]);

  // Esc 键关闭
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!place) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          />

          {/* 侧边栏 */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 z-50 w-full sm:w-[440px] h-full
              bg-white shadow-2xl overflow-y-auto"
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center
                justify-center rounded-full bg-white/90 shadow-md
                hover:bg-white transition-colors text-text-secondary hover:text-text-main"
              aria-label="关闭"
            >
              ✕
            </button>

            {/* 内容区 */}
            <div className="p-6 pt-14">
              {/* 路线标签 */}
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: ROUTE_CONFIG.color }}
                />
                <span className="text-xs text-text-secondary">
                  {ROUTE_CONFIG.name}
                </span>
              </div>

              {/* 地点名称 */}
              <h2 className="text-2xl font-bold text-text-main mb-2">
                📍 {place.name}
              </h2>

              {/* 日期 */}
              <p className="text-sm text-text-secondary mb-4">
                📅 {formatDateFull(place.date)} · 第 {place.dayNumber} 天
              </p>

              {/* 图片轮播 */}
              <div className="mb-6">
                <Gallery images={place.images} />
              </div>

              {/* 一句话摘要 */}
              <p className="text-text-main font-medium mb-4 leading-relaxed">
                {place.summary}
              </p>

              {/* 实践内容 */}
              {place.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-main mb-2">
                    📝 实践内容
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {place.description}
                  </p>
                </div>
              )}

              {/* 视频 */}
              {place.videoUrl && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-text-main mb-2">
                    🎬 实践视频
                  </h3>
                  <VideoPlayer src={place.videoUrl} />
                </div>
              )}

              {/* 实践感悟 */}
              {place.reflection && (
                <div className="mb-6 bg-route-west/5 rounded-xl p-4">
                  <h3 className="text-sm font-semibold text-text-main mb-2">
                    💡 实践感悟
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
                    {place.reflection}
                  </p>
                </div>
              )}

              {/* 空内容提示 */}
              {!place.description && !place.reflection && (
                <div className="text-center py-12 text-text-secondary">
                  <p className="text-4xl mb-3">📝</p>
                  <p className="text-sm">详细内容正在整理中…</p>
                  <p className="text-xs mt-1 text-text-secondary/60">
                    请在实际开发时填充 description 和 reflection 字段
                  </p>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

export default PlaceDrawer;
