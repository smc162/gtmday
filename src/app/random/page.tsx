"use client";

import { useEffect, useRef, useState } from "react";

const BALL_COUNT = 12;
const FLOATING_BALLS = 20;
const FLOATING_SIZE = 72;

function getNextPreview(previous: number | null): number {
  const base = Math.floor(Math.random() * BALL_COUNT) + 1;
  if (previous === null || base !== previous) return base;
  return ((base % BALL_COUNT) ?? 1) + 1;
}

type FloatingBall = {
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

  const fieldRef = useRef<HTMLDivElement | null>(null);
  const floatingRef = useRef<FloatingBall[]>([]);

  useEffect(() => {
    const field = fieldRef.current;
    if (!field) return;

    const rect = field.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const balls: FloatingBall[] = Array.from({ length: FLOATING_BALLS }).map(
      () => ({
        x: Math.random() * Math.max(1, width - FLOATING_SIZE),
        y: Math.random() * Math.max(1, height - FLOATING_SIZE),
        vx: (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 80),
        vy: (Math.random() > 0.5 ? 1 : -1) * (60 + Math.random() * 80),
      }),
    );

    floatingRef.current = balls;
    setFloating(balls);

    let animationFrame: number;
    let lastTime = performance.now();

    const step = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const next = floatingRef.current.map((ball) => {
        let x = ball.x + ball.vx * dt;
        let y = ball.y + ball.vy * dt;
        let vx = ball.vx;
        let vy = ball.vy;

        if (x <= 0) {
          x = 0;
          vx = Math.abs(vx);
        } else if (x + FLOATING_SIZE >= width) {
          x = width - FLOATING_SIZE;
          vx = -Math.abs(vx);
        }

        if (y <= 0) {
          y = 0;
          vy = Math.abs(vy);
        } else if (y + FLOATING_SIZE >= height) {
          y = height - FLOATING_SIZE;
          vy = -Math.abs(vy);
        }

        return { x, y, vx, vy };
      });

      floatingRef.current = next;
      setFloating(next);
      animationFrame = window.requestAnimationFrame(step);
    };

    animationFrame = window.requestAnimationFrame(step);

    return () => window.cancelAnimationFrame(animationFrame);
  }, []);

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
      }
    }, 120);
  };

  const hasSelection = selected !== null;
  const displayValue = isRolling ? preview ?? selected ?? "?" : hasSelection ? selected : "?";
  const showHistory = drawn.length > 0;

  return (
    <div className="page-shell">
      <section className="random-layout">
        <div className="random-main">
          <div className="random-field" ref={fieldRef}>
            {floating.map((ball, index) => (
              <div
                key={index}
                className="random-floating-ball"
                style={{
                  transform: `translate(${ball.x}px, ${ball.y}px)`,
                }}
              />
            ))}
          </div>

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
                key="idle"
                className={`random-main-ball${
                  isRolling ? " random-main-ball--rolling" : ""
                }`}
              >
                <span className="random-main-number">
                  {isRolling ? displayValue : "?"}
                </span>
              </div>
            )}
          </div>
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

