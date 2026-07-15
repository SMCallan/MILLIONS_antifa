import { motion, MotionConfig } from "framer-motion";
import { ArrowRight, CalendarDays, ShieldCheck, Upload } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HeroCta = {
  label: string;
  href: string;
  external?: boolean;
};

type SignalFieldHeroProps = {
  headline?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  badges?: string[];
  statusLines?: string[];
  compact?: boolean;
  /**
   * "split" renders a two-column hero (logo/graphic left, title + sub text
   * right) matching the site template. "stack" is the original single-column
   * layout used on the sub-pages.
   */
  layout?: "stack" | "split";
  logo?: string;
  logoAlt?: string;
  className?: string;
};

// Kept intentionally empty (client direction, July 2026): sub-page heroes show
// headline + subtitle + CTAs only. Pass explicit arrays to reinstate chips.
const defaultBadges: string[] = [];

const defaultStatusLines: string[] = [];

const defaultPrimaryCta = {
  label: "Tour dates",
  href: "/tour-dates",
};

const defaultSecondaryCta = {
  label: "Contribute artwork",
  href: "/submit",
};

type HeroFieldCanvasComponent = React.ComponentType;

function usePrefersReducedMotion() {
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);

    update();
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  return reducedMotion;
}

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

function CtaLink({
  cta,
  variant,
}: {
  cta: HeroCta;
  variant: "primary" | "secondary";
}) {
  const isPrimary = variant === "primary";
  const Icon = cta.href.includes("submit")
    ? Upload
    : cta.href.includes("tour") || cta.href.includes("route")
      ? CalendarDays
      : isPrimary
        ? ArrowRight
        : ShieldCheck;

  return (
    <Button
      asChild
      size="lg"
      variant={isPrimary ? "default" : "outline"}
      className={cn(
        "focus-visible:ring-white/70",
        isPrimary &&
          "shadow-[0.25rem_0.25rem_0_rgba(255,255,255,0.28)] hover:border-white hover:bg-white hover:text-black",
        !isPrimary &&
          "border-white/35 bg-black/15 text-white hover:border-white hover:bg-white hover:text-black",
      )}
    >
      <a
        href={cta.href}
        target={cta.external ? "_blank" : undefined}
        rel={cta.external ? "noreferrer" : undefined}
      >
        <Icon aria-hidden="true" />
        {cta.label}
      </a>
    </Button>
  );
}

function LogoPanel({ logo, logoAlt }: { logo: string; logoAlt: string }) {
  return (
    <div className="mx-auto w-full max-w-md border-2 border-white/80 bg-white p-3 shadow-[0.55rem_0.55rem_0_var(--signal-blue)] sm:p-4">
      <img
        src={logo}
        alt={logoAlt}
        className="block w-full object-contain"
        loading="eager"
        decoding="async"
      />
    </div>
  );
}

function HeroContent({
  reducedMotion,
  headline,
  subtitle,
  primaryCta,
  secondaryCta,
  badges,
  statusLines,
  layout,
  logo,
  logoAlt,
}: {
  reducedMotion: boolean;
  headline: string;
  subtitle: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  badges: string[];
  statusLines: string[];
  layout: "stack" | "split";
  logo?: string;
  logoAlt?: string;
}) {
  const introVariants = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  const isSplit = layout === "split" && Boolean(logo);

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="w-full"
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: 0.08, staggerChildren: 0.1 }}
      >
        {isSplit ? (
          <div className="grid items-center gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
            <motion.div variants={introVariants} className="order-2 lg:order-1">
              <LogoPanel logo={logo!} logoAlt={logoAlt ?? headline} />
            </motion.div>
            <div className="order-1 lg:order-2">
              <motion.h1
                variants={introVariants}
                className="display-type text-[clamp(3rem,8vw,6.8rem)] uppercase leading-[0.92] text-white"
              >
                {headline}
              </motion.h1>
              <motion.p
                variants={introVariants}
                className="mt-6 max-w-2xl text-base font-medium leading-7 text-white/76 sm:text-lg sm:leading-8"
              >
                {subtitle}
              </motion.p>
              <motion.div variants={introVariants} className="mt-8 flex flex-wrap gap-3">
                <CtaLink cta={primaryCta} variant="primary" />
                <CtaLink cta={secondaryCta} variant="secondary" />
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl">
            <motion.h1
              variants={introVariants}
              className="display-type max-w-6xl text-[clamp(3.25rem,9.5vw,8rem)] uppercase leading-[0.9] text-white"
            >
              {headline}
            </motion.h1>

            <motion.p
              variants={introVariants}
              className="mt-7 max-w-3xl text-base font-medium leading-7 text-white/76 sm:text-lg sm:leading-8 md:text-xl"
            >
              {subtitle}
            </motion.p>

            <motion.div variants={introVariants} className="mt-9 flex flex-wrap gap-3">
              <CtaLink cta={primaryCta} variant="primary" />
              <CtaLink cta={secondaryCta} variant="secondary" />
            </motion.div>
          </div>
        )}

        {badges.length > 0 ? (
          <motion.div
            variants={introVariants}
            className="mt-10 flex max-w-5xl flex-wrap gap-2 border-t border-white/18 pt-6"
            aria-label="Project status"
          >
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-md border border-white/16 bg-white/9 px-3 py-1.5 text-sm font-medium text-white/78 backdrop-blur-md"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        ) : null}

        {statusLines.length > 0 ? (
          <motion.div
            variants={introVariants}
            className="mt-8 grid max-w-5xl gap-3 text-sm text-white/70 sm:grid-cols-2"
          >
            {statusLines.map((line, index) => {
              const Icon = index === 0 ? CalendarDays : ShieldCheck;

              return (
                <span key={line} className="flex items-center gap-2">
                  <Icon
                    className={cn("size-4", index === 0 ? "text-cyan-300" : "text-amber-300")}
                    aria-hidden="true"
                  />
                  {line}
                </span>
              );
            })}
          </motion.div>
        ) : null}
      </motion.div>
    </MotionConfig>
  );
}

export function SignalFieldHero({
  headline = "A Million Words Against Fascism.",
  subtitle = "If a picture tells a thousand words, what do a thousand artists create? A million words, each told from a unique perspective, forming an international touring exhibition against fascism.",
  primaryCta = defaultPrimaryCta,
  secondaryCta = defaultSecondaryCta,
  badges = defaultBadges,
  statusLines = defaultStatusLines,
  compact = false,
  layout = "stack",
  logo,
  logoAlt,
  className,
}: SignalFieldHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [webglAvailable, setWebglAvailable] = React.useState(false);
  const [CanvasComponent, setCanvasComponent] =
    React.useState<HeroFieldCanvasComponent | null>(null);

  React.useEffect(() => {
    setMounted(true);
    const compactViewport = window.matchMedia("(max-width: 767px)").matches;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    setWebglAvailable(!compactViewport && !connection?.saveData && canUseWebGL());
  }, []);

  const showShader = mounted && webglAvailable && !reducedMotion;

  React.useEffect(() => {
    let cancelled = false;

    if (!showShader || CanvasComponent) return undefined;

    const loadCanvas = () => {
      import("@/components/PosterFieldCanvas").then((module) => {
        if (!cancelled) {
          setCanvasComponent(() => module.PosterFieldCanvas);
        }
      });
    };
    const idleId = window.setTimeout(loadCanvas, 180);

    return () => {
      cancelled = true;
      window.clearTimeout(idleId);
    };
  }, [CanvasComponent, showShader]);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden border-b-4 border-primary bg-[#05070b] text-white",
        compact ? "min-h-[30rem] sm:min-h-[34rem]" : "min-h-[calc(100svh-4rem)]",
        className,
      )}
    >
      <div className="poster-field-fallback absolute inset-0 z-0" aria-hidden="true" />
      {showShader && CanvasComponent ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <CanvasComponent />
        </div>
      ) : null}
      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.86)_0%,rgba(0,0,0,0.58)_48%,rgba(0,0,0,0.22)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.62)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-[#05070b] to-transparent"
        aria-hidden="true"
      />

      <div
        className={cn(
          "container-page relative z-20 flex items-start py-14 sm:py-18 md:items-center md:py-24",
          compact ? "min-h-[30rem] sm:min-h-[34rem]" : "min-h-[calc(100svh-4rem)]",
        )}
      >
        <HeroContent
          reducedMotion={reducedMotion}
          headline={headline}
          subtitle={subtitle}
          primaryCta={primaryCta}
          secondaryCta={secondaryCta}
          badges={badges}
          statusLines={statusLines}
          layout={layout}
          logo={logo}
          logoAlt={logoAlt}
        />
      </div>
    </section>
  );
}
