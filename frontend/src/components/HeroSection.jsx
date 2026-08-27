import { motion } from 'framer-motion';
import { HERO_CONFIG } from '../utils/constants';

/**
 * 首页封面组件
 *
 * 布局：
 * - 全屏高度（100vh）
 * - 居中文字 + 「开始探索」按钮
 * - 背景：渐变 + 实践照片虚化
 */

// 入场动画配置
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
};

function HeroSection() {
  const handleExplore = () => {
    const el = document.getElementById('map');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* 背景：实践照片 */}
      <img
        src={HERO_CONFIG.heroImage}
        alt="实践背景"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* 极淡遮罩 — 仅保证白色文字可读 */}
      <div className="absolute inset-0 bg-black/25" />

      {/* 内容 */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        {/* 标签 */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          className="inline-block mb-6 px-4 py-1.5 border border-white/20 rounded-full text-white/70 text-sm tracking-wider"
        >
          {HERO_CONFIG.subtitle}
        </motion.div>

        {/* 主标题 */}
        <motion.h1
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.15}
          className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-6 tracking-wide whitespace-nowrap"
        >
          {HERO_CONFIG.projectTitle}
        </motion.h1>

        {/* 副标题 */}
        <motion.p
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="text-lg text-white/60 mb-8 max-w-xl mx-auto"
        >
          从青海湖畔到罗布泊腹地，追寻两代建设者的足迹，
          <br />
          见证中国式现代化在西部大地的生动实践
        </motion.p>

        {/* 信息行 */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.45}
          className="flex flex-wrap justify-center gap-4 text-white/50 text-sm mb-10"
        >
          <span className="flex items-center gap-1.5">
            📅 {HERO_CONFIG.practiceDate}
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="flex items-center gap-1.5">
            👥 {HERO_CONFIG.teamName}
          </span>
        </motion.div>

        {/* CTA 按钮 */}
        <motion.button
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          onClick={handleExplore}
          className="group inline-flex items-center gap-2 px-8 py-3.5
            bg-route-west hover:bg-route-west/90
            text-white font-medium rounded-xl
            shadow-lg shadow-route-west/25 hover:shadow-route-west/40
            transition-all duration-300 hover:-translate-y-0.5"
        >
          开始探索
          <svg
            className="w-4 h-4 group-hover:translate-y-0.5 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </motion.button>
      </div>

      {/* 底部渐变提示 */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}

export default HeroSection;
