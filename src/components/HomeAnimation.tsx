import * as React from "react";

const DESKTOP_VIDEO = "/media/millions-home-desktop-720.mp4";
const MOBILE_VIDEO = "/media/millions-home-mobile.mp4";
const POSTER = "/media/millions-home-poster.jpg";

type NetworkInformation = EventTarget & {
  saveData?: boolean;
};

type NavigatorWithConnection = Navigator & {
  connection?: NetworkInformation;
};

/**
 * The commissioned home-page film. A responsive H.264 source is selected only
 * after hydration, keeping reduced-motion and data-saving visitors on the
 * lightweight poster rather than downloading a video they did not request.
 */
export function HomeAnimation() {
  const [source, setSource] = React.useState<string | null>(null);
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const compactViewport = window.matchMedia("(max-width: 767px)");
    const connection = (navigator as NavigatorWithConnection).connection;

    const selectSource = () => {
      setIsReady(false);

      if (reducedMotion.matches || connection?.saveData) {
        setSource(null);
        return;
      }

      setSource(compactViewport.matches ? MOBILE_VIDEO : DESKTOP_VIDEO);
    };

    selectSource();
    reducedMotion.addEventListener("change", selectSource);
    compactViewport.addEventListener("change", selectSource);
    connection?.addEventListener("change", selectSource);

    return () => {
      reducedMotion.removeEventListener("change", selectSource);
      compactViewport.removeEventListener("change", selectSource);
      connection?.removeEventListener("change", selectSource);
    };
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black" aria-hidden="true">
      <img
        src={POSTER}
        alt=""
        width="960"
        height="540"
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover object-center transition-[filter,opacity,transform] duration-500 ${
          source ? "scale-110 opacity-55 blur-xl md:scale-100 md:opacity-100 md:blur-none" : ""
        }`}
      />

      {source ? (
        <video
          key={source}
          src={source}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          disablePictureInPicture
          tabIndex={-1}
          onLoadedData={() => setIsReady(true)}
          onError={() => setSource(null)}
          className={`absolute inset-0 h-full w-full object-contain object-center transition-opacity duration-500 md:object-cover ${
            isReady ? "opacity-100" : "opacity-0"
          }`}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),transparent_24%,transparent_76%,rgba(0,0,0,0.12))]" />
    </div>
  );
}
