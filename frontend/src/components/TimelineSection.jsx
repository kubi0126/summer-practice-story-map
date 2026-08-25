import { motion } from 'framer-motion';
import { PLACES } from '../utils/constants';
import { formatDate } from '../utils/formatDate';
import { useInView } from '../hooks/useInView';

/**
 * 时间轴区域组件
 *
 * 垂直时间轴，按日期排列所有实践地点。
 * 点击某个节点 → 地图飞行到对应地点 + 打开详情。
 *
 * @param {{
 *   activePlaceId: number|null,
 *   onTimelineClick: (placeId: number) => void,
 * }} props
 */

/** 单个时间轴节点 */
function TimelineNode({ place, isActive, isLast, index, isInView, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="relative flex items-start gap-6"
    >
      {/* 左侧：圆点 + 竖线 */}
      <div className="flex flex-col items-center shrink-0">
        <button
          onClick={() => onClick(place.id)}
          className={`w-10 h-10 rounded-full flex items-center justify-center
            text-sm font-bold transition-all duration-300
            ${isActive
              ? 'bg-route-west text-white scale-110 shadow-lg shadow-route-west/30'
              : 'bg-white text-route-west border-2 border-route-west hover:scale-105'
            }`}
          aria-label={`第 ${place.dayNumber} 天 — ${place.name}`}
        >
          {place.dayNumber}
        </button>
        {!isLast && (
          <div
            className="w-0.5 h-16 bg-gray-200"
            style={{ minHeight: '2rem' }}
          />
        )}
      </div>

      {/* 右侧：内容卡片 */}
      <button
        onClick={() => onClick(place.id)}
        className={`flex-1 text-left p-4 rounded-xl transition-all duration-300
          ${isActive
            ? 'bg-route-west/5 border border-route-west/20 shadow-sm'
            : 'bg-white border border-gray-100 hover:shadow-md hover:border-route-west/20'
          }`}
      >
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-text-main">
            {place.name}
          </span>
          <span className="text-xs text-text-secondary">
            {formatDate(place.date)}
          </span>
        </div>
        <p className="text-xs text-text-secondary leading-relaxed line-clamp-2">
          {place.summary}
        </p>
      </button>
    </motion.div>
  );
}

function TimelineSection({ activePlaceId, onTimelineClick }) {
  const [ref, isInView] = useInView();

  // 按 dayNumber 排序
  const sortedPlaces = [...PLACES].sort((a, b) => a.dayNumber - b.dayNumber);

  return (
    <section id="timeline" className="py-20 sm:py-28 bg-bg">
      <div className="max-w-2xl mx-auto px-4" ref={ref}>
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-4">
            实践时间轴
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            点击日期节点，回顾我们的西部之行
          </p>
        </motion.div>

        {/* 时间轴节点列表 */}
        <div className="space-y-0">
          {sortedPlaces.map((place, index) => (
            <TimelineNode
              key={place.id}
              place={place}
              isActive={place.id === activePlaceId}
              isLast={index === sortedPlaces.length - 1}
              index={index}
              isInView={isInView}
              onClick={onTimelineClick}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default TimelineSection;
