/**
 * 视频播放器组件
 *
 * 基于原生 HTML5 <video>，样式美化
 *
 * @param {{ src: string, poster?: string }} props
 */

function VideoPlayer({ src, poster }) {
  if (!src) return null;

  return (
    <div className="video-player rounded-xl overflow-hidden bg-black shadow-md">
      <video
        src={src}
        poster={poster}
        controls
        controlsList="nodownload"
        preload="metadata"
        className="w-full aspect-video"
      >
        您的浏览器不支持视频播放。
      </video>
    </div>
  );
}

export default VideoPlayer;
