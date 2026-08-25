import { motion } from 'framer-motion';
import { ROUTE_CONFIG } from '../utils/constants';
import RouteOverview from './RouteOverview';
import { useInView } from '../hooks/useInView';

/**
 * 地图区域容器
 *
 * 包含：
 * - 区域标题
 * - 静态路线概览图（带可点击标注）
 *
 * @param {{
 *   activePlaceId: number|null,
 *   onMarkerClick: (placeId: number) => void,
 * }} props
 */

function MapSection({ activePlaceId, onMarkerClick }) {
  const [ref, isInView] = useInView();

  return (
    <section id="map" className="relative py-20 sm:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4" ref={ref}>
        {/* 区域标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-4">
            探索路线
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto mb-6">
            从青海湖畔到罗布泊腹地，跨越青海、甘肃、新疆三省区
          </p>

          {/* 路线图例 */}
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span
                className="w-8 h-1 rounded-full"
                style={{ backgroundColor: ROUTE_CONFIG.color }}
              />
              <span className="text-text-secondary">{ROUTE_CONFIG.name}</span>
            </div>
          </div>
        </motion.div>

        {/* 路线概览图（含可点击标注） */}
        <RouteOverview
          activePlaceId={activePlaceId}
          onMarkerClick={onMarkerClick}
        />
      </div>
    </section>
  );
}

export default MapSection;
