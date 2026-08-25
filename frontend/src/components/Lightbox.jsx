import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Lightbox 全屏图片查看组件
 *
 * 特性：
 * - 全屏黑色遮罩
 * - 左右箭头切换
 * - 键盘 ← → 切换、Esc 关闭
 * - 淡入淡出动画
 *
 * @param {{
 *   images: Array<{ id: number, url: string, caption: string }>,
 *   initialIndex: number,
 *   onClose: () => void,
 * }} props
 */

function Lightbox({ images, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const current = images[index];

  // 键盘交互
  const handleKeyDown = useCallback(
    (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          setIndex((prev) => (prev - 1 + images.length) % images.length);
          break;
        case 'ArrowRight':
          setIndex((prev) => (prev + 1) % images.length);
          break;
      }
    },
    [onClose, images.length]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [handleKeyDown]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center"
        onClick={onClose}
      >
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/70 hover:text-white text-2xl z-10 p-2"
          aria-label="关闭"
        >
          ✕
        </button>

        {/* 图片计数 */}
        <div className="absolute top-4 left-4 text-white/60 text-sm">
          {index + 1} / {images.length}
        </div>

        {/* 图片 */}
        <motion.img
          key={current.url}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          src={current.url}
          alt={current.caption || `图片 ${index + 1}`}
          className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />

        {/* 图片说明 */}
        {current.caption && (
          <div className="absolute bottom-6 text-white/70 text-sm">
            {current.caption}
          </div>
        )}

        {/* 左箭头 */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((prev) => (prev - 1 + images.length) % images.length);
            }}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2"
            aria-label="上一张"
          >
            ‹
          </button>
        )}

        {/* 右箭头 */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((prev) => (prev + 1) % images.length);
            }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-3xl p-2"
            aria-label="下一张"
          >
            ›
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

export default Lightbox;
