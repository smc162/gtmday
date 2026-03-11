"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const BALL_COUNT = 12;
const FLOATING_BALLS = 12;
const FLOATING_SIZE = 96;

function getNextPreview(previous: number | null): number {
  const base = Math.floor(Math.random() * BALL_COUNT) + 1;
  if (previous === null || base !== previous) return base;
  return base >= BALL_COUNT ? 1 : base + 1;
}

type FloatingBall = {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

export default function RandomPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const [preview, setPreview] = useState<number | null>(null);
  const [drawn, setDrawn] = useState<number[]>([]);
  const [isRolling, setIsRolling] = useState(false);
  const [floating, setFloating] = useState<FloatingBall[]>([]);
  const [bouncingIds, setBouncingIds] = useState<Set<number>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const floatingRef = useRef<FloatingBall[]>([]);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const toggleFullscreen = async () => {
    if (!fullscreenRef.current) return;
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await fullscreenRef.current.requestFullscreen();
    }
  };

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const rect = field.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const balls: FloatingBall[] = Array.from({ length: FLOATING_BALLS }).map(
      (_, index) => ({
        id: index + 1,
        x: Math.random() * Math.max(1, width - FLOATING_SIZE),
        y: Math.random() * Math.max(1, height - FLOATING_SIZE),
        vx: (Math.random() > 0.5 ? 1 : -1) * (70 + Math.random() * 100),
        vy: (Math.random() > 0.5 ? 1 : -1) * (70 + Math.random() * 100),
      }),
    );

    floatingRef.current = balls;
    setFloating(balls);

    let animationFrame: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      const bouncedIds = new Set<number>();

      const next = floatingRef.current.map((ball) => {
        let x = ball.x + ball.vx * dt;
        let y = ball.y + ball.vy * dt;
        let vx = ball.vx;
        let vy = ball.vy;

        if (x <= 0) {
          x = 0;
          vx = Math.abs(vx);
          bouncedIds.add(ball.id);
        } else if (x + FLOATING_SIZE >= width) {
          x = width - FLOATING_SIZE;
          vx = -Math.abs(vx);
          bouncedIds.add(ball.id);
        }

        if (y <= 0) {
          y = 0;
          vy = Math.abs(vy);
          bouncedIds.add(ball.id);
        } else if (y + FLOATING_SIZE >= height) {
          y = height - FLOATING_SIZE;
          vy = -Math.abs(vy);
          bouncedIds.add(ball.id);
        }

        return { ...ball, x, y, vx, vy };
      });

      floatingRef.current = next;
      setFloating(next);
      if (bouncedIds.size > 0) setBouncingIds(bouncedIds);
      animationFrame = window.requestAnimationFrame(step);
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

  useEffect(() => {
    if (bouncingIds.size === 0) return;
    const t = window.setTimeout(() => setBouncingIds(new Set()), 400);
    return () => window.clearTimeout(t);
  }, [bouncingIds]);

  const handleDraw = () => {
    if (isRolling) return;

    const allNumbers = Array.from({ length: BALL_COUNT }, (_, index) => index + 1);
    let currentDrawn = drawn;
    let remaining = allNumbers.filter((value) => !currentDrawn.includes(value));

    if (remaining.length === 0) {
      currentDrawn = [];
      remaining = allNumbers;
    }

    const final =
      remaining[Math.floor(Math.random() * remaining.length)];
    const nextDrawn = [...currentDrawn, final];

    setIsRolling(true);

    let ticks = 0;
    const maxTicks = 28;
    const interval = window.setInterval(() => {
      ticks += 1;
      setPreview((prev) => getNextPreview(prev));
      if (ticks >= maxTicks) {
        window.clearInterval(interval);
        setIsRolling(false);
        setPreview(null);
        setSelected(final);
        setDrawn(nextDrawn);
        setShowConfetti(true);
      }
    }, 120);
  };

  const hasSelection = selected !== null;
  const displayValue = isRolling ? preview ?? selected ?? "?" : hasSelection ? selected : "?";
  const showHistory = drawn.length > 0;
  const showFocus = isRolling || hasSelection;

  useEffect(() => {
    if (!showConfetti) return;
    const t = window.setTimeout(() => setShowConfetti(false), 2800);
    return () => window.clearTimeout(t);
  }, [showConfetti]);

  return (
    <div className="page-shell">
      <section ref={fullscreenRef} className="random-layout random-fullscreen-wrap">
        <button
          type="button"
          className="fullscreen-button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        >
          {isFullscreen ? "Exit fullscreen" : "View fullscreen"}
        </button>
        <div className="random-main">
          {showConfetti && (
            <div className="confetti-container" aria-hidden>
              {Array.from({ length: 55 }).map((_, i) => {
                const duration = 2 + Math.random() * 0.8;
                const delay = Math.random() * 0.4;
                return (
                  <div
                    key={i}
                    className="confetti-piece"
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                      backgroundColor: ["#f7e46a", "#f3d34a", "#e8c730", "#fff9e6", "#050505"][
                        Math.floor(Math.random() * 5)
                      ],
                      width: `${6 + Math.random() * 10}px`,
                      height: `${6 + Math.random() * 6}px`,
                    }}
                  />
                );
              })}
            </div>
          )}
          <div className="random-field" ref={fieldRef}>
            {floating
              .filter((ball) => !drawn.includes(ball.id))
              .map((ball) => (
              <div
                key={ball.id}
                className={`random-floating-ball${
                  selected === ball.id ? " random-floating-ball--selected" : ""
                }${bouncingIds.has(ball.id) ? " random-floating-ball--bounce" : ""}`}
                style={{
                  ['--tx' as string]: `${ball.x}px`,
                  ['--ty' as string]: `${ball.y}px`,
                }}
              >
                <span className="random-floating-number">{ball.id}</span>
              </div>
            ))}
          </div>

          {showFocus && (
            <div className="random-focus">
              {hasSelection && !isRolling ? (
                Array.from(new Set(drawn.slice(-3)))
                  .slice()
                  .reverse()
                  .map((value) => (
                    <div key={value} className="random-main-ball random-main-ball--settled">
                      <span className="random-main-number">{value}</span>
                    </div>
                  ))
              ) : (
                <div
                  key="rolling"
                  className={`random-main-ball${
                    isRolling ? " random-main-ball--rolling" : ""
                  }`}
                >
                  <span className="random-main-number">
                    {displayValue}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleDraw}
          disabled={isRolling}
        >
          Draw number
        </button>

        {showHistory && (
          <p className="muted">
            Recent draws:{" "}
            {Array.from(new Set(drawn.slice(-3)))
              .slice()
              .reverse()
              .join(" · ")}
          </p>
        )}
      </section>
    </div>
  );
}

