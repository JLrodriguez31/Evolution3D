import Spline from "@splinetool/react-spline";
import { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import logo from "/images/logo2.png";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/routes";
import { useAuth } from "@/auth/useAuth";

export default function WelcomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const ctaLabel = user ? "START EXPLORATION" : "ENTER WITHOUT REGISTERING";
  const [disableSecondaryScene, setDisableSecondaryScene] = useState(false);
  const [primaryReady, setPrimaryReady] = useState(false);
  const [secondaryMounted, setSecondaryMounted] = useState(false);
  const [secondaryReady, setSecondaryReady] = useState(false);
  const [minDelayDone, setMinDelayDone] = useState(false);
  const [secondaryTimeoutFallback, setSecondaryTimeoutFallback] =
    useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      "(orientation: landscape) and (max-height: 540px)"
    );

    const syncSecondarySceneState = () => {
      setDisableSecondaryScene(mediaQuery.matches);
    };

    syncSecondarySceneState();
    mediaQuery.addEventListener("change", syncSecondarySceneState);

    return () => {
      mediaQuery.removeEventListener("change", syncSecondarySceneState);
    };
  }, []);

  useEffect(() => {
    const minDelay = window.setTimeout(() => setMinDelayDone(true), 750);
    return () => window.clearTimeout(minDelay);
  }, []);

  useEffect(() => {
    if (!primaryReady || secondaryMounted || disableSecondaryScene) return;

    const w = globalThis as typeof globalThis & {
      requestIdleCallback?: (
        callback: IdleRequestCallback,
        opts?: IdleRequestOptions
      ) => number;
      cancelIdleCallback?: (id: number) => void;
    };

    if (typeof w.requestIdleCallback === "function") {
      const idleId = w.requestIdleCallback(() => setSecondaryMounted(true), {
        timeout: 900,
      });
      return () => {
        if (typeof w.cancelIdleCallback === "function") {
          w.cancelIdleCallback(idleId);
        }
      };
    }

    const timeoutId = globalThis.setTimeout(() => setSecondaryMounted(true), 180);
    return () => globalThis.clearTimeout(timeoutId);
  }, [primaryReady, secondaryMounted, disableSecondaryScene]);

  useEffect(() => {
    if (!secondaryMounted || secondaryReady || disableSecondaryScene) return;
    const fallback = window.setTimeout(
      () => setSecondaryTimeoutFallback(true),
      6000
    );
    return () => window.clearTimeout(fallback);
  }, [secondaryMounted, secondaryReady, disableSecondaryScene]);

  const pageReady =
    primaryReady &&
    (disableSecondaryScene || secondaryReady || secondaryTimeoutFallback) &&
    minDelayDone;

  return (
    <main className="w-full h-dvh overflow-hidden relative bg-black">
      <div
        className={`absolute inset-0 z-50 grid place-items-center bg-black transition-opacity duration-500 ${
          pageReady ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-hidden={pageReady}
      >
        <div className="flex flex-col items-center gap-3 text-white/90">
          <div className="h-9 w-9 rounded-full border-2 border-white/20 border-t-white/90 animate-spin" />
          <p className="text-xs tracking-[0.2em] uppercase">Loading Scene</p>
        </div>
      </div>

      <div className="pointer-events-auto relative z-30">
        <Navbar
          aStyles="cursor-pointer hidden text-transparent bg-gradient-to-r from-blue-400/80 to-purple-800 bg-clip-text"
          variantButton="primary"
          variantButton2="secondary"
          logo={logo}
          borderColor="border-white/0"
        />
      </div>

      <div
        className={`w-full h-full transition-opacity duration-800 ease-out ${
          pageReady ? "opacity-100" : "opacity-0"
        }`}
        style={{ clipPath: "inset(0 0 60px 0)" }}
      >
        <Spline
          scene="https://prod.spline.design/Pud25w0I37RAD7Gq/scene.splinecode"
          onLoad={() => setPrimaryReady(true)}
        />
      </div>

      {!disableSecondaryScene && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 scale-80 xl:scale-90 2xl:scale-100 sm:left-[75vw] xl:left-[70vw] 2xl:left-[65vw] top-47 sm:top-50 xl:top-52 pointer-events-auto h-1/2 w-90 z-20 transition-opacity duration-800 ease-out [clip-path:inset(20px_0_70px_0)] sm:[clip-path:inset(60px_0_70px_0)] 2xl:[clip-path:inset(90px_100px_95px_100px)] ${
            pageReady ? "opacity-100" : "opacity-0"
          }`}
        >
          {secondaryMounted && (
            <Spline
              scene="https://prod.spline.design/LKd9I8zeBvzQ1QK9/scene.splinecode"
              onLoad={() => setSecondaryReady(true)}
            />
          )}
        </div>
      )}

      <div className="absolute bottom-6 right-6 z-40">
        <button
          onClick={() => navigate(PATHS.timeline)}
          className="px-5 py-2.5 rounded-full text-[12px] tracking-wide uppercase bg-gradient-to-r from-purple-600 to-blue-600 text-white text-sm font-medium shadow-lg shadow-purple-900/40 border border-white/10 hover:from-purple-500 hover:to-blue-500 transition"
        >
          {ctaLabel}
        </button>
      </div>
    </main>
  );
}
