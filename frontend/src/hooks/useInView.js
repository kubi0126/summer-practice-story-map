import { useState, useEffect, useRef } from 'react';

/**
 * Intersection Observer Hook
 *
 * 检测元素是否进入视口
 *
 * @param {object} options - IntersectionObserver 配置
 * @returns {[React.RefObject, boolean]} [ref, isInView]
 *
 * 用法：
 *   const [ref, isInView] = useInView({ threshold: 0.3 });
 *   <div ref={ref}>{isInView && <AnimatedContent />}</div>
 */
export function useInView(options = {}) {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          // 进入后取消观察（只触发一次动画）
          observer.unobserve(element);
        }
      },
      { threshold: 0.2, ...options }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
}

export default useInView;
