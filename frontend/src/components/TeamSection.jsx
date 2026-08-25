import { motion } from 'framer-motion';
import { TEAM_MEMBERS } from '../utils/constants';
import TeamCard from './TeamCard';
import { useInView } from '../hooks/useInView';

/**
 * 团队介绍区域
 */

function TeamSection() {
  const [ref, isInView] = useInView();

  return (
    <section id="team" className="py-20 sm:py-28 bg-bg">
      <div className="max-w-6xl mx-auto px-4" ref={ref}>
        {/* 标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-text-main mb-4">
            团队成员
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto">
            一群走向西部的青年，用脚步丈量祖国大地
          </p>
        </motion.div>

        {/* 成员卡片网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <TeamCard member={member} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TeamSection;
