import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

export default function SmartVideo({
  src,
  muted = true,
  loop = true,
  autoPlay = true,
  className = "",
  fallbackTheme = "",
  showCenterPlay = false,
  videoRef = null,
}) {
  const internalRef = useRef(null);
  const ref = videoRef || internalRef;

  const [failed, setFailed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setFailed(false);
    setIsReady(false);
  }, [src]);

  useEffect(() => {
    const video = ref.current;
    if (!video || !src) return;

    video.muted = muted;
    video.loop = loop;
    video.playsInline = true;

    const tryPlay = async () => {
      try {
        if (autoPlay) {
          await video.play();
        }
      } catch {
        //
      }
    };

    const handleLoaded = async () => {
      setIsReady(true);
      await tryPlay();
    };

    const handleCanPlay = async () => {
      await tryPlay();
    };

    const handleError = () => {
      setFailed(true);
    };

    video.addEventListener("loadedmetadata", handleLoaded);
    video.addEventListener("canplay", handleCanPlay);
    video.addEventListener("error", handleError);

    if (video.readyState >= 2) {
      handleLoaded();
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoaded);
      video.removeEventListener("canplay", handleCanPlay);
      video.removeEventListener("error", handleError);
    };
  }, [src, muted, loop, autoPlay, ref]);

  if (!src || failed) {
    return (
      <div className={`absolute inset-0 bg-gradient-to-b ${fallbackTheme}`}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-10 right-0 h-28 w-28 rounded-full bg-black/20 blur-2xl" />

        {showCenterPlay && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur">
              <Play size={24} fill="currentColor" />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <video
        key={src}
        ref={ref}
        className={className}
        src={src}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
        preload="metadata"
      />

      {!isReady && (
        <div className={`absolute inset-0 bg-gradient-to-b ${fallbackTheme}`}>
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}
    </>
  );
}