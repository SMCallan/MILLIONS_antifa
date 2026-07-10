import * as React from "react";

type CanvasComponent = React.ComponentType;

function canUseWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    return false;
  }
}

/**
 * PLACEHOLDER animation loop for the single-screen home page.
 *
 * Currently renders the in-house poster-wall shader (PosterFieldCanvas) with a
 * static CSS fallback for reduced-motion / no-WebGL. When the client supplies
 * the commissioned animation loop, swap the implementation here — the home
 * page only depends on this component filling its parent.
 */
export function HomeAnimation() {
  const [Canvas, setCanvas] = React.useState<CanvasComponent | null>(null);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !canUseWebGL()) return undefined;

    let cancelled = false;
    import("@/components/PosterFieldCanvas").then((module) => {
      if (!cancelled) setCanvas(() => module.PosterFieldCanvas);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="poster-field-fallback relative h-full w-full" aria-hidden="true">
      {Canvas ? (
        <div className="absolute inset-0">
          <Canvas />
        </div>
      ) : null}
    </div>
  );
}
