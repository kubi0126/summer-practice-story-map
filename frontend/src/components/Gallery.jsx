import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import Lightbox from './Lightbox';

// Swiper 样式在组件内按需引入
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * 图片轮播组件
 *
 * 特性：
 * - 自动播放（5 秒间隔）
 * - 左右箭头 + 键盘 ← →
 * - 底部指示器圆点
 * - 点击放大到 Lightbox
 *
 * @param {{ images: Array<{ id: number, url: string, caption: string }> }} props
 */

function Gallery({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // 占位图（开发阶段使用）
  const placeholderImages = [
    { id: 0, url: 'https://placehold.co/800x500/E67E22/white?text=图片+1', caption: '示例图片 1' },
    { id: 1, url: 'https://placehold.co/800x500/D35400/white?text=图片+2', caption: '示例图片 2' },
    { id: 2, url: 'https://placehold.co/800x500/E67E22/white?text=图片+3', caption: '示例图片 3' },
  ];

  const displayImages = images.length > 0 ? images : placeholderImages;

  const handleImageClick = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="gallery">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={8}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop={displayImages.length > 1}
        className="rounded-xl overflow-hidden"
      >
        {displayImages.map((img, index) => (
          <SwiperSlide key={img.id || index}>
            <div
              className="relative aspect-[16/10] bg-gray-100 cursor-pointer group"
              onClick={() => handleImageClick(index)}
            >
              <img
                src={img.url}
                alt={img.caption || `图片 ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {/* Hover 放大提示 */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                <span className="opacity-0 group-hover:opacity-100 text-white text-sm bg-black/50 px-3 py-1.5 rounded-lg transition-opacity">
                  🔍 点击放大
                </span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lightbox 全屏查看 */}
      {lightboxOpen && (
        <Lightbox
          images={displayImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}

export default Gallery;
