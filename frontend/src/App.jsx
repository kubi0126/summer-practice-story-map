import { useState, useCallback, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import MapSection from './components/MapSection';
import TimelineSection from './components/TimelineSection';
import StatsSection from './components/StatsSection';
import TeamSection from './components/TeamSection';
import Footer from './components/Footer';
import PlaceDrawer from './components/PlaceDrawer';
import { createCancelableDelay } from './utils/cancelableDelay';

/**
 * App — 根组件
 *
 * 状态管理：
 * - activePlaceId:  当前选中的地点（null = 未选中）
 * - drawerOpen:     详情侧边栏是否打开
 *
 * 数据流：
 * App 持有所有共享状态 → 通过 props 下发给子组件
 * 子组件通过回调函数通知 App 更新状态
 */

function App() {
  const [activePlaceId, setActivePlaceId] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const resetDelayRef = useRef(null);

  if (resetDelayRef.current === null) {
    resetDelayRef.current = createCancelableDelay();
  }

  useEffect(() => () => resetDelayRef.current.cancel(), []);

  // 路线标注点 / 时间轴点击 → 打开详情侧边栏
  const handleMarkerClick = useCallback((placeId) => {
    resetDelayRef.current.cancel();
    setActivePlaceId(placeId);
    setDrawerOpen(true);
  }, []);

  // 关闭侧边栏
  const handleDrawerClose = useCallback(() => {
    setDrawerOpen(false);
    resetDelayRef.current.schedule(() => setActivePlaceId(null), 300);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSection />

      {/* 地图 + 路线展示 */}
      <MapSection
        activePlaceId={activePlaceId}
        onMarkerClick={handleMarkerClick}
      />

      {/* 时间轴 */}
      <TimelineSection
        activePlaceId={activePlaceId}
        onTimelineClick={handleMarkerClick}
      />

      <StatsSection />
      <TeamSection />
      <Footer />

      {/* 地点详情侧边栏 */}
      <PlaceDrawer
        placeId={activePlaceId}
        isOpen={drawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  );
}

export default App;
