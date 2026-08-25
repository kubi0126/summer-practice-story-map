import { motion } from 'framer-motion';
import { STATISTICS } from '../utils/constants';
import CountUpNumber from './CountUpNumber';
import { useInView } from '../hooks/useInView';

/**
 * 成果统计区域
 *
 * 展示实践的关键数字：
 * 天数、地点数、采访人数、照片数等
 */

function StatsSection() {
  const [ref, isInView] = useInView();

  return (
    <section id="stats" className="py-20 sm:py-28 bg-white">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-4">
            实践成果
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            用数字记录这段旅程——每一份数据背后，都是真实的足迹与收获
          </p>
        </motion.div>

        {/* 统计卡片网格 */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {STATISTICS.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="bg-bg rounded-2xl p-6 text-center hover:shadow-md transition-shadow"
            >
              {/* 数字 */}
              <div className="text-3xl sm:text-4xl font-bold text-route-west mb-2">
                <CountUpNumber target={stat.value} />
                {stat.unit !== '个' && stat.unit !== '条' && stat.unit !== '次' && (
                  <span className="text-lg ml-0.5">{stat.unit}</span>
                )}
              </div>
              {/* 标签 */}
              <div className="text-sm text-text-secondary">
                {stat.label}
                {['个', '条', '次'].includes(stat.unit) && (
                  <span className="text-xs ml-0.5">({stat.unit})</span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsSection;
