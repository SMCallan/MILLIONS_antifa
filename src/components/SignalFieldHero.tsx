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
  className?: string;
};

const defaultBadges = [
  "Under construction",
  "World tour",
  "Millions project",
  "Open call soon",
  "Well-known artists",
  "Thousands of works",
  "Anti-fascist art",
];

const defaultStatusLines = [
  "More information releasing soon",
  "A world tour of collective anti-fascist artwork is in formation",
];

const defaultPrimaryCta = {
  label: "Tour dates",
  href: "/tour-dates",
};

const defaultSecondaryCta = {
  label: "Submit artwork",
  href: "/submit",
};

type SignalFieldCanvasComponent = React.ComponentType;

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
        !isPrimary &&
          "border-white/24 bg-white/9 text-white hover:bg-white/16 hover:text-white",
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

function HeroContent({
  reducedMotion,
  headline,
  subtitle,
  primaryCta,
  secondaryCta,
  badges,
  statusLines,
}: {
  reducedMotion: boolean;
  headline: string;
  subtitle: string;
  primaryCta: HeroCta;
  secondaryCta: HeroCta;
  badges: string[];
  statusLines: string[];
}) {
  const introVariants = {
    hidden: { opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 18 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        className="max-w-5xl"
        initial="hidden"
        animate="visible"
        transition={{ delayChildren: 0.08, staggerChildren: 0.1 }}
      >
        <motion.h1
          variants={introVariants}
          className="max-w-5xl text-4xl font-black leading-none text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {headline}
        </motion.h1>

        <motion.p
          variants={introVariants}
          className="mt-7 max-w-3xl text-lg leading-8 text-white/84 md:text-xl"
        >
          {subtitle}
        </motion.p>

        <motion.div variants={introVariants} className="mt-9 flex flex-wrap gap-3">
          <CtaLink cta={primaryCta} variant="primary" />
          <CtaLink cta={secondaryCta} variant="secondary" />
        </motion.div>

        <motion.div
          variants={introVariants}
          className="mt-10 flex max-w-4xl flex-wrap gap-2 border-t border-white/18 pt-6"
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

        <motion.div
          variants={introVariants}
          className="mt-8 grid max-w-4xl gap-3 text-sm text-white/70 sm:grid-cols-2"
        >
          {statusLines.map((line, index) => {
            const Icon = index === 0 ? CalendarDays : ShieldCheck;

            return (
              <span key={line} className="flex items-center gap-2">
                <Icon
                  className={cn("size-4", index === 0 ? "text-cyan-300" : "text-red-300")}
                  aria-hidden="true"
                />
                {line}
              </span>
            );
          })}
        </motion.div>
      </motion.div>
    </MotionConfig>
  );
}

export function SignalFieldHero({
  headline = "Anti-fascist art. Millions of voices. A world tour in formation.",
  subtitle = "This site is under construction. Soon we'll release more information about a touring exhibition featuring well-known and emerging artists: thousands of works, each carrying a thousand words. You do the math.",
  primaryCta = defaultPrimaryCta,
  secondaryCta = defaultSecondaryCta,
  badges = defaultBadges,
  statusLines = defaultStatusLines,
  compact = false,
  className,
}: SignalFieldHeroProps) {
  const reducedMotion = usePrefersReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [webglAvailable, setWebglAvailable] = React.useState(false);
  const [CanvasComponent, setCanvasComponent] =
    React.useState<SignalFieldCanvasComponent | null>(null);

  React.useEffect(() => {
    setMounted(true);
    setWebglAvailable(canUseWebGL());
  }, []);

  const showShader = mounted && webglAvailable && !reducedMotion;

  React.useEffect(() => {
    let cancelled = false;

    if (!showShader || CanvasComponent) return undefined;

    import("@/components/SignalFieldCanvas").then((module) => {
      if (!cancelled) {
        setCanvasComponent(() => module.SignalFieldCanvas);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [CanvasComponent, showShader]);

  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-[#05070b] text-white",
        compact ? "min-h-[58svh] md:min-h-[66svh]" : "min-h-[calc(100svh-4rem)]",
        className,
      )}
    >
      <div className="signal-field-fallback absolute inset-0 z-0" aria-hidden="true" />
      {showShader && CanvasComponent ? (
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <CanvasComponent />
        </div>
      ) : null}
      <div
        className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(0,0,0,0.72)_0%,rgba(0,0,0,0.38)_46%,rgba(0,0,0,0.22)_100%)]"
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
          "container-page relative z-20 flex items-start py-12 sm:py-16 md:items-center md:py-24",
          compact ? "min-h-[58svh] md:min-h-[66svh]" : "min-h-[calc(100svh-4rem)]",
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
        />
      </div>
    </section>
  );
}
