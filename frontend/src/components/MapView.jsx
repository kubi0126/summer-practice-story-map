import { useEffect, useRef, useCallback } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { ROUTE_CONFIG, PLACES, MAP_CONFIG } from '../utils/constants';
import PlaceMarker from './PlaceMarker';

/**
 * 地图飞行控制器
 *
 * 当 flyToPlaceId 变化时，地图自动飞行到对应地点
 */
function FlyController({ placeId, onComplete }) {
  const map = useMap();

  useEffect(() => {
    if (placeId == null) return;

    const place = PLACES.find((p) => p.id === placeId);
    if (place) {
      map.flyTo([place.latitude, place.longitude], 10, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }

    // 飞行完成后清除
    const timer = setTimeout(() => onComplete?.(), 1600);
    return () => clearTimeout(timer);
  }, [placeId, map, onComplete]);

  return null;
}

/**
 * 地图主组件
 *
 * 核心地图，包含：
 * - OpenStreetMap 底图
 * - 路线 Polyline
 * - 各地点的 Marker
 * - 地图飞行动画
 *
 * @param {{
 *   activePlaceId: number|null,
 *   flyToPlaceId: number|null,
 *   onMarkerClick: (placeId: number) => void,
 *   onClearFlyTo: () => void,
 * }} props
 */
function MapView({ activePlaceId, flyToPlaceId, onMarkerClick, onClearFlyTo }) {
  const mapRef = useRef(null);

  // 从 PLACES 提取路线坐标（按 dayNumber 排序）
  const routeCoords = [...PLACES]
    .sort((a, b) => a.dayNumber - b.dayNumber)
    .map((p) => [p.latitude, p.longitude]);

  // 地图就绪回调
  const handleMapReady = useCallback(() => {
    // 预留：地图加载完成后的初始化逻辑
  }, []);

  return (
    <MapContainer
      ref={mapRef}
      center={MAP_CONFIG.center}
      zoom={MAP_CONFIG.zoom}
      minZoom={MAP_CONFIG.minZoom}
      maxZoom={MAP_CONFIG.maxZoom}
      scrollWheelZoom={MAP_CONFIG.scrollWheelZoom}
      dragging={MAP_CONFIG.dragging}
      whenReady={handleMapReady}
      style={{ width: '100%', height: '100%' }}
      zoomControl={true}
      attributionControl={true}
    >
      {/* 底图瓦片 */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 路线 */}
      <Polyline
        positions={routeCoords}
        pathOptions={{
          color: ROUTE_CONFIG.color,
          weight: 4,
          opacity: 0.8,
          dashArray: '8 4', // 虚线，体现"征途"感
        }}
      />

      {/* 地点 Marker */}
      {PLACES.map((place) => (
        <PlaceMarker
          key={place.id}
          place={place}
          isActive={place.id === activePlaceId}
          color={ROUTE_CONFIG.color}
          onClick={() => onMarkerClick(place.id)}
        />
      ))}

      {/* 飞行控制器 */}
      <FlyController placeId={flyToPlaceId} onComplete={onClearFlyTo} />
    </MapContainer>
  );
}

export default MapView;
