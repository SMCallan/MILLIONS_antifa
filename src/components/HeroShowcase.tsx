import { motion } from "framer-motion";
import { ArrowRight, CalendarDays, MapPin, Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0 },
};

export function HeroShowcase() {
  return (
    <section className="relative isolate min-h-[82svh] overflow-hidden bg-foreground text-background">
      <img
        src={site.heroImage}
        alt="Gallery installation with paintings displayed on exhibition walls"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-foreground/68" />

      <div className="container-page flex min-h-[82svh] items-end py-12 md:py-16">
        <motion.div
          className="max-w-4xl"
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.12, delayChildren: 0.1 }}
        >
          <motion.p
            variants={fadeUp}
            className="mb-5 inline-flex items-center rounded-md border border-background/35 bg-background/10 px-3 py-1 text-sm font-medium text-background"
          >
            Solidarity Park International Tour
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="max-w-4xl text-5xl font-black leading-none sm:text-6xl md:text-7xl"
          >
            A Million Words Against Fascism.
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-2xl text-lg leading-8 text-background/88 md:text-xl"
          >
            A touring exhibition of art, memory, and education built from 1,000 young artists'
            responses to the rise of fascism.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <a href="/booking">
                Host the exhibition
                <ArrowRight aria-hidden="true" />
              </a>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="/submit">
                Contribute artwork
                <Upload aria-hidden="true" />
              </a>
            </Button>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="mt-10 grid max-w-3xl grid-cols-1 gap-4 border-t border-background/30 pt-6 text-sm text-background/85 sm:grid-cols-3"
          >
            <span className="flex items-center gap-2">
              <CalendarDays className="size-4" aria-hidden="true" />
              2026-2027 route
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="size-4" aria-hidden="true" />
              Solidarity Room
            </span>
            <span className="flex items-center gap-2">
              <Upload className="size-4" aria-hidden="true" />
              Contributions open
            </span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
