import { useEffect, useMemo, useRef } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

/**
 * 自定义地点 Marker 组件
 *
 * 特性：
 * - 自定义 SVG 图标（圆形 + 地点编号）
 * - 点击弹出 Popup（地名 + 日期 + 摘要）
 * - 当前激活的 Marker 放大 + 呼吸动画
 *
 * @param {{
 *   place: object,
 *   isActive: boolean,
 *   color: string,
 *   onClick: () => void,
 * }} props
 */

// 生成自定义图标 SVG → Data URL
function createIconSVG(color, number, isActive) {
  const size = isActive ? 44 : 36;
  const fontSize = isActive ? 16 : 14;
  const ringWidth = isActive ? 3 : 2.5;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - ringWidth}"
        fill="${color}" fill-opacity="0.15" stroke="${color}"
        stroke-width="${ringWidth}" />
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - ringWidth - 4}"
        fill="${color}" />
      <text x="${size / 2}" y="${size / 2 + 1}" text-anchor="middle"
        dy=".1em" fill="white" font-size="${fontSize}" font-weight="bold"
        font-family="system-ui, sans-serif">${number}</text>
    </svg>
  `;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

function PlaceMarker({ place, isActive, color, onClick }) {
  const markerRef = useRef(null);

  // 创建自定义图标
  const icon = useMemo(() => {
    const iconUrl = createIconSVG(color, place.dayNumber, isActive);
    const size = isActive ? 44 : 36;

    return new L.Icon({
      iconUrl,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
    });
  }, [color, place.dayNumber, isActive]);

  // 激活时自动打开 Popup
  useEffect(() => {
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isActive]);

  return (
    <Marker
      ref={markerRef}
      position={[place.latitude, place.longitude]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="p-1 min-w-[180px]">
          <h3 className="font-semibold text-text-main text-sm mb-1">
            📍 {place.name}
          </h3>
          <p className="text-xs text-text-secondary mb-1">
            📅 {place.date}
          </p>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            {place.summary}
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="text-xs text-route-west font-medium hover:underline"
          >
            查看详情 →
          </button>
        </div>
      </Popup>
    </Marker>
  );
}

export default PlaceMarker;
