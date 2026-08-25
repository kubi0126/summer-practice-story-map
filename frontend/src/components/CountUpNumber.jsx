import { useEffect, useRef, useState } from 'react';
import { useInView } from '../hooks/useInView';

/**
 * 数字滚动动画组件
 *
 * 当元素进入视口时，数字从 0 滚动到目标值
 *
 * @param {{ target: number, duration?: number }} props
 */

function CountUpNumber({ target, duration = 2000 }) {
  const [ref, isInView] = useInView();
  const [current, setCurrent] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!isInView) return;

    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutExpo 缓动
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    }

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {current}
    </span>
  );
}

export default CountUpNumber;
